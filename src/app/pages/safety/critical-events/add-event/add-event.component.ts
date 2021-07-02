import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from, Subject, throwError  } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'aws-amplify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router} from '@angular/router';
import * as moment from 'moment';
import { HereMapService } from '../../../../services';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { SafetyService } from 'src/app/services/safety.service';

declare var $: any;

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

    errors = {};
    event = {
        driverID: null,
        vehicleID: null,
        eventDate: '',
        eventTime: '',
        eventType: null,
        eventSource: 'manual',
        createdBy: '',
        location: '',
        notes: '',
        status: 'open',
    };
    uploadedPhotos = [];
    uploadedVideos = [];
    carrierID = '';
    selectedFiles: FileList;
    selectedFileNames: Map<any, any>;
    criticalityType = [
        {
            value: 'harshBrake',
            name: 'Harsh Brake'
        },
        {
            value: 'harshAcceleration',
            name: 'Harsh Acceleration'
        },
        {
            value: 'overSpeedingStart',
            name: 'Over Speeding Start'
        },
        {
            value: 'overSpeedingEnd',
            name: 'Over Speeding End'
        },
        {
            value: 'harshTurn',
            name: 'Harsh Turn'
        },
        {
            value: 'crash',
            name: 'Crash'
        },
        {
            value: 'rollingStop',
            name: 'Rolling Stop'
        }
    ];

    severity = [
        {
            value: 'high',
            name: 'High'
        },
        {
            value: 'medium',
            name: 'Medium'
        },
        {
            value: 'low',
            name: 'Low'
        },
    ];
    vehicles = [];
    drivers  = [];
    users = [];
    trips = [];

  
    public searchResults: any;
    private readonly search: any;
    public searchTerm = new Subject<string>();
    
    uploadedDocs = [];
    currentUser: any;

    constructor(private apiService: ApiService, private safetyService: SafetyService, private toastr: ToastrService,
                private spinner: NgxSpinnerService, private router: Router, private hereMap: HereMapService) {
                this.selectedFileNames = new Map<any, any>();
    }

    ngOnInit() {
        this.fetchVehicles();
        this.fetchDrivers();
        // this.fetchUsers();
        this.disabledButton();
        this.fetchTrips();
        this.searchLocation();
        this.getCurrentuser();
    }

    getCurrentuser = async () => {
        let result = (await Auth.currentSession()).getIdToken().payload;
        this.currentUser = `${result.firstName} ${result.lastName}`;
        this.event.createdBy = this.currentUser;
    }

    fetchVehicles() {
        this.apiService.getData('vehicles')
        .subscribe((result: any) => {
            this.vehicles = result.Items;
        })
    }

    fetchDrivers() {
        this.apiService.getData('drivers/safety')
        .subscribe((result: any) => {
            this.drivers =  result.Items;
        })
    }

    fetchUsers() {
        this.apiService.getData('users/fetch/records')
        .subscribe((result: any) => {
            result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
            this.users = result.Items;
        })
    }

    fetchTrips() {
        this.apiService.getData('trips')
        .subscribe((result: any) => {
            for (let i = 0; i < result.Items.length; i++) {
                const element = result.Items[i];
                if (element.isDeleted === 0) {
                    this.trips.push(element);
                }
            }
        });
    }

    addEvent() {
        this.spinner.show();
        this.hideErrors();
        let timestamp;
        const fdate = this.event.eventDate.split('-');
        const date = fdate[2] + '-' + fdate[1] + '-' + fdate[0];
        timestamp = moment(date + ' ' + this.event.eventTime).format('X');
        // this.event.date = (timestamp * 1000).toString();
        // this.event.documentID = this.uploadedDocs;
        // this.event.incidentVideodocumentID = this.uploadedVideos;
        
        // create form data instance
        const formData = new FormData();

        // append videos if any
        for (let i = 0; i < this.uploadedVideos.length; i++){
            formData.append('uploadedVideos', this.uploadedVideos[i]);
        }

        // append docs if any
        for (let j = 0; j < this.uploadedPhotos.length; j++){
            formData.append('uploadedPhotos', this.uploadedPhotos[j]);
        }

        // append other fields
        formData.append('data', JSON.stringify(this.event));
        
        this.safetyService.postData('critical-events', formData, true).subscribe({
            complete: () => {},
            error: (err: any) => {
                from(err.error)
                    .pipe(
                        map((val: any) => {
                            val.message = val.message.replace(/".*"/, 'This Field');
                            this.errors[val.context.key] = val.message;
                        })
                    )
                    .subscribe({
                        complete: () => {
                            this.spinner.hide();
                            this.throwErrors();
                        },
                        error: () => {
                        },
                        next: () => {
                        },
                    });
            },
            next: (res) => {
                this.spinner.hide();
                this.toastr.success('Critical event added successfully');
                this.router.navigateByUrl('/safety/critical-events');
            },
        });
    }

    throwErrors() {
        from(Object.keys(this.errors))
          .subscribe((v) => {
            $('[name="' + v + '"]')
              .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
              .addClass('error')
          });
    }

    disabledButton() {
        
        if(this.event.driverID == '' || this.event.driverID == null || this.event.vehicleID == '' || this.event.vehicleID == null || this.event.eventDate == '' ||
        this.event.eventType == '' || this.event.createdBy == '' || this.event.location == '' || this.event.notes == '' || this.event.status == '' || this.event.eventSource == '' 
        || this.uploadedPhotos.length == 0 || this.uploadedVideos.length == 0) {
            console.log('true')
            return true
        } else {
            console.log('false')
            return false;
        }
    }

    hideErrors() {
        from(Object.keys(this.errors))
          .subscribe((v) => {
            $('[name="' + v + '"]')
              .removeClass('error')
              .next()
              .remove('label')
          });
        this.errors = {};
    }

    public searchLocation() {
        this.searchTerm.pipe(
          map((e: any) => {
            $(e.target).closest('div').addClass('show-search__result');
            return e.target.value;
          }),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(term => {
            return this.hereMap.searchEntries(term);
          }),
          catchError((e) => {
            return throwError(e);
          }),
        ).subscribe(res => {
          this.searchResults = res;
        });
    }

    async assignLocation(label) {
        this.event.location = label;
        this.searchResults = false;
        $('div').removeClass('show-search__result');
    }

    /*
    * Selecting files before uploading
    */
    selectDocuments(event, obj) {
        let files = [...event.target.files];

        if (obj === 'uploadedPhotos') {
            this.uploadedPhotos = [];
            for (let i = 0; i < files.length; i++) {
                this.uploadedPhotos.push(files[i])
            }
        } else {
            
            this.uploadedVideos = [];
            for (let i = 0; i < files.length; i++) {
                this.uploadedVideos.push(files[i])
            }
        }
        console.log('this.uploadedPhotos', this.uploadedPhotos);
        console.log('this.uploadedVideos', this.uploadedVideos);
    }

}

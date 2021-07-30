import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HereMapService } from '../../../../services';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { SafetyService } from 'src/app/services/safety.service';
import { Auth } from 'aws-amplify';
declare var $: any;
@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.css']
})
export class AddIncidentComponent implements OnInit {

    errors = {};
    event = {
        eventDate: '',
        eventTime: '',
        driverID: null,
        vehicleID: null,
        tripID: null,
        assigned: null,
        incidentType: null,
        eventSource: 'manual',
        locationText:'',
        severity: null,
        location: '',
        notes: '',
        status: 'open',
    };
    uploadedVideos = [];
    uploadedDocs = [];
    uploadedPhotos = [];

    carrierID = '';
    selectedFiles: FileList;
    selectedFileNames: Map<any, any>;
    incidentType = [
        {
            value: 'majorAccident',
            name: 'Major Accident'
        },
        {
            value: 'minorAccident',
            name: 'Minor Accident'
        },
        {
            value: 'overSpeeding',
            name: 'Over Speeding'
        },
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
    safetyManagers = [];
    disableButton = false;
    currentUser: string;
    photoSizeError = '';
    videoSizeError = '';
    docSizeError = '';

    public searchResults: any;
    private readonly search: any;
    public searchTerm = new Subject<string>();
    
  birthDateMinLimit: any;
  birthDateMaxLimit: any;

    constructor(private apiService: ApiService, private safetyService: SafetyService, private toastr: ToastrService,
                private spinner: NgxSpinnerService,
                private router: Router, private hereMap: HereMapService) {
                this.selectedFileNames = new Map<any, any>();
                const date = new Date();
                this.birthDateMinLimit = { year: 1950, month: 1, day: 1 };
                this.birthDateMaxLimit = { year: date.getFullYear(), month: 12, day: 31 };
    }

    ngOnInit() {
        this.fetchVehicles();
        this.fetchDrivers();
        this.fetchTrips();
        this.searchLocation();
        this.getCurrentUser();
        this.disabledButton();
    }

    getCurrentUser = async () => {
        let result = (await Auth.currentSession()).getIdToken().payload;
        this.currentUser = `${result.firstName} ${result.lastName}`;
        this.safetyManagers.push(this.currentUser);
    }

    disabledButton() {
        
        if(this.event.driverID == '' || this.event.driverID == null || this.event.vehicleID == '' || this.event.vehicleID == null || 
            this.event.tripID == '' || this.event.tripID == null || this.event.eventDate == '' || this.event.eventDate == null || this.event.eventTime == '' ||
            this.event.eventTime == null || this.event.assigned == '' || this.event.assigned == null || this.event.severity == '' || this.event.severity == null || this.event.incidentType == '' || this.event.incidentType == null || 
            this.event.locationText == '' || this.event.notes == '' || this.event.status == '' || this.event.eventSource == '' 
        || this.uploadedPhotos.length == 0 || this.uploadedVideos.length == 0 || this.uploadedDocs.length == 0  || this.event.notes.length > 500) {
            return true
        } else {
            return false;
        }
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

    fetchTrips() {
        this.apiService.getData('trips/safety/active')
        .subscribe((result: any) => {
            this.trips = result.Items;
        })
    }

    addEvent() {
        this.disableButton = true;
        this.hideErrors();
        
        // create form data instance
        const formData = new FormData();

        // append videos if any
        for (let i = 0; i < this.uploadedVideos.length; i++){
            formData.append('uploadedVideos', this.uploadedVideos[i]);
        }

        // append photos if any
        for (let j = 0; j < this.uploadedPhotos.length; j++){
            formData.append('uploadedPhotos', this.uploadedPhotos[j]);
        }

        // append docs if any
        for (let j = 0; j < this.uploadedDocs.length; j++){
            formData.append('uploadedDocs', this.uploadedDocs[j]);
        }

        // append other fields
        formData.append('data', JSON.stringify(this.event));
        
        this.safetyService.postData('incidents', formData, true).subscribe({
            complete: () => {},
            error: (err: any) => {
                this.disableButton = false;
                from(err.error)
                    .pipe(
                        map((val: any) => {
                            val.message = val.message.replace(/".*"/, 'This Field');
                            this.errors[val.context.key] = val.message;
                            this.disableButton = false;
                        })
                    )
                    .subscribe({
                        complete: () => {
                            this.disableButton = false;
                            this.throwErrors();
                        },
                        error: () => {
                            this.disableButton = false;
                        },
                        next: () => {
                        },
                    });
            },
            next: (res) => {
                this.spinner.hide();
                this.toastr.success('Incident added successfully');
                this.router.navigateByUrl('/safety/incidents');
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

    async assignLocation(position: any,title:string) {
        if (position) {
            this.event.location = `${position.lat},${position.lng}`;
            this.event.locationText=title;
            this.searchResults = false;
            $('div').removeClass('show-search__result');
        } else {
            this.event.locationText=title;
            this.event.location = '0,0';
        }
    }

     /*
    * Selecting files before uploading
    */
     selectDocuments(event, obj) {
        let files = [...event.target.files];
        let filesSize = 0;

        if(files.length > 5) {
            this.toastr.error('files count limit exceeded');
            if (obj === 'uploadedPhotos') {
                this.photoSizeError = 'files should not be more than 5';
            } else if(obj === 'uploadedDocs') {
                this.docSizeError = 'files should not be more than 5';
            } else {
                this.videoSizeError = 'files should not be more than 5';
            }
            return;
        }

        if (obj === 'uploadedPhotos') {
            this.uploadedPhotos = [];
            for (let i = 0; i < files.length; i++) {
                filesSize += files[i].size / 1024 / 1024;
                if(filesSize > 10) {
                    this.toastr.error('file(s) size limit exceeded.');
                    this.photoSizeError = 'Please select file which have size below 10 MB.';
                    return;
                } else {
                    this.photoSizeError = '';
                    let name = files[i].name.split('.');
                    let ext = name[name.length - 1].toLowerCase();
                    if(ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
                        this.uploadedPhotos.push(files[i])
                    } else {
                        this.photoSizeError = 'Only .jpg, .jpeg, .png files allowed.';
                    }
                    
                }
            }
        } else if(obj === 'uploadedDocs') {
            
            this.uploadedDocs = [];
            for (let i = 0; i < files.length; i++) {
                
                filesSize += files[i].size / 1024 / 1024;

                if(filesSize > 10) {
                    this.toastr.error('file(s) size limit exceeded.');
                    this.docSizeError = 'Please select file which have size below 10 MB.';
                    return;
                } else {
                    this.docSizeError = '';
                    let name = files[i].name.split('.');
                    let ext = name[name.length - 1].toLowerCase();
                    if(ext == 'doc' || ext == 'docx' || ext == 'pdf') {
                        this.uploadedDocs.push(files[i])
                    } else {
                        this.docSizeError = 'Only .doc, .docx and .pdf files allowed.';
                    }
                    
                }
            }
        } else {
            
            this.uploadedVideos = [];
            for (let i = 0; i < files.length; i++) {
                filesSize += files[i].size / 1024 / 1024;

                if(filesSize > 30) {
                    this.toastr.error('files size limit exceeded');
                    this.videoSizeError = 'Please select file which have size below 30 MB';
                    return;
                } else {
                    this.videoSizeError = '';
                    let name = files[i].name.split('.');
                    let ext = name[name.length - 1].toLowerCase();
                    if(ext == 'mp4' || ext == 'mov') {
                        this.uploadedVideos.push(files[i])
                    } else {
                        this.videoSizeError = 'Only .mp4 and .mov files allowed';
                    }
                    
                }
                
            }
        }
        
       
    }

    
}

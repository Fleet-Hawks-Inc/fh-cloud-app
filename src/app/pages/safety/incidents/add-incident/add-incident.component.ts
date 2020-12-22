import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";

@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.css']
})
export class AddIncidentComponent implements OnInit {

    errors = {};
    event = {
        eventDate: '',
        date: <any>'',
        // filterDate: '',
        eventTime: '',
        location: '',
        username: '',
        driverUsername: '',
        vehicleID: '',
        severity: '',
        tripID: '',
        documentID: [],
        incidentVideodocumentID: [],
        remarks: '',
        eventType: 'incident',
        modeOfOrign: 'manual',
        coachingStatus: 'open'
    };
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

    constructor(private apiService: ApiService, private awsUS: AwsUploadService,private toastr: ToastrService, 
        private spinner: NgxSpinnerService, private router: Router) { 

        this.selectedFileNames = new Map<any, any>();
    }

    ngOnInit() {
        this.fetchVehicles();
        this.fetchDrivers();
        this.fetchUsers();
        this.fetchTrips();
    }

    fetchVehicles() {
        this.apiService.getData('vehicles')
        .subscribe((result: any) => {
            this.vehicles = result.Items;
        })
    }

    fetchDrivers() {
        this.apiService.getData('drivers')
        .subscribe((result: any) => {
            result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
            for (let i = 0; i < result.Items.length; i++) {
                const element = result.Items[i];
                if(element.isDeleted == 0) {
                    this.drivers.push(element);
                }   
            }
        })
    }

    fetchUsers() {
        this.apiService.getData('users/fetch/records')
        .subscribe((result: any) => {
            console.log('users');
            console.log(result.Items)
            result.Items.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i; });
            this.users = result.Items;
        })
    }

    fetchTrips() {
        this.apiService.getData('trips')
        .subscribe((result: any) => {
            for (let i = 0; i < result.Items.length; i++) {
                const element = result.Items[i];
                if(element.isDeleted == 0) {
                    this.trips.push(element);
                }   
            }
        })
    }

    addEvent() {
        this.spinner.show();
        this.hideErrors();

        let timestamp;
        let fdate = this.event.eventDate.split('-');
        let date = fdate[2]+'-'+fdate[1]+'-'+fdate[0];
        timestamp = moment(date+' '+ this.event.eventTime).format("X");
        this.event.date = timestamp*1000;

        this.apiService.postData('safety/eventLogs', this.event).subscribe({
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
                this.uploadFiles();
                this.spinner.hide();
                this.toastr.success('Incident added successfully');
                this.router.navigateByUrl('/safety/incidents');
            },
        });
    }

    throwErrors() {
        console.log(this.errors);
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
    
    uploadFiles = async () => {
        this.carrierID = await this.apiService.getCarrierID();
        this.selectedFileNames.forEach((fileData: any, fileName: string) => {
          this.awsUS.uploadFile(this.carrierID, fileName, fileData);
        });
    }

    selectDocuments(event, obj) {
        this.selectedFiles = event.target.files;
        if (obj === 'document') {
          for (let i = 0; i < this.selectedFiles.item.length; i++) {
            const randomFileGenerate = this.selectedFiles[i].name.split('.');
            const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
            this.selectedFileNames.set(fileName, this.selectedFiles[i]);
            this.event.documentID.push(fileName);
          }
        } else {
          for (let i = 0; i < this.selectedFiles.item.length; i++) {
            const randomFileGenerate = this.selectedFiles[i].name.split('.');
            const fileName = `${uuidv4(randomFileGenerate[0])}.${randomFileGenerate[1]}`;
            this.selectedFileNames.set(fileName, this.selectedFiles[i]);
            this.event.incidentVideodocumentID.push(fileName);
          }
        }
    }
}

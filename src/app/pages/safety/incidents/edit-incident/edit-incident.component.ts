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
    selector: 'app-edit-incident',
    templateUrl: './edit-incident.component.html',
    styleUrls: ['./edit-incident.component.css']
})
export class EditIncidentComponent implements OnInit {

    errors = {};
    event = {
        eventID: '',
        date: <any>'',
        eventDate: '',
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
        criticalityType: '',
        eventType: 'incident',
        modeOfOrign: 'manual',
        coachingStatus: '',
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
    drivers = [];
    users = [];
    trips = [];
    eventData = {};
    eventID = '';

    constructor(private apiService: ApiService, private awsUS: AwsUploadService, private toastr: ToastrService,
        private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute) {

        this.selectedFileNames = new Map<any, any>();
    }

    ngOnInit() {
        this.eventID = this.route.snapshot.params['eventID'];
        this.fetchEventDetail();
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
                    if (element.isDeleted == '0') {
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
                    if (element.isDeleted == '0') {
                        this.trips.push(element);
                    }
                }
            })
    }

    updateEvent() {
        this.spinner.show();
        this.hideErrors();

        let timestamp;
        let fdate = this.event.eventDate.split('-');
        let date = fdate[2]+'-'+fdate[1]+'-'+fdate[0];
        timestamp = moment(date+' '+ this.event.eventTime).format("X");
        this.event.date = timestamp*1000;

        this.apiService.putData('safety/eventLogs', this.event).subscribe({
            complete: () => { },
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
                this.toastr.success('Critical event updated successfully');
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

    fetchEventDetail() {
        this.spinner.show();
        this.apiService.getData('safety/eventLogs/details/' + this.eventID)
            .subscribe((result: any) => {
                console.log(result.Items)
                this.event.eventID = result.Items[0].eventID;
                this.event.eventDate = moment(result.Items[0].date).format("DD-MM-YYYY");
                this.event.eventTime = moment(result.Items[0].date).format("HH:mm");
                this.event.location = result.Items[0].location;
                this.event.username = result.Items[0].username;
                this.event.driverUsername = result.Items[0].driverUsername;
                this.event.vehicleID = result.Items[0].vehicleID;
                this.event.severity = result.Items[0].severity;
                this.event.tripID = result.Items[0].tripID;
                this.event.remarks = result.Items[0].remarks;
                this.event.criticalityType = result.Items[0].criticalityType;
                this.event.documentID = result.Items[0].documentID;
                this.event.incidentVideodocumentID = result.Items[0].incidentVideodocumentID;
                this.event.coachingStatus = result.Items[0].coachingStatus;
                // this.event.timeCreated = result.Items[0].timeCreated;

                this.spinner.hide();
            })
    }
}
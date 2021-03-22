import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HereMapService } from '../../../../services';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { DomSanitizer} from '@angular/platform-browser';
declare var $: any;
@Component({
    selector: 'app-edit-incident',
    templateUrl: './edit-incident.component.html',
    styleUrls: ['./edit-incident.component.css']
})
export class EditIncidentComponent implements OnInit {

    Asseturl = this.apiService.AssetUrl;
    errors = {};
    event = {
        eventID: '',
        date: <any>'',
        eventDate: '',
        eventTime: '',
        location: '',
        assignedUsername: '',
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

    pdfSrc: any = '';
    uploadedVideos = [];
    uploadedDocs = [];
    eventDocs = [];
    eventVideos = [];
    existingDocs = [];
    existingVideos = [];

    public searchResults: any;
    private readonly search: any;
    public searchTerm = new Subject<string>();

    constructor(private apiService: ApiService, private toastr: ToastrService,
        private spinner: NgxSpinnerService, private route: ActivatedRoute, private hereMap: HereMapService, private domSanitizer: DomSanitizer) {

        this.selectedFileNames = new Map<any, any>();
    }

    ngOnInit() {
        this.eventID = this.route.snapshot.params['eventID'];
        this.fetchEventDetail();
        this.fetchVehicles();
        this.fetchDrivers();
        this.fetchUsers();
        this.fetchTrips();
        this.searchLocation();
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
                    if (element.isDeleted == 0) {
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
                    if (element.isDeleted == 0) {
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
        let date = fdate[2] + '-' + fdate[1] + '-' + fdate[0];
        timestamp = moment(date + ' ' + this.event.eventTime).format("X");
        this.event.date = timestamp * 1000;

        this.event.documentID = this.existingDocs;
        this.event.incidentVideodocumentID = this.existingVideos;

        // create form data instance
        const formData = new FormData();

        //append videos if any
        for(let i = 0; i < this.uploadedVideos.length; i++){
            formData.append('uploadedVideos', this.uploadedVideos[i]);
        }

        //append docs if any
        for(let j = 0; j < this.uploadedDocs.length; j++){
            formData.append('uploadedDocs', this.uploadedDocs[j]);
        }

        //append other fields
        formData.append('data', JSON.stringify(this.event));

        this.apiService.putData('safety/eventLogs', formData, true).subscribe({
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

    fetchEventDetail() {
        this.spinner.show();
        this.apiService.getData('safety/eventLogs/details/' + this.eventID)
            .subscribe((result: any) => {
                console.log(result.Items)
                this.event.eventID = result.Items[0].eventID;
                this.event.eventDate = moment(result.Items[0].date).format("DD-MM-YYYY");
                this.event.eventTime = moment(result.Items[0].date).format("HH:mm");
                this.event.location = result.Items[0].location;
                this.event.assignedUsername = result.Items[0].assignedUsername;
                this.event.driverUsername = result.Items[0].driverUsername;
                this.event.vehicleID = result.Items[0].vehicleID;
                this.event.severity = result.Items[0].severity;
                this.event.tripID = result.Items[0].tripID;
                this.event.remarks = result.Items[0].remarks;
                this.event.criticalityType = result.Items[0].criticalityType;
                this.event.documentID = result.Items[0].documentID;
                this.event.incidentVideodocumentID = result.Items[0].incidentVideodocumentID;
                this.event.coachingStatus = result.Items[0].coachingStatus;
                this.existingDocs = result.Items[0].documentID;
                this.existingVideos = result.Items[0].incidentVideodocumentID;
                if(result.Items[0].documentID.length > 0 && result.Items[0].documentID != undefined) {
                    this.eventDocs = result.Items[0].documentID.map(x => ({path: `${this.Asseturl}/${result.Items[0].carrierID}/${x}`, name: x}));
                } else {
                    this.eventDocs = []
                }
                if(result.Items[0].incidentVideodocumentID.length > 0 && result.Items[0].incidentVideodocumentID != undefined) {
                    this.eventVideos = result.Items[0].incidentVideodocumentID.map(x => ({path: `${this.Asseturl}/${result.Items[0].carrierID}/${x}`, name: x}));
                } else {
                    this.eventVideos = [];
                }

                this.event['timeCreated'] = result.Items[0].timeCreated;
                this.spinner.hide();
            })
    }

    public searchLocation() {
        let target;
        this.searchTerm.pipe(
            map((e: any) => {
                $('.map-search__results').hide();
                $(e.target).closest('div').addClass('show-search__result');
                target = e;
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

        if (obj === 'uploadedDocs') {
            this.uploadedDocs = [];
            for (let i = 0; i < files.length; i++) {
                this.uploadedDocs.push(files[i])
            }
        } else {
            this.uploadedVideos = [];
            for (let i = 0; i < files.length; i++) {
                this.uploadedVideos.push(files[i])
            }
        }
    }

    setPDFSrc(val) {
        let pieces = val.split(/[\s.]+/);
        let ext = pieces[pieces.length - 1];
        this.pdfSrc = '';
        if (ext == 'doc' || ext == 'docx' || ext == 'xlsx') {
            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://docs.google.com/viewer?url=' + val + '&embedded=true');
        } else {
            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
        }
    }

    // delete uploaded videos and documents
    delete(type: string, name: string) {
        this.apiService.deleteData(`safety/eventLogs/uploadDelete/${this.eventID}/${type}/${name}`).subscribe((result: any) => {
            this.fetchEventDetail();
            let alertmsg = '';
            if (type == 'doc') {
                alertmsg = 'Document';
            } else {
                alertmsg = 'Video';
            }
            this.toastr.success(alertmsg + ' Deleted Successfully');
        });
    }
}
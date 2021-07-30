import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'aws-amplify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
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
        vehicleID: null,
        eventDate: '',
        eventTime: '',
        eventType: null,
        eventSource: 'manual',
        createdBy: '',
        locationText: '',
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
            value: 'highSpeed',
            name: 'High Speed'
        },
        {
            value: 'highSpeed',
            name: 'High Speed'
        }, {
            value: 'impactTilt',
            name: 'Impact/Tilt'
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
    drivers = [];
    users = [];
    trips = [];
    photoSizeError = '';
    videoSizeError = '';

    public searchResults: any;
    private readonly search: any;
    public searchTerm = new Subject<string>();

    uploadedDocs = [];
    currentUser: any;
    disableButton = false;
    birthDateMinLimit: any;
    birthDateMaxLimit: any;

    constructor(private apiService: ApiService, private safetyService: SafetyService, private toastr: ToastrService,
        private spinner: NgxSpinnerService, private router: Router, private hereMap: HereMapService) {
        this.selectedFileNames = new Map<any, any>();
        const date = new Date();
        this.birthDateMinLimit = { year: 1950, month: 1, day: 1 };
        this.birthDateMaxLimit = { year: date.getFullYear(), month: 12, day: 31 };
    }

    ngOnInit() {
        this.fetchVehicles();
        this.fetchDrivers();

        this.disabledButton();
        this.fetchTrips();
        this.searchLocation();
        this.getCurrentuser();
    }

    /**
     * Get Current User logged in
     */
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
                this.drivers = result.Items;
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
        this.disableButton = true;
        this.hideErrors();

        // create form data instance
        const formData = new FormData();

        // append videos if any
        for (let i = 0; i < this.uploadedVideos.length; i++) {
            formData.append('uploadedVideos', this.uploadedVideos[i]);
        }

        // append docs if any
        for (let j = 0; j < this.uploadedPhotos.length; j++) {
            formData.append('uploadedPhotos', this.uploadedPhotos[j]);
        }

        // append other fields
        formData.append('data', JSON.stringify(this.event));

        this.safetyService.postData('critical-events', formData, true).subscribe({
            complete: () => { },
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

        if (this.event.vehicleID == '' || this.event.vehicleID == null || this.event.eventDate == '' ||
            this.event.eventType == '' || this.event.createdBy == '' || this.event.location == '' || this.event.notes == '' || this.event.status == '' || this.event.eventSource == ''
            || this.uploadedPhotos.length == 0 || this.uploadedVideos.length == 0 || this.event.notes.length > 500) {
            return true
        } else {
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

    async assignLocation(position: any, title: string) {
        if (position) {
            this.event.location = `${position.lat},${position.lng}`;
            this.event.locationText = title;
            this.searchResults = false;
            $('div').removeClass('show-search__result');
        } else {
            this.event.locationText = title;
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
            } else {
                this.videoSizeError = 'files should not be more than 5';
            }
            return;
        }

        if (obj === 'uploadedPhotos') {
            this.uploadedPhotos = [];

            for (let i = 0; i < files.length; i++) {
                filesSize += files[i].size / 1024 / 1024;
                if (filesSize > 10) {
                    this.toastr.error('files size limit exceeded');
                    this.photoSizeError = 'Please select file which have size below 10 MB';
                    return;
                } else {
                    this.photoSizeError = '';
                    let name = files[i].name.split('.');
                    let ext = name[name.length - 1].toLowerCase();
                    if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
                        this.uploadedPhotos.push(files[i])
                    } else {
                        this.photoSizeError = 'Only .jpg, .jpeg, .png files allowed';
                    }

                }

            }
        } else {

            this.uploadedVideos = [];
            for (let i = 0; i < files.length; i++) {
                filesSize += files[i].size / 1024 / 1024;

                if (filesSize > 30) {
                    this.toastr.error('files size limit exceeded');
                    this.videoSizeError = 'Please select file which have size below 30 MB';
                    return;
                } else {
                    this.videoSizeError = '';
                    let name = files[i].name.split('.');
                    let ext = name[name.length - 1].toLowerCase();
                    if (ext == 'mp4' || ext == 'mov') {
                        this.uploadedVideos.push(files[i])
                    } else {
                        this.videoSizeError = 'Only .mp4 and .mov files allowed';
                    }

                }

            }
        }

    }

}

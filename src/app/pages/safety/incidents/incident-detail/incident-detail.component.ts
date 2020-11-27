import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { HereMapService } from '../../../../services/here-map.service';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private hereMap: HereMapService) {
  }

  errors = {};
  event = {
    eventDate: '',
    eventTime: '',
    location: '',
    driverUsername: '',
    driverName: '',
    criticalityType: '',
    vehicleName: '',
    AsigneeName: '',
    tripNo: '',
    severity: ''
  };

  eventID = '';

  ngOnInit() {
    this.eventID = this.route.snapshot.params['eventID'];
    this.fetchEventDetail();
    this.mapShow();
  }

  fetchEventDetail() {
    this.spinner.show();
    this.apiService.getData('safety/eventLogs/details/' + this.eventID)
      .subscribe((result: any) => {
        this.event.eventDate = result.Items[0].eventDate;
        this.event.eventTime = result.Items[0].eventTime;
        this.event.location = result.Items[0].location;
        this.event.driverUsername = result.Items[0].driverUsername;
        this.event.severity = result.Items[0].severity;
        // this.event.criticalityType = result.Items[0].criticalityType;  

        if(result.Items[0].criticalityType == 'harshBrake') {
          this.event.criticalityType = 'Harsh Brake';
        } else if(result.Items[0].criticalityType == 'harshAcceleration') {
          this.event.criticalityType = 'Harsh Acceleration';
        } else if(result.Items[0].criticalityType == 'overSpeeding') {
          this.event.criticalityType = 'Over Speeding';
        }
        
        this.fetchDriverDetail(this.event.driverUsername);
        this.fetchVehicleDetail(result.Items[0].vehicleID);
        this.fetchUserDetail(result.Items[0].username);
        this.fetchTripDetail(result.Items[0].tripID);

        console.log('this.event')
        console.log(this.event)
        this.spinner.hide();
      })
  }

  deleteEvent() {
    this.spinner.show();
    this.apiService.getData('safety/eventLogs/delete/' + this.eventID + '/1').subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        this.spinner.hide();
        this.toastr.success('Event deleted successfully');
        this.router.navigateByUrl('/safety/incidents');
      }
    })
  }

  mapShow() {
    this.hereMap.mapInit();
  }

  fetchDriverDetail(driverUserName) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          this.event.driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      })
  }

  fetchVehicleDetail(vehicleID) {
    this.apiService.getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].vehicleIdentification != undefined) {
          this.event.vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchUserDetail(userName) {
    this.apiService.getData('users/' + userName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          this.event.AsigneeName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      })
  }

  fetchTripDetail(tripID) {
    this.apiService.getData('trips/' + tripID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].tripNo != undefined) {
          this.event.tripNo = result.Items[0].tripNo;
        }
      })
  }
}
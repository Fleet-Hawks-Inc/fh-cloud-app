import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services/here-map.service';
import * as moment from 'moment';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private hereMap: HereMapService) {
  }

  errors = {};
  event = {
    eventDate: '',
    eventTime: '',
    location: '',
    driverUsername: '-',
    driverName: '-',
    criticalityType: '-',
    vehicleName: '-',
    AsigneeName: '-',
    tripNo: '-',
    severity: '-'
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

        this.event.eventDate = moment(result.Items[0].date).format("DD-MM-YYYY");
        this.event.eventTime = moment(result.Items[0].date).format("HH:mm");
        this.event.location = result.Items[0].location;
        this.event.driverUsername = result.Items[0].driverUsername;

        if(result.Items[0].severity != '' && result.Items[0].severity != undefined) {
          this.event.severity = result.Items[0].severity; 
        }

        if(result.Items[0].criticalityType == 'harshBrake') {
          this.event.criticalityType = 'Harsh Brake';
        } else if(result.Items[0].criticalityType == 'harshAcceleration') {
          this.event.criticalityType = 'Harsh Acceleration';
        } else if(result.Items[0].criticalityType == 'overSpeeding') {
          this.event.criticalityType = 'Over Speeding';
        }
        
        if(this.event.driverUsername != '' && this.event.driverUsername != undefined) {
          this.fetchDriverDetail(this.event.driverUsername);
        }
        if(result.Items[0].vehicleID != '' && result.Items[0].vehicleID != undefined) {
          this.fetchVehicleDetail(result.Items[0].vehicleID);
        }
        if(result.Items[0].assignedUsername != '' && result.Items[0].assignedUsername != undefined) {
          this.fetchUserDetail(result.Items[0].assignedUsername);
        }
        if(result.Items[0].tripID != '' && result.Items[0].tripID != undefined) {
          this.fetchTripDetail(result.Items[0].tripID);
        }
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
        
        if (result.Items[0].firstName != undefined) {
          this.event.driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      })
  }

  fetchVehicleDetail(vehicleID) {
    this.apiService.getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        
        if (result.Items[0].vehicleIdentification != undefined) {
          this.event.vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchUserDetail(userName) {
    this.apiService.getData('users/' + userName)
      .subscribe((result: any) => {
        
        if (result.Items[0].firstName != undefined) {
          this.event.AsigneeName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      })
  }

  fetchTripDetail(tripID) {
    this.apiService.getData('trips/' + tripID)
      .subscribe((result: any) => {
        
        if (result.Items[0].tripNo != undefined) {
          this.event.tripNo = result.Items[0].tripNo;
        }
      })
  }
}
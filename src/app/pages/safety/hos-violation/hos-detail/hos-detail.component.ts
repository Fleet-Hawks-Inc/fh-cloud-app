import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { AwsUploadService } from '../../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hos-detail',
  templateUrl: './hos-detail.component.html',
  styleUrls: ['./hos-detail.component.css']
})
export class HosDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private awsUS: AwsUploadService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute) {
  }

  event = {
    eventDate: '',
    eventTime: '',
    location: '',
    driverUsername: '',
    driverName: '',
    driverID: '',
    criticalityType: '',
    vehicleName: ''
  };

  eventID = '';

  ngOnInit() {
    this.eventID = this.route.snapshot.params['eventID'];
    this.fetchEventDetail();
  }

  fetchEventDetail() {
    this.spinner.show();
    this.apiService.getData('safety/eventLogs/details/' + this.eventID)
      .subscribe((result: any) => {
        this.event.eventDate = result.Items[0].eventDate;
        this.event.eventTime = result.Items[0].eventTime;
        this.event.location = result.Items[0].location;
        this.event.driverUsername = result.Items[0].driverUsername;
        // this.event.criticalityType = result.Items[0].criticalityType;  

        if (result.Items[0].criticalityType == 'harshBrake') {
          this.event.criticalityType = 'Harsh Brake';
        } else if (result.Items[0].criticalityType == 'harshAcceleration') {
          this.event.criticalityType = 'Harsh Acceleration';
        } else if (result.Items[0].criticalityType == 'overSpeeding') {
          this.event.criticalityType = 'Over Speeding';
        }

        this.fetchDriverDetail(this.event.driverUsername);
        this.fetchVehicleDetail(result.Items[0].vehicleID);
        this.spinner.hide();
      })
  }

  fetchDriverDetail(driverUserName) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          this.event.driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }

        this.event.driverID = result.Items[0].employeeId;
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

}

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
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

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
        // this.event.criticalityType = result.Items[0].criticalityType;  

        if(result.Items[0].criticalityType == 'harshBrake') {
          this.event.criticalityType = 'Harsh Brake';
        } else if(result.Items[0].criticalityType == 'harshAcceleration') {
          this.event.criticalityType = 'Harsh Acceleration';
        } else if(result.Items[0].criticalityType == 'overSpeeding') {
          this.event.criticalityType = 'Over Speeding';
        }
        
        this.fetchDriverDetail(this.event.driverUsername);
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
        this.router.navigateByUrl('/safety/critical-events');
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
}

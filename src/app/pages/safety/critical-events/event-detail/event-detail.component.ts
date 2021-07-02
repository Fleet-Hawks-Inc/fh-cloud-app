import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services/here-map.service';
import * as moment from 'moment';
import { SafetyService } from 'src/app/services/safety.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private safetyService: SafetyService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private hereMap: HereMapService) {
  }

  errors = {};
  event = {
    eventDate: '',
    eventTime: '',
    location: '',
    driverUsername: '',
    driverName: '',
    criticalityType: '-',
  };

  driver: string;
  vehicle: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  location: string;
  createdBy: string;
  eventSource: string;

  eventID = '';
  safetyNotes = [];
  newNotes: string;

  ngOnInit() {
    this.eventID = this.route.snapshot.params['eventID'];
    this.fetchEventDetail();
    this.mapShow();
  }

  async fetchEventDetail() {
    this.safetyService.getData('critical-events/' + this.eventID)
      .subscribe((res: any) => {
        
        let result = res[0];
        this.driver = result.driverUsername;
        this.vehicle = result.vehicleID;
        this.eventDate = result.eventDate;
        this.eventSource = result.eventSource;
        this.eventTime =  result.eventTime;;
        
        this.eventType = result.eventType;
        this.location = result.location;
        
        this.createdBy = result.createdBy;
        this.safetyNotes = result.safetyNotes;
        
        // this.fetchDriverDetail(this.driver)
      })
  }
  
  mapShow() {
    
    setTimeout(() => {
      this.hereMap.mapSetAPI();
      this.hereMap.mapInit();
    }, 100);
  }


  async fetchDriverDetail(driverUserName) {
    let result = await this.apiService.getData('drivers/userName/' + driverUserName).toPromise();
      // .subscribe((result: any) => {
        
        if (result.Items[0].firstName != undefined) {
          return result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      // })
  }

  
  addNotes() {
    let data = {
        notes: this.newNotes,
        eventID: this.eventID,
    }
    
    this.safetyService.postData('critical-events/notes', data).subscribe(res => {
      this.fetchEventDetail();
      this.toastr.success('Notes added successfully!');
    });
  }
}

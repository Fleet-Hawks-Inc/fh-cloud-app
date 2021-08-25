import { Component, OnInit } from '@angular/core';
import { ApiService, HereMapService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import * as moment from "moment";
import { SafetyService } from 'src/app/services/safety.service';
import Constants from 'src/app/pages/fleet/constants';
import { constants } from 'os';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events = [];
  lastEvaluatedKey = '';
  totalRecords = 20;
  pageLength = 10;

  vehicles = [];
  vehicleID = '';
  filter = {
    vehicleID: null,
    date: null

  };

  suggestions = [];
  vehiclesObject: any = {};
  driversObject: any = {};
  drivers = [];
  dataMessage: any = Constants.FETCHING_DATA;

  birthDateMinLimit: any;
  birthDateMaxLimit: any;
  status_values: any = ["open", "investigating", "coaching", "closed"];
  lastItemSK: string = '';
  
  constructor(private apiService: ApiService, private safetyService: SafetyService, private router: Router, private toaster: ToastrService,
    private spinner: NgxSpinnerService, private hereMapService: HereMapService) { 
      const date = new Date();
      this.birthDateMinLimit = { year: 1950, month: 1, day: 1 };
      this.birthDateMaxLimit = { year: date.getFullYear(), month: 12, day: 31 };
    }

  async ngOnInit() {
    this.fetchEvents();
    this.fetchVehicles();
    this.fetchAllVehiclesIDs();
  }

  async getLocation(location: string) {
    try {
      const cords = location.split(',');
      
      if (cords.length == 2) {
        const params = {
          lat: cords[0].trim(),
          lng: cords[1].trim()

        }
        const location = await this.hereMapService.revGeoCode(params);

        if (location && location.items.length > 0) {
          return location.items[0].title;
        } else {
          return 'NA';
        }
      } else {
        return 'NA';
      }
    } catch (error) {
      return 'NA';
    }
  }

  async reverseGeoCode(cords: any) {

    cords = `${cords.lng},${cords.lat}`;
    let result = await this.apiService.getData(`pcMiles/reverse/${cords}`).toPromise();
    
 }

  
  fetchVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
      })
  }

  searchEvents() {
    this.dataMessage = Constants.FETCHING_DATA;
    if(this.filter.date == '') {
      this.filter.date = 'null'
    }
    this.safetyService.getData(`critical-events/paging?vehicleID=${this.filter.vehicleID}&date=${this.filter.date}`)
      .subscribe(async (result: any) => {

        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.events = result;
         
      })
  }

  async fetchEvents(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.events = [];
    }
    if (this.lastItemSK != 'end') {
      this.safetyService.getData(`critical-events?lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          
          if (result.length == 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if(result.length > 0) {
            for (let index = 0; index < result.length; index++) {
              const element = result[index];
              this.events.push(element)
            }
            
            if (this.events[this.events.length - 1].sk != undefined) {
              this.lastItemSK = encodeURIComponent(this.events[this.events.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
          }
         
        })
    }

  }


  changeStatus(eventID: any, newValue: string, i: string) {

    let data = {
      eventID: eventID,
      status: newValue
    }
    this.safetyService.putData('critical-events', data).subscribe(async (res: any) => {
      if (res.status == false) {
        this.events[i].status = res.oldStatus;
        this.toaster.error('Please select valid status');
      } else {
        this.toaster.success('Status updated successfully');
      }
    });

  }

  resetFilter() {
    
    if(this.filter.date != '' || this.filter.vehicleID != '' || this.filter.vehicleID != null) {
      this.lastItemSK = '';
      this.events = [];
      this.fetchEvents();
      this.filter = {
        vehicleID: null,
        date: ''
      };
      
    } else {
      return false;
    }

  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }



  convertTimeFormat(time: any) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  onScroll() {
    this.fetchEvents();
  }

}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SafetyService } from 'src/app/services/safety.service';
import Constants from 'src/app/pages/fleet/constants';
declare var $: any;

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {

  events = [];
  newEvents = [];

  lastEvaluatedKey = '';
  totalRecords = 20;
  pageLength = 10;
  coachingStatus = [
    {
      value:'open',
      name: 'Open'
    },
    {
      value:'closed',
      name: 'Closed'
    },
    {
      value:'underReview',
      name: 'Under Review'
    },
    {
      value:'coaching',
      name: 'Coaching'
    },
    {
      value:'investigating',
      name: 'Investigating'
    },
  ];
  vehicles  = [];
  vehicleID = '';
  serviceUrl = '';
  filter = {
    date: null,
    driverID: null,
    location: null
  };
  suggestions = [];
  vehiclesObject: any = {};
  driversObject: any = {};
  usersObject: any = {};
  status_values: any = ["open", "investigating", "coaching", "closed"];
  dataMessage: any;
  drivers = [];
  lastItemSK: string = '';

  constructor(private apiService: ApiService, private safetyService: SafetyService, private router: Router, private toaster: ToastrService,
    ) { }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchVehicles();
    
    this.fetchAllVehiclesIDs();
    this.fetchAllDriverIDs();
    this.fetchAllUsersIDs();
    this.fetchDrivers();
  }

  changeStatus(incidentID: any, newValue: string, i: string) {
    
    let data = {
      incidentID: incidentID,
      status: newValue
    }
    this.safetyService.putData('incidents', data).subscribe(async (res: any)=> { 
      if(res.status == false) {
        this.events[i].status = res.oldStatus;
        this.toaster.error('Please select valid status');
      } else {
        this.toaster.success('Status updated successfully');
      }
    });

  }

  fetchEvents() {
    if(this.lastItemSK != 'end') {
      this.safetyService.getData(`incidents?lastKey=${this.lastItemSK}`)
      .subscribe((result: any) => {
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          this.events.push(element);
          
        }
        if(this.events[this.events.length - 1].sk != undefined) {
          this.lastItemSK = encodeURIComponent(this.events[this.events.length - 1].sk);
        } else {
          this.lastItemSK = 'end';
        }
        this.newEvents = this.events;
      })
    }
   
  }

  onScroll() {
    this.fetchEvents();
  }


  fetchVehicles() {
    this.apiService.getData('vehicles')
    .subscribe((result: any) => {
        this.vehicles = result.Items;
    })
  }


  searchEvent() {
    
    this.safetyService.getData(`incidents/paging?driverID=${this.filter.driverID}&location=${this.filter.location}&date=${this.filter.date}`)
      .subscribe((result: any) => {
        
        if(result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.events = result;
      })
   
  }


  fetchTabData(tabType) {
    let current = this;
    this.events = this.newEvents;
    $(".navtabs").removeClass('active');

    if (tabType === 'all') {
      console.log('this.events', this.events)
      this.events = this.newEvents;

    } else if (tabType === 'assigned') {
      $("#assigned-tab").addClass('active');
      this.events = this.events.filter(element => { return element.status != 'assigned'})

    } else if (tabType === 'investigating') {
      $("#under-review-tab").addClass('active');
      this.events = this.events.filter(element => { return element.status == 'investigating'})

    } else if (tabType === 'closed') {
      $("#resolved-tab").addClass('active');
      this.events = this.events.filter(element => { return element.status == 'closed'})

    }

  }

  fetchDrivers() {
    this.apiService.getData('drivers/safety')
    .subscribe((result: any) => {
        this.drivers =  result.Items;
    })
}


  resetFilter() {
    if(this.filter.date !== '' || this.filter.driverID !== '' || this.filter.location !== '') {
      this.filter = {
        date: null,
        driverID: null,
        location: null,
      };
      this.fetchEvents();
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

  fetchAllDriverIDs() {
    this.apiService.getData('drivers/get/list')
      .subscribe((result: any) => {
        this.driversObject = result;
      });
  }

  fetchAllUsersIDs() {
    this.apiService.getData('users/get/list')
      .subscribe((result: any) => {
        this.usersObject = result;
      });
  }

  convertTimeFormat (time: any) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
}
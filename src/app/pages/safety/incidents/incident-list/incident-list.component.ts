import { Component, OnInit } from '@angular/core';
import { ApiService, HereMapService } from '../../../../services';
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
    driverID: null
  };
  suggestions = [];
  vehiclesObject: any = {};
  driversObject: any = {};
  usersObject: any = {};
  status_values: any = ["open", "investigating", "coaching", "closed"];
  dataMessage: any = Constants.FETCHING_DATA;
  drivers = [];
  lastItemSK: string = '';
  birthDateMinLimit: any;
  birthDateMaxLimit: any;

  constructor(private apiService: ApiService,private hereMapService: HereMapService, private safetyService: SafetyService, private router: Router, private toaster: ToastrService,
    ) {
      const date = new Date();
      this.birthDateMinLimit = { year: 1950, month: 1, day: 1 };
      this.birthDateMaxLimit = { year: date.getFullYear(), month: 12, day: 31 };
    }

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

  async fetchEvents(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.events = [];
    }
    if(this.lastItemSK != 'end') {
      this.safetyService.getData(`incidents?lastKey=${this.lastItemSK}`)
      .subscribe(async (result: any) => {
        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if(result.length > 0) {
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            const location = await this.getLocation(element.location);
            element.location = location;
            this.events.push(element);
          }
          if (this.events[this.events.length - 1].sk != undefined) {
            this.lastItemSK = encodeURIComponent(this.events[this.events.length - 1].sk);
          } else {
            this.lastItemSK = 'end';
          }
          this.newEvents = this.events;
        }

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
    this.dataMessage = Constants.FETCHING_DATA;
    if(this.filter.date == '' || this.filter.driverID == '') {
      this.filter.date = 'null';
      this.filter.driverID = 'null';
    }
    this.safetyService.getData(`incidents/paging?driverID=${this.filter.driverID}&date=${this.filter.date}`)
      .subscribe(async (result: any) => {

        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.events = [];
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          const location = await this.getLocation(element.location);
          element.location = location;
          this.events.push(element);

        }
      })

  }


  fetchTabData(tabType) {
    if(this.filter.date != '' || this.filter.date != null || this.filter.driverID != '' || this.filter.driverID != null) {
      this.filter.date = '';
      this.filter.driverID = null;
    }
    this.events = this.newEvents;
    $(".navtabs").removeClass('active');

    if (tabType === 'all') {
      $("#allSafetyIncidents-tab").addClass('active');
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
    if (this.events.length == 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }

  }

  fetchDrivers() {
    this.apiService.getData('drivers/safety')
    .subscribe((result: any) => {
        this.drivers =  result.Items;
    })
}


  resetFilter() {
    if(this.filter.date !== '' || this.filter.driverID !== '') {
      this.lastItemSK = '';
      this.events = [];
      this.fetchEvents();
      this.filter = {
        date: null,
        driverID: null,
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

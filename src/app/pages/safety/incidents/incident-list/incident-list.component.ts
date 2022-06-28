import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import Constants from 'src/app/pages/fleet/constants';
import { SafetyService } from 'src/app/services/safety.service';
import { ApiService, HereMapService } from '../../../../services';
declare var $: any;

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {
  @ViewChild('dt') table: Table;

  events = [];
  newEvents = [];

  lastEvaluatedKey = '';
  totalRecords = 20;
  pageLength = 10;
  vehicles = [];
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
  status_values: any = [{ name: "Open", value: "open" }, { name: "Investigating", value: "investigating" }, { name: "Coaching", value: "coaching" }, { name: "Closed", value: "closed" }];

  dataMessage: any = Constants.FETCHING_DATA;
  drivers = [];
  lastItemSK: string = '';
  birthDateMinLimit: any;
  birthDateMaxLimit: any;
  dataColumns: any[];
  _selectedColumns: any[];
  get = _.get;
  find = _.find;
  loaded = false
  constructor(private apiService: ApiService, private hereMapService: HereMapService, private safetyService: SafetyService, private router: Router, private toaster: ToastrService,
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
    this.dataColumns = [
      { width: '10%', field: 'driverID', header: 'Driver Name', type: "text" },
      { width: '8%', field: 'vehicleID', header: 'Vehicle', type: "text" },
      { width: '8%', field: 'eventDate', header: 'Event Date', type: "text" },
      { width: '8%', field: 'eventTime', header: 'Event Time', type: "text" },
      { width: '9%', field: 'eventSource', header: 'Event Source', type: "text" },
      { width: '24%', field: 'location.label', header: 'Location', type: "text" },
      { width: '8%', field: 'severity', header: 'Severity', type: "text" },
      { width: '8%', field: 'assigned', header: 'Assigned', type: "text" },
      { width: '8%', field: 'status', header: 'Status', type: "text" },

    ];
    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }

  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));

  }
  changeStatus(incidentID: any, event: any, i: string) {

    let data = {
      incidentID: incidentID,
      status: event.value
    }
    this.safetyService.putData('incidents', data).subscribe(async (res: any) => {
      if (res.status == false) {
        this.events[i].status = res.oldStatus;
        this.toaster.error('Please select valid status');
      } else {
        this.toaster.success('Status updated successfully');
      }
    });

  }


  async fetchEvents(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.events = [];
    }
    if (this.lastItemSK !== 'end') {
      this.safetyService.getData(`incidents?lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true;
          }
          result.map((v) => {
            v.url = `/safety/incidents/incident-details/${v.incidentID}`;
          });
          if (result.length > 0) {
            for (let index = 0; index < result.length; index++) {
              const element = result[index];
              this.events.push(element)
              this.loaded = true;
            }

            if (this.events[this.events.length - 1].sk != undefined) {
              this.lastItemSK = encodeURIComponent(this.events[this.events.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            this.newEvents = this.events;
            // console.log("new",this.newEvents)
          }

        })
    }

  }

  onScroll = async (event: any) => {
    if (this.loaded) {
      this.fetchEvents()
    }
    this.loaded = false;
  }



  clear(table: Table) {
    table.clear();
  }

  fetchVehicles() {
    this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
      })
  }


  searchEvent() {
    this.dataMessage = Constants.FETCHING_DATA;
    if (this.filter.date == '' || this.filter.driverID == '') {
      this.filter.date = 'null';
      this.filter.driverID = 'null';
    }
    this.safetyService.getData(`incidents/paging?driverID=${this.filter.driverID}&date=${this.filter.date}`)
      .subscribe(async (result: any) => {

        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        else {
          this.lastItemSK = 'end'
        }
        this.events = result;
      })
  }



  fetchDrivers() {
    this.apiService.getData('drivers/safety')
      .subscribe((result: any) => {
        this.drivers = result.Items;
      })
  }


  resetFilter() {
    if (this.filter.date !== '' || this.filter.driverID !== '') {
      this.lastItemSK = '';
      this.events = [];
      this.fetchEvents();
      this.dataMessage = Constants.FETCHING_DATA;
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
    this.apiService.getData('common/users/get/list')
      .subscribe((result: any) => {
        this.usersObject = result;
        // console.log("user",this.usersObject)
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

  refreshData() {
    this.lastItemSK = '';
    this.events = [];
    this.fetchEvents();
    this.filter = {
      date: null,
      driverID: null,
    };
  }
}

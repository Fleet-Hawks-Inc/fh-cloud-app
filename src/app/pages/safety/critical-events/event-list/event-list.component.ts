import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import * as moment from "moment";
import { SafetyService } from 'src/app/services/safety.service';

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
  filterValue = {
    date: '',
    driverID: '',
    filterDateStart: <any> '',
    filterDateEnd: <any> '',
    driverName: '',
    vehicleID:null
  };
  
  suggestions = [];
  vehiclesObject: any = {};
  driversObject: any = {};

  status_values: any = ["open", "investigating", "coaching", "closed"];
  
  constructor(private apiService: ApiService, private safetyService: SafetyService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchevents();
    this.fetchVehicles();
    this.fetchAllVehiclesIDs();
    this.fetchAllDriverIDs();
    this.initDataTable();
  }

  
  initDataTable() {
  }

  deleteEvent(eventID) {
    let current = this;
    this.spinner.show();
    this.apiService.getData('safety/eventLogs/delete/' + eventID + '/1').subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        // current.initDataTable();
        current.spinner.hide();
        current.toastr.success('Event deleted successfully');
      }
    })
  }

  changeCoachingStatus(event, eventID) {
    let current = this;
    current.spinner.show();
    let updateData = {
      eventID: eventID,
      coachingStatus: event.target.value
    }

    this.apiService.putData('safety/eventLogs/update-status', updateData).subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        current.spinner.hide();
        current.toastr.success('Event updated successfully');
      }
    })
  }

  fetchVehicles() {
    this.apiService.getData('vehicles')
    .subscribe((result: any) => {
        this.vehicles = result.Items;
    })
  }

  searchFilter(event, type, vehicleID) {
    if(type === 'vehicle') {
      this.filterValue.vehicleID = vehicleID;
      
      $("#searchVehicle").text(event.target.innerText);
    } 
    if(type === 'date') {
      if(this.filterValue.date !== '') {
        let date = this.filterValue.date;
        let newdate = date.split('-').reverse().join('-');
        this.filterValue.filterDateStart = moment(newdate+' 00:00:01').format("X");
        this.filterValue.filterDateEnd = moment(newdate+' 23:59:59').format("X");
        this.filterValue.filterDateStart = this.filterValue.filterDateStart*1000;
        this.filterValue.filterDateEnd = this.filterValue.filterDateEnd*1000;
      }
    }
  }

  searchEvents() {
    if(this.filterValue.date !== '' || this.filterValue.driverName !== '' || this.filterValue.vehicleID !== '') {
      
    }
  }

  fetchevents() {
    this.safetyService.getData('critical-events')
      .subscribe((result: any) => {
        this.events = result;
      })
  }

  getSuggestions(searchvalue='') {
    if(searchvalue !== '') {
      searchvalue = searchvalue.toLowerCase();
      this.apiService.getData('drivers/get/suggestions/'+searchvalue).subscribe({
        complete: () => {},
        error: () => { },
        next: (result: any) => {
          this.suggestions = [];
          for (let i = 0; i < result.Items.length; i++) {
            const element = result.Items[i];
  
            let obj = {
              userName: element.userName,
              name: element.firstName + ' ' + element.lastName
            };
            this.suggestions.push(obj)
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
    this.safetyService.putData('critical-events', data).subscribe(async (res: any)=> { 
      
      if(res == false) {
        let result = await this.getOldStatus(eventID)
        this.events[i].status = result[0].status;
        this.toastr.error('Please select valid status');
      } else {
        this.toastr.success('Status updated successfully');
      }
    });

  }

  async getOldStatus(eventID: string) {
    return await this.safetyService.getData('critical-events/' + eventID).toPromise();
    
  }

  searchSelectedDriver(data) {
    this.filterValue.driverID = data.userName;
    this.filterValue.driverName = data.name;
    this.suggestions = [];
  }

  resetFilter() {
    if(this.filterValue.date !== '' || this.filterValue.driverName !== '' || this.filterValue.vehicleID !== '') {
      this.spinner.show();
      this.filterValue = {
        date: '',
        driverID: '',
        filterDateStart: '',
        filterDateEnd: '',
        vehicleID: null,
        driverName: ''
      };
      this.suggestions = [];
      $("#searchVehicle").text('Search by vehicle');
      this.spinner.hide();
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
    this.apiService.getData('drivers/get/username-list')
      .subscribe((result: any) => {
        this.driversObject = result;
        
      });
  }
}

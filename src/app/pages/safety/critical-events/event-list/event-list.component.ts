import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from "moment";
import { assertNotNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements AfterViewInit, OnDestroy, OnInit {
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

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
  
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchevents();
    this.fetchVehicles();
    this.fetchAllVehiclesIDs();
    this.fetchAllDriverIDs();
    this.initDataTable();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status=''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if(status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getEventDetail(arrValues) {
    this.events = [];
    for (let i = 0; i < arrValues.length; i++) {
      const element = arrValues[i];

      element.driverName = '';
      element.vehicleName = '';
      if(element.criticalityType == 'harshBrake') {
        element.criticalityType = 'Harsh Brake';
      } else if(element.criticalityType == 'harshAcceleration') {
        element.criticalityType = 'Harsh Acceleration';
      } else if(element.criticalityType == 'overSpeeding') {
        element.criticalityType = 'Over Speeding';
      } else if(element.criticalityType == 'overSpeedingStart') {
        element.criticalityType = 'Over Speeding Start';
      } else if(element.criticalityType == 'overSpeedingEnd') {
        element.criticalityType = 'Over Speeding End';
      }
      this.events.push(element);
    }
  }

  initDataTable() {

    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength ,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('safety/eventLogs/fetch-records?lastEvaluatedValue1='+this.lastEvaluatedKey
        +'&vehicle='+this.filterValue.vehicleID+"&driver="+this.filterValue.driverID+"&from="+this.filterValue.filterDateStart+"&to="+this.filterValue.filterDateEnd+"&event=critical", dataTablesParameters).subscribe(resp => {
          
          current.getEventDetail(resp['Items']);
          if(resp['LastEvaluatedKey'] !== undefined){
            current.lastEvaluatedKey = resp['LastEvaluatedKey'].eventID;
          } else {
            current.lastEvaluatedKey = '';
          }
          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      },
    };
  }

  deleteEvent(eventID) {
    let current = this;
    this.spinner.show();
    this.apiService.getData('safety/eventLogs/delete/' + eventID + '/1').subscribe({
      complete: () => {},
      error: () => { },
      next: (result: any) => {
        current.rerender();
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
      this.rerender('reset');
    }
  }

  fetchevents() {
    this.apiService.getData('safety/eventLogs/fetch?event=critical')
      .subscribe((result: any) => {
        this.totalRecords = result.Count;
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
      this.rerender();
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

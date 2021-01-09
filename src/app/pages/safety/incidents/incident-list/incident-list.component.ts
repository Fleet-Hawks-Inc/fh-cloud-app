import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from "moment";


@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {

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
  serviceUrl = '';
  filterValue = {
    date: '',
    driverID: '',
    filterDate: '',
    driverName: '',
    filterDateStart: <any> '',
    filterDateEnd: <any> '',
  };
  suggestions = [];
  vehiclesObject: any = {};
  driversObject: any = {};
  usersObject: any = {};
  
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchevents();
    this.fetchVehicles();
    this.initDataTable('all');

    this.fetchAllVehiclesIDs();
    this.fetchAllDriverIDs();
    this.fetchAllUsersIDs();
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
      element.AsigneeName = '';
      if(element.criticalityType == 'harshBrake') {
        element.criticalityType = 'Harsh Brake';
      } else if(element.criticalityType == 'harshAcceleration') {
        element.criticalityType = 'Harsh Acceleration';
      } else if(element.criticalityType == 'overSpeeding') {
        element.criticalityType = 'Over Speeding';
      }
      this.events.push(element);
    }
  }

  // initDataTable() {
  initDataTable(tabType='', check = '', filters:any = '') {

    let current = this;
    if(tabType === 'all') {
      this.serviceUrl = "safety/eventLogs/fetch/incident-records?tab=" + tabType + "&lastEvaluatedValue1=";
    } else {
      this.serviceUrl = "safety/eventLogs/fetch/incident-records?tab=" + tabType + "&recLimit="+this.totalRecords+"&lastEvaluatedValue1=";
    }

    if (check !== '') {
      current.rerender();
    }

    // let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6,7],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
          current.apiService.getDatatablePostData(this.serviceUrl+this.lastEvaluatedKey+"&driver="+this.filterValue.driverID+"&from="+this.filterValue.filterDateStart+"&to="+this.filterValue.filterDateEnd , dataTablesParameters).subscribe(resp => {
          current.getEventDetail(resp['Items']);
          if(resp['LastEvaluatedKey'] !== undefined){
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].eventID
          } else {
            this.lastEvaluatedKey = ''
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
        current.initDataTable('all');
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

  searchFilter(event) {
    if(this.filterValue.date !== '') {
      let date = this.filterValue.date;
      let newdate = date.split('-').reverse().join('-');
      this.filterValue.filterDateStart = moment(newdate+' 00:00:01').format("X");
      this.filterValue.filterDateEnd = moment(newdate+' 23:59:59').format("X");
      this.filterValue.filterDateStart = this.filterValue.filterDateStart*1000;
      this.filterValue.filterDateEnd = this.filterValue.filterDateEnd*1000;

      $(".navtabs").removeClass('active');
      $("#allSafetyIncidents-tab").addClass('active');
    }
  }

  searchEvent() {
    if(this.filterValue.date !== '' || this.filterValue.driverName !== '') {
      this.rerender('reset');
    }
  }

  fetchevents() {
    this.apiService.getData('safety/eventLogs/fetch?event=incident')
      .subscribe((result: any) => {
        // console.log(result);
        this.totalRecords = result.Count;
      })
  }

  fetchTabData(tabType) {
    let current = this;
    $(".navtabs").removeClass('active');

    if (tabType === 'all') {
      $("#allSafetyIncidents-tab").addClass('active');
      // this.totalRecords = this.allTripsCount;

    } else if (tabType === 'assigned') {
      $("#assigned-tab").addClass('active');
      // this.totalRecords = this.plannedTripsCount;

    } else if (tabType === 'underReview') {
      $("#under-review-tab").addClass('active');
      // this.totalRecords = this.dispatchedTripsCount;

    } else if (tabType === 'closed') {
      $("#resolved-tab").addClass('active');
      // this.totalRecords = this.startedTripsCount;

    }

    current.lastEvaluatedKey = '';
    current.initDataTable(tabType, 'reload');
  }

  getSuggestions(searchvalue='') {
    if(searchvalue !== '') {
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
    if(this.filterValue.date !== '' || this.filterValue.driverName !== '') {
      this.spinner.show();
      this.filterValue = {
        date: '',
        filterDateStart: '',
        filterDateEnd: '',
        driverID: '',
        filterDate: '',
        driverName: ''
      };
      this.suggestions = [];
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
}
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

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
  lastEvaluated = {
    value1: '',
  };
  totalRecords = 10;
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
    filterDate: '',
    vehicleID: '',
    driverName: ''
  };
  suggestions = [];
  
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.fetchevents();
    this.fetchVehicles();
    this.initDataTable();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  fetchVehicleDetail(vehicleID, tripArr) {
    this.apiService.getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].vehicleIdentification != undefined) {
          tripArr.vehicleName = result.Items[0].vehicleIdentification
        }
      })
  }

  fetchDriverDetail(driverUserName, tripArr) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          tripArr.driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
      })
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
      this.fetchVehicleDetail(element.vehicleID, element);
      this.fetchDriverDetail(element.driverUsername, element);
      this.events.push(element);
    }
  }

  initDataTable() {

    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
        {"targets": [6],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('safety/eventLogs/fetch-records?lastEvaluatedValue1='+this.lastEvaluated.value1
        +'&vehicle='+this.filterValue.vehicleID+"&driver="+this.filterValue.driverID+"&date="+this.filterValue.filterDate+"&event=critical", dataTablesParameters).subscribe(resp => {
          
          current.getEventDetail(resp['Items']);
          if(resp['LastEvaluatedKey'] !== undefined){
            this.lastEvaluated = {
              value1 : resp['LastEvaluatedKey'].eventID,
            }
          } else {
            this.lastEvaluated = {
              value1 : '',
            }
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
    } else if(type === 'date') {
      if(this.filterValue.date !== '') {
        this.filterValue.filterDate = this.filterValue.date.split("-").reverse().join("-");
      }
    }
    this.rerender();
  }

  fetchevents() {
    this.apiService.getData('safety/eventLogs/fetch?event=critical')
      .subscribe((result: any) => {
        this.totalRecords = result.Count;
      })
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

    this.rerender();
  }

  resetFilter() {
    if(this.filterValue.date !== '' || this.filterValue.driverName !== '' || this.filterValue.vehicleID !== '') {
      this.spinner.show();
      this.filterValue = {
        date: '',
        driverID: '',
        filterDate: '',
        vehicleID: '',
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
}

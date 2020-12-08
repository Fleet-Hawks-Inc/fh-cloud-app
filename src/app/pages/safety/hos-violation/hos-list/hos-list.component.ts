import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hos-list',
  templateUrl: './hos-list.component.html',
  styleUrls: ['./hos-list.component.css']
})
export class HosListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  events = [];
  lastEvaluated = {
    value1: '',
  };
  totalRecords = 10;

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService,) { }

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

  filterData = {
    searchValue: '',
    severity: '',
    startDate: '',
    endDate: '',
    start: '',
    end: '',
    driverID: '',
    driverName: ''
  }
  suggestions = [];

  ngOnInit(): void {
    this.fetchevents();
    this.initDataTable()
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

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('safety/eventLogs/fetch/hosViolation-records?lastEvaluatedValue1='+this.lastEvaluated.value1
        +"&driver="+this.filterData.driverID+'&severity='+current.filterData.severity+'&startDate='+current.filterData.start+'&endDate='+current.filterData.end, dataTablesParameters).subscribe(resp => {
          // console.log('------------');
          // console.log(resp)
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

  getEventDetail(arrValues) {
    this.events = [];
    for (let i = 0; i < arrValues.length; i++) {
      const element = arrValues[i];

      element.driverName = '';
      element.driverID = '';
      // this.fetchVehicleDetail(element.vehicleID, element);
      this.fetchDriverDetail(element.driverUsername, element);
      this.events.push(element);
    }
  }

  fetchDriverDetail(driverUserName, tripArr) {
    this.apiService.getData('drivers/userName/' + driverUserName)
      .subscribe((result: any) => {
        // console.log(result.Items[0]);
        if (result.Items[0].firstName != undefined) {
          tripArr.driverName = result.Items[0].firstName + ' ' + result.Items[0].lastName;
        }
        tripArr.driverID = result.Items[0].employeeId;
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
        current.toastr.success('Hos violation updated successfully');
      }
    })
  }

  fetchevents() {
    this.apiService.getData('safety/eventLogs/fetch?event=hosViolation')
      .subscribe((result: any) => {
        this.totalRecords = result.Count;
      })
  }

  filterSearch() {
    if(this.filterData.driverName == '' && this.filterData.severity == '' && this.filterData.startDate == '' && this.filterData.endDate == '') {
      this.toastr.error('Please select atleast one filter');
      return false;
    }

    let start = this.filterData.startDate;
    let end = this.filterData.endDate;
    let startD = <any> '';
    let endD = <any> '';

    if(this.filterData.startDate !== '') {
      // start = start.split("-").reverse().join("-");
      startD = start.split("-");
      start = startD[0]+startD[1]+startD[2];
    }

    if(this.filterData.endDate !== '') {
      // end = end.split("-").reverse().join("-");
      endD = end.split("-");
      end = endD[0]+endD[1]+endD[2];
    }

    this.filterData.start = start;
    this.filterData.end = end;

    this.rerender();
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
            if(this.filterData.driverName !== '' ) { 
              this.suggestions.push(obj)
            }
          }
        }
      })
    } else {
      this.suggestions = [];
    }
  }

  searchSelectedDriver(data) {
    this.filterData.driverID = data.userName;
    this.filterData.driverName = data.name;
    this.suggestions = [];
  }

  resetFilter() {
    if(this.filterData.searchValue !== '' ||  this.filterData.severity !== '' ||  this.filterData.startDate !== ''
    ||  this.filterData.endDate !== '' ||  this.filterData.driverName !== '') {
      this.spinner.show();
      this.filterData = {
        searchValue: '',
        severity: '',
        startDate: '',
        endDate: '',
        start: '',
        end: '',
        driverID: '',
        driverName: ''
      }
      this.suggestions = [];
      this.rerender();
      this.spinner.hide();
    } else {
      return false;
    }
    
  }
}

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
  lastEvaluatedKey = '';
  totalRecords = 20;
  pageLength = 10;

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
  driversObject: any = {};
  driverIDsObject: any = {};

  ngOnInit(): void {
    this.fetchevents();
    this.initDataTable();
    this.fetchAllDriverIDs();
    this.fetchDriverIDs();
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

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6],"orderable": false},
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('safety/eventLogs/fetch/hosViolation-records?lastEvaluatedValue1='+this.lastEvaluatedKey
        +"&driver="+this.filterData.driverID+'&severity='+current.filterData.severity+'&startDate='+current.filterData.start+'&endDate='+current.filterData.end, dataTablesParameters).subscribe(resp => {
          // console.log('------------');
          // console.log(resp)
          current.getEventDetail(resp['Items']);
          if(resp['LastEvaluatedKey'] !== undefined){
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].eventID;
          } else {
            this.lastEvaluatedKey = '';
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
      this.events.push(element);
    }
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
 
    let start = <any> '';
    let end = <any> '';
    start = this.filterData.startDate;
    end = this.filterData.endDate;

    if(this.filterData.startDate !== '') {
      start = start.split('-').reverse().join('-');
      start = moment(start+' 00:00:00').format("X")
      start = start*1000;
    }

    if(this.filterData.endDate !== '') {
      end = end.split('-').reverse().join('-');
      end = moment(end+' 23:59:59').format("X");
      end = end*1000;
    }

    this.filterData.start = start;
    this.filterData.end = end;

    this.rerender('reset');
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

  fetchAllDriverIDs() {
    this.apiService.getData('drivers/get/list')
      .subscribe((result: any) => {
        this.driversObject = result;
      });
  }

  fetchDriverIDs() {
    this.apiService.getData('drivers/get/data')
      .subscribe((result: any) => {
        this.driverIDsObject = result;
      });
  }
}

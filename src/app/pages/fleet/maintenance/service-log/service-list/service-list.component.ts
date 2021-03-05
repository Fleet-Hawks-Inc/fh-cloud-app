import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'Service Logs';
  // dtOptions: any = {};
  logs = [];

  suggestedVehicles = [];
  vehicleID = '';
  currentStatus = '';
  vehicleIdentification = '';
  vehiclesObject: any = {};
  vendorsObject: any = {};
  issuesObject: any = {};
  assetsObject: any = {};

  tasks = [];
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  constructor(
      private apiService: ApiService,
      private router: Router,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService,
    ) {}

  ngOnInit() {
    this.fetchLogsCount();
    this.fetchTasks();
    this.fetchAllVehiclesIDs();
    this.fetchAllVendorsIDs();
    this.fetchAllIssuesIDs();
    this.fetchAllAssetsIDs();
    this.initDataTable();
  }

  getSuggestions(value) {
    this.suggestedVehicles = [];
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
      });
  }

  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;

    this.suggestedVehicles = [];
  }

  fetchAllVehiclesIDs() {
    this.apiService.getData('vehicles/get/list')
      .subscribe((result: any) => {
        this.vehiclesObject = result;
      });
  }

  fetchAllVendorsIDs() {
    this.apiService.getData('vendors/get/list')
      .subscribe((result: any) => {
        this.vendorsObject = result;
      });
  }

  fetchAllIssuesIDs() {
    this.apiService.getData('issues/get/list')
      .subscribe((result: any) => {
        this.issuesObject = result;
      });
  }

  fetchAllAssetsIDs() {
    this.apiService.getData('assets/get/list')
      .subscribe((result: any) => {
        this.assetsObject = result;
      });
  }

  /*
   * Get all tasks from api
   */
  fetchTasks() {
    this.apiService.getData('tasks').subscribe((result: any) => {
      this.tasks = result.Items;
    });
  }

  fetchLogsCount() {
    this.apiService.getData('serviceLogs/get/count?vehicleID='+this.vehicleID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  gotoIssue(issue){
    localStorage.setItem('issueID', issue);
    this.router.navigateByUrl('/fleet/maintenance/issues/detail/')
  }

  openComponent(vendorID) {
    localStorage.setItem('vendorID', vendorID);
    $('#vendorDtlModal').modal('show');
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
        { "targets": [0,1,2,3,4], "orderable": false },
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('serviceLogs/fetch-records?vehicleID='+this.vehicleID + '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.logs = resp['Items'];
          if (resp['LastEvaluatedKey'] !== undefined) {
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].logID;

          } else {
            this.lastEvaluatedKey = '';
          }

          callback({
            recordsTotal: current.totalRecords,
            recordsFiltered: current.totalRecords,
            data: []
          });
        });
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(status = ''): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      if (status === 'reset') {
        this.dtOptions.pageLength = this.totalRecords;
      } else {
        this.dtOptions.pageLength = 10;
      }
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchFilter() {
    if (this.vehicleID !== '') {
      this.logs = [];
      this.fetchLogsCount();
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleID !== '') {
      this.vehicleID = '';
      this.vehicleIdentification = '';
      this.logs = [];
      this.fetchLogsCount();
      this.rerender();
    } else {
      return false;
    }
  }

  deleteProgram(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`serviceLogs/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.logs = [];
        this.fetchLogsCount();
        this.rerender();
        this.toastr.success('Service Log Deleted Successfully!');
      });
    }
  }
  

}

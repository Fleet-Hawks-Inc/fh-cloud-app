import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-service-program-list',
  templateUrl: './service-program-list.component.html',
  styleUrls: ['./service-program-list.component.css'],
})
export class ServiceProgramListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'Service Program List';
  // dtOptions: any = {};
  programs = [];
  programeName = '';
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  constructor(
      private apiService: ApiService,
      private router: Router,
      private spinner: NgxSpinnerService,
      private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.fetchProgramsCount();
    this.initDataTable();
  }

  fetchProgramsCount() {
    this.apiService.getData('servicePrograms/get/count?programName='+this.programeName).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
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
        { "targets": [0,1,2], "orderable": false },
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('servicePrograms/fetch-records?programName='+this.programeName + '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.programs = resp['Items'];
          if (resp['LastEvaluatedKey'] !== undefined) {
            this.lastEvaluatedKey = resp['LastEvaluatedKey'].programID;

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
    if (this.programeName !== '') {
      this.programs = [];
      this.fetchProgramsCount();
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.programeName !== '') {
      this.programeName = '';
      this.programs = [];
      this.fetchProgramsCount();
      this.rerender();
    } else {
      return false;
    }
  }

  deleteProgram(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`servicePrograms/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        this.programs = [];
        this.fetchProgramsCount();
        this.rerender();
        this.toastr.success('Service Program Deleted Successfully!');
      });
    }
  }
}

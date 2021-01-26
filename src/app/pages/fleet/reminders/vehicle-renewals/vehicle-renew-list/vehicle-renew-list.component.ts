import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import Constants from '../../../constants';
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public remindersData = [];
  // dtOptions: any = {};
  vehicles = [];
  vehicleName: string;
  vehicleList: any = {};
  tasksList: any  = {};
  groups; any = {};
  group: string;
  subcribersArray = [];
  allRemindersData = [];
  vehicleIdentification = '';
  currentDate = moment();
  newData = [];
  suggestedVehicles = [];
  vehicleID = '';
  unitID = '';
  unitName = '';
  searchServiceTask = '';
  serviceTasks = [];
  filterStatus: string;

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  constructor(private apiService: ApiService, private router: Router,private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getReminders();
    this.fetchServiceTaks();
    // this.fetchRenewals();
    this.fetchVehicles();
    this.fetchGroupsList();
    this.fetchVehicleList();
    this.fetchTasksList();
    this.initDataTable();
    
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  fetchGroupsList() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
      //   console.log('Groups Data', this.groups);
    });
  }
  
  fetchServiceTaks() {
    let test = [];
    let taskType = 'vehicle';
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'vehicle');
    });    
  }
  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  } 
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  
  fetchRenewals = async () => {    
    this.remindersData = [];
    for(let j=0; j < this.allRemindersData.length; j++) {
      let reminderStatus: string;
        const convertedDate = moment(this.allRemindersData[j].reminderTasks.dueDate,'DD-MM-YYYY');
        const remainingDays = convertedDate.diff(this.currentDate, 'days');
        if (remainingDays < 0 ) {
          reminderStatus = 'OVERDUE';
        }
        else if( remainingDays <= this.allRemindersData[j].reminderTasks.remindByDays &&  remainingDays >= 0) {
          reminderStatus = 'DUE SOON';
        }
        const data = {
          reminderID: this.allRemindersData[j].reminderID,
          reminderIdentification: this.allRemindersData[j].reminderIdentification,
          reminderTasks: {
            task: this.allRemindersData[j].reminderTasks.task,
            remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
            reminderStatus: reminderStatus,
            remainingDays: remainingDays,
            dueDate: this.allRemindersData[j].reminderTasks.dueDate,
          },
          subscribers : this.allRemindersData[j].subscribers,
          };
        this.remindersData.push(data); 
    }
    if (this.filterStatus === Constants.OVERDUE) {
      this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
    }
    else if (this.filterStatus === Constants.DUE_SOON) {
      this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
    }
    else if (this.filterStatus === Constants.ALL) {
      this.remindersData = this.remindersData;
    }
  }

  deleteRenewal(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`reminders/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        // console.log('result', result);
        this.remindersData = [];
        this.getReminders()
        this.rerender();
        this.toastr.success('Vehicle Renewal Reminder Deleted Successfully!');
      });
    }
  }

  setVehicle(vehicleID, vehicleIdentification) {
    this.vehicleIdentification = vehicleIdentification;
    this.vehicleID = vehicleID;
    this.suggestedVehicles = [];
  }

  getSuggestions(value) {
    this.apiService
      .getData(`vehicles/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedVehicles = result.Items;
        if (this.suggestedVehicles.length === 0) {
          this.vehicleID = '';
        }
      });
  }

  getReminders() {
    this.apiService
      .getData('reminders/get-reminders/vehicle')
      .subscribe((result) => {
        // this.suggestedVehicles = result.Items;
        this.totalRecords = result.Count;
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
        {"targets": [0],"orderable": false},
        {"targets": [1],"orderable": false},
        {"targets": [2],"orderable": false},
        {"targets": [3],"orderable": false},
        {"targets": [4],"orderable": false},
        {"targets": [5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('reminders/fetch/records?reminderIdentification='+this.vehicleID+'&serviceTask='+this.searchServiceTask+'&reminderType=vehicle'+'&lastKey='+this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
            current.allRemindersData = resp['Items'];
            current.fetchRenewals();
            // console.log(resp)
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKey = resp['LastEvaluatedKey'].assetID;
              
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

  searchFilter() {
    if(this.vehicleID !== '' || this.searchServiceTask !== ''  && this.searchServiceTask !== null && this.searchServiceTask !== undefined
    || this.filterStatus !== '' && this.filterStatus !== null && this.filterStatus !== undefined) {
      this.remindersData = [];
      this.getReminders()
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.vehicleID !== '' || this.searchServiceTask !== '' || this.searchServiceTask !== null || this.searchServiceTask !== undefined
    || this.filterStatus !== '' || this.filterStatus !== null || this.filterStatus !== undefined) {
      this.vehicleID = '';
      this.vehicleIdentification = '';
      this.searchServiceTask = '';
      this.filterStatus = '';

      this.remindersData = [];
      this.getReminders()
      this.rerender();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {
    if(value.reminderTasks.reminderStatus !== undefined && value.reminderTasks.reminderStatus !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=vehicle&status=${value.reminderTasks.reminderStatus}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Vehicle renewal is upto date');
      return false;
    }
  }
}

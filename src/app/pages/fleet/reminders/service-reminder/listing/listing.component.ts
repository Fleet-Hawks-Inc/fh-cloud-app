import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import Constants from '../../../constants'
declare var $: any;
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AbsoluteValuePipe } from '../../../pipes/absolute-value.pipe';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public remindersData = [];
  // dtOptions: any = {};
  vehicles = [];
  reminderIdentification = '';
  reminderID = '';
  task: string;
  vehicleList: any = {};
  groups: any = {};
  serviceLogs: any = [];
  allRemindersData = [];
  vehicleIdentification = '';
  unitID = '';
  unitName = '';
  suggestedUnits = [];
  currentDate = moment();
  currentOdometer = 1500;
  taskName: string;
  newData = [];
  suggestedVehicles = [];
  vehicleID = '';
  serviceTasks = [];
  tasksList = [];
  searchServiceTask = '';
  filterStatus: string;
  inServiceOdometer: string;
 myMath = 'Math';
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.getRemindersCount();
    this.fetchGroups();
    this.fetchTasksList();
    this.fetchVehicleList();
    this.fetchServiceTaks();
    this.initDataTable()
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
    });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
    });
  } 
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'service');
    });
  }
  getVehicle(vehicleID) {
    this.apiService
      .getData('vehicles/' + vehicleID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.inServiceOdometer = result.lifeCycle.inServiceOdometer;
        return result.lifeCycle.inServiceOdometer;
      });
  }
  resolveReminder(unitID) {
    let unitType = 'vehicle';
    const unit = {
      unitID: unitID,
      unitType: unitType,
    }

    window.localStorage.setItem('reminderUnitID', JSON.stringify(unit));
    this.router.navigateByUrl('/fleet/maintenance/service-log/add-service');
  }
  fetchReminders = async () => {
    this.remindersData = [];
    let lastCompleted;
    let serviceOdometer = 0;
    let remainingDays = 0;
    let remainingMiles = 0;
    for (let j = 0; j < this.allRemindersData.length; j++) {
      let reminderStatus: string;
       this.apiService.getData('serviceLogs/reminder/'+ this.allRemindersData[j].reminderID).subscribe((result: any) => { // to fetch the last completion date and odometer of particular reminder
         if(result == null || Object.keys(result).length === 0)
        {          
         lastCompleted =  moment().format('DD/MM/YYYY');
           serviceOdometer = this.allRemindersData[j].reminderTasks.odometer; 
           this.currentOdometer = +serviceOdometer + (this.allRemindersData[j].reminderTasks.odometer/2);
          const convertedDate = moment(lastCompleted, 'DD/MM/YYYY').add(this.allRemindersData[j].reminderTasks.remindByDays, 'days');
         remainingDays = convertedDate.diff(this.currentDate, 'days');
         remainingMiles = (serviceOdometer + (this.allRemindersData[j].reminderTasks.odometer)) - this.currentOdometer;
         if (remainingDays < 0) {
          reminderStatus = 'OVERDUE';
        }
        else if (remainingDays <= 7 && remainingDays >= 0) {
          reminderStatus = 'DUE SOON';
        }
        const data = {
          reminderID: this.allRemindersData[j].reminderID,
          reminderIdentification: this.allRemindersData[j].reminderIdentification,
          reminderTasks: {
            task: this.allRemindersData[j].reminderTasks.task,
            remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
            remainingDays: remainingDays,
            odometer: this.allRemindersData[j].reminderTasks.odometer,
            remainingMiles: remainingMiles,
            reminderStatus: reminderStatus,
          },
          subscribers: this.allRemindersData[j].subscribers,
          lastCompleted: lastCompleted,
        };
        this.remindersData.push(data);
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
        else {
          lastCompleted =  result.completionDate;
          serviceOdometer = +result.odometer;
          this.currentOdometer = +result.odometer + (this.allRemindersData[j].reminderTasks.odometer/2);
         
          const convertedDate = moment(lastCompleted, 'DD/MM/YYYY').add(this.allRemindersData[j].reminderTasks.remindByDays, 'days');
          remainingDays = convertedDate.diff(this.currentDate, 'days');
          remainingMiles = (serviceOdometer + (this.allRemindersData[j].reminderTasks.odometer)) - this.currentOdometer;
          if (remainingDays < 0) {
            reminderStatus = 'OVERDUE';
          }
          else if (remainingDays <= 7 && remainingDays >= 0) {
            reminderStatus = 'DUE SOON';
          }
          const data = {
            reminderID: this.allRemindersData[j].reminderID,
            reminderIdentification: this.allRemindersData[j].reminderIdentification,
            reminderTasks: {
              task: this.allRemindersData[j].reminderTasks.task,
              remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
              remainingDays: remainingDays,
              odometer: this.allRemindersData[j].reminderTasks.odometer,
              remainingMiles: remainingMiles,
              reminderStatus: reminderStatus,
            },
            subscribers: this.allRemindersData[j].subscribers,
            lastCompleted: lastCompleted,
          };
          this.remindersData.push(data);
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

  deleteReminder(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`reminders/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        // console.log('result', result);
        this.remindersData = [];
        this.getRemindersCount()
        this.rerender();
        this.toastr.success('Service Renewal Reminder Deleted Successfully!');
      });
    }
  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&reminderType=service').subscribe({
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
        { "targets": [0], "orderable": false },
        { "targets": [1], "orderable": false },
        { "targets": [2], "orderable": false },
        { "targets": [3], "orderable": false },
        { "targets": [4], "orderable": false },
        { "targets": [5], "orderable": false },
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('reminders/fetch/records?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&reminderType=service' + '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
          current.allRemindersData = resp['Items'];
          current.fetchReminders();
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
    if (this.vehicleID !== '' || this.searchServiceTask !== '' && this.searchServiceTask !== null && this.searchServiceTask !== undefined
      || this.filterStatus !== '' && this.filterStatus !== null && this.filterStatus !== undefined) {
      this.remindersData = [];
      this.getRemindersCount()
      this.rerender('reset');
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleID !== '' || this.searchServiceTask !== '' || this.searchServiceTask !== null || this.searchServiceTask !== undefined
      || this.filterStatus !== '' || this.filterStatus !== null || this.filterStatus !== undefined) {
      this.vehicleID = '';
      this.vehicleIdentification = '';
      this.searchServiceTask = '';
      this.filterStatus = '';

      this.remindersData = [];
      this.getRemindersCount()
      this.rerender();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {
    if(value.reminderTasks.reminderStatus !== undefined && value.reminderTasks.reminderStatus !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?status=${value.reminderTasks.reminderStatus}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Service task is upto date');
      return false;
    }
    
  }
}

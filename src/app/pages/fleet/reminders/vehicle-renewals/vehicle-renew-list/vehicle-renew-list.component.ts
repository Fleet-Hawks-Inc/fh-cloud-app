import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import Constants from '../../../constants';
import { environment } from '../../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-vehicle-renew-list',
  templateUrl: './vehicle-renew-list.component.html',
  styleUrls: ['./vehicle-renew-list.component.css']
})
export class VehicleRenewListComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public remindersData = [];
  // dtOptions: any = {};
  vehicles = [];
  vehicleName: string;
  vehicleList: any = {};
  tasksList: any = {};
  groups; any = {};
  group: string;
  subcribersArray = [];
  allRemindersData = [];
  vehicleIdentification = '';
  currentDate = moment().format('YYYY-MM-DD');
  newData = [];
  suggestedVehicles = [];
  vehicleID = null;
  unitID = '';
  unitName = '';
  searchServiceTask = null;
  serviceTasks = [];
  filterStatus: string;

  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  vehicleRenewNext = false;
  vehicleRenewPrev = true;
  vehicleRenewDraw = 0;
  vehicleRenewPrevEvauatedKeys = [''];
  vehicleRenewStartPoint = 1;
  vehicleRenewEndPoint = this.pageLength;
  allVehicles = [];

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getRemindersCount();
    this.fetchAllVehicles();
    this.fetchServiceTaks();
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
    for (let j = 0; j < this.allRemindersData.length; j++) {
      let reminderStatus: string;
      let someDateString = moment(this.allRemindersData[j].reminderTasks.dueDate).format('YYYY-MM-DD');
      let newDueDate = moment(someDateString, 'YYYY-MM-DD');
      const remainingDays = newDueDate.diff(this.currentDate, 'days');
      if (remainingDays < 0) {
        reminderStatus = 'OVERDUE';
      }
      else if (remainingDays <= this.allRemindersData[j].reminderTasks.remindByDays && remainingDays >= 0) {
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
        subscribers: this.allRemindersData[j].subscribers,
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
        .getData(`reminders/isDeleted/${entryID}/` + 1)
        .subscribe((result: any) => {
          this.remindersData = [];
          this.getRemindersCount();
          this.initDataTable();
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
      });
  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&reminderType=vehicle').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.vehicleID != null || this.searchServiceTask != null) {
          this.vehicleRenewEndPoint = this.totalRecords;
        }
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask + '&reminderType=vehicle' + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVehicles = [];
        this.getStartandEndVal();
        this.allRemindersData = result['Items'];
        this.fetchRenewals();
        if (this.vehicleID != null || this.searchServiceTask != null) {
          this.vehicleRenewStartPoint = 1;
          this.vehicleRenewEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.vehicleRenewNext = false;
          // for prev button
          if (!this.vehicleRenewPrevEvauatedKeys.includes(result['LastEvaluatedKey'].reminderID)) {
            this.vehicleRenewPrevEvauatedKeys.push(result['LastEvaluatedKey'].reminderID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].reminderID;

        } else {
          this.vehicleRenewNext = true;
          this.lastEvaluatedKey = '';
          this.vehicleRenewEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.vehicleRenewDraw > 0) {
          this.vehicleRenewPrev = false;
        } else {
          this.vehicleRenewPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if (this.vehicleID != null || this.searchServiceTask != null || this.filterStatus != null) {
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.getRemindersCount();
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleID != null || this.searchServiceTask != null || this.filterStatus != null) {
      this.vehicleID = null;
      this.vehicleIdentification = '';
      this.searchServiceTask = null;
      this.filterStatus = '';

      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.getRemindersCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {
    if (value.reminderTasks.reminderStatus !== undefined && value.reminderTasks.reminderStatus !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=vehicle&status=${value.reminderTasks.reminderStatus}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Vehicle renewal is upto date');
      return false;
    }
  }

  getStartandEndVal() {
    this.vehicleRenewStartPoint = this.vehicleRenewDraw * this.pageLength + 1;
    this.vehicleRenewEndPoint = this.vehicleRenewStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.vehicleRenewNext = true;
    this.vehicleRenewPrev = true;
    this.vehicleRenewDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.vehicleRenewNext = true;
    this.vehicleRenewPrev = true;
    this.vehicleRenewDraw -= 1;
    this.lastEvaluatedKey = this.vehicleRenewPrevEvauatedKeys[this.vehicleRenewDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.vehicleRenewNext = true;
    this.vehicleRenewPrev = true;
    this.vehicleRenewStartPoint = 1;
    this.vehicleRenewEndPoint = this.pageLength;
    this.vehicleRenewDraw = 0;
  }

  fetchAllVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.allVehicles = result.Items;
    });
  }
}

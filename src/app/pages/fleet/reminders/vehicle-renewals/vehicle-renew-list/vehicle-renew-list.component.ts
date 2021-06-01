import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import Constants from '../../../constants';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
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
  filterStatus=null;

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
  users = [];

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getRemindersCount();
    this.fetchServiceTaks();
    // this.fetchGroupsList();
    this.fetchVehicleList();
    this.fetchTasksList();
    // this.fetchUsers();
  }

  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'vehicle');
    });
  }

  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
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

  deleteRenewal(eventData) { 
    if (confirm('Are you sure you want to delete?') === true) {
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.reminderID,
        type: eventData.type
      }
      this.apiService.postData('reminders/delete', record).subscribe((result: any) => {
          this.remindersData = [];
          this.vehicleRenewDraw = 0;
          this.dataMessage = Constants.FETCHING_DATA;
          this.lastEvaluatedKey = '';
          this.getRemindersCount();
          this.toastr.success('Vehicle Renewal Deleted Successfully!');
        });
    }
  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask +'&status='+this.filterStatus + '&reminderType=vehicle').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;

        if (this.vehicleID != null || this.searchServiceTask != null) {
          this.vehicleRenewEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.vehicleID + '&serviceTask=' + this.searchServiceTask +'&status='+this.filterStatus + '&reminderType=vehicle' + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVehicles = [];
        this.getStartandEndVal();
        this.remindersData = result['Items'];
        if (this.vehicleID != null || this.searchServiceTask != null) {
          this.vehicleRenewStartPoint = 1;
          this.vehicleRenewEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].reminderSK.replace(/#/g,'--');
          this.vehicleRenewNext = false;
          // for prev button
          if (!this.vehicleRenewPrevEvauatedKeys.includes(lastEvalKey)) {
            this.vehicleRenewPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.vehicleRenewNext = true;
          this.lastEvaluatedKey = '';
          this.vehicleRenewEndPoint = this.totalRecords;
        }

        if(this.totalRecords < this.vehicleRenewEndPoint) {
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
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.vehicleID != null || this.searchServiceTask != null || this.filterStatus != null) {
      this.vehicleID = null;
      this.vehicleIdentification = '';
      this.searchServiceTask = null;
      this.filterStatus = null;

      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.getRemindersCount();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  sendEmailNotification(value) {
    if (value.status !== undefined && value.status !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=vehicle&status=${value.status}`).subscribe((result) => {
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

}

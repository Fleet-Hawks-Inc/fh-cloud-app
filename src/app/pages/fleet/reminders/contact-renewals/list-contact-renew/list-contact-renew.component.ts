import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import Constants from '../../../constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import { ListService } from '../../../../../services';
@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {

  environment = environment.isFeatureEnabled;
  dataMessage: string = Constants.FETCHING_DATA;
  public remindersData: any = [];
  contacts: [];
  driverList: any = {};
  tasksList: any = {};
  allRemindersData = [];
  subcribersArray = [];
  groups: any = {};
  currentDate = moment().format('YYYY-MM-DD');
  newData = [];
  filterStatus = null;
  usersList: any = {};
  contactID = null;
  firstName = '';
  serviceTasks = [];
  searchServiceTask = null;
  suggestedContacts = [];
  filterValue = "item.reminderTasks.reminderStatus == 'OVERDUE' || item.reminderTasks.reminderStatus == 'DUE SOON'";
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';

  contactRenewNext = false;
  contactRenewPrev = true;
  contactRenewDraw = 0;
  contactRenewPrevEvauatedKeys = [''];
  contactRenewStartPoint = 1;
  contactRenewEndPoint = this.pageLength;
  loading = false;
  users = [];
  drivers: any;
  employeesList: any = {};
  employees = [];
  driversList: any = {};
  mergedList: any = {};
  constructor(private apiService: ApiService,
              private listService: ListService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.listService.fetchDrivers();
    this.getRemindersCount();
    this.fetchServiceTaks();
    this.fetchTasksList();
    this.fetchEmployeeList();
    this.fetchEmployees();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
    let driverList = new Array<any>();
    this.getValidDrivers(driverList);
    this.drivers = driverList;
  }
  fetchEmployees() {
    this.apiService.getData('contacts/employee/records').subscribe((res) => {
    console.log('result', res);
    this.employees = res.Items;
    });
  }
  fetchEmployeeList() {
    this.apiService.getData('contacts/get/emp/list').subscribe((res) => {
      this.employeesList = res;
      if (res) {
        this.apiService.getData('drivers/get/list').subscribe((result) => {
          this.driversList = result;
          this.mergedList = {...res, ...result}; // merge id lists to one
        });
      }
    });
  }
  private getValidDrivers(driverList: any[]) {
    let ids = [];
    this.listService.driversList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.driverID)) {
          driverList.push(element2);
          ids.push(element2.driverID);
        }
      });
    });
  }
  fetchTasksList() {
    this.apiService.getData('tasks/get/list').subscribe((result: any) => {
      this.tasksList = result;
    });
  }
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'contact');
    });
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=contact').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        this.totalRecords = result.Count;
        if (this.contactID != null || this.searchServiceTask != null) {
          this.contactRenewEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&status=' + this.filterStatus + '&reminderType=contact' + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if (result.Items.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal();
        this.remindersData = result[`Items`];
        console.log(' this.remindersData',  this.remindersData);
        if (this.contactID != null || this.searchServiceTask != null) {
          this.contactRenewStartPoint = 1;
          this.contactRenewEndPoint = this.totalRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].reminderSK.replace(/#/g, '--');
          this.contactRenewNext = false;
          // for prev button
          if (!this.contactRenewPrevEvauatedKeys.includes(lastEvalKey)) {
            this.contactRenewPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKey = lastEvalKey;

        } else {
          this.contactRenewNext = true;
          this.lastEvaluatedKey = '';
          this.contactRenewEndPoint = this.totalRecords;
        }

        if (this.totalRecords < this.contactRenewEndPoint) {
          this.contactRenewEndPoint = this.totalRecords;
        }

        // disable prev btn
        if (this.contactRenewDraw > 0) {
          this.contactRenewPrev = false;
        } else {
          this.contactRenewPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  searchFilter() {
    if (this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.getRemindersCount();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
      this.contactID = null;
      this.firstName = '';
      this.searchServiceTask = null;
      this.filterStatus = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.remindersData = [];
      this.getRemindersCount();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  deleteRenewal(eventData) {
    if (confirm('Are you sure you want to delete?') === true) {
      // let record = {
      //   date: eventData.createdDate,
      //   time: eventData.createdTime,
      //   eventID: eventData.reminderID,
      //   type: eventData.type
      // }
      this.apiService.deleteData(`reminders/delete/${eventData.reminderID}/${eventData.type}`).subscribe((result: any) => {
        this.remindersData = [];
        this.contactRenewDraw = 0;
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastEvaluatedKey = '';
        this.getRemindersCount();
        this.toastr.success('Contact Renewal Deleted Successfully!');
      });
    }
  }

  sendEmailNotification(value) {
    if (value.status !== undefined && value.status !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=contact&status=${value.status}`).subscribe((result) => {
        this.toastr.success('Email sent successfully');
      });
    } else {
      this.toastr.error('Contact renewal is upto date');
      return false;
    }
  }

  getStartandEndVal() {
    this.contactRenewStartPoint = this.contactRenewDraw * this.pageLength + 1;
    this.contactRenewEndPoint = this.contactRenewStartPoint + this.pageLength - 1;
  }

  // next button func
  nextResults() {
    this.contactRenewNext = true;
    this.contactRenewPrev = true;
    this.contactRenewDraw += 1;
    this.initDataTable();
  }

  // prev button func
  prevResults() {
    this.contactRenewNext = true;
    this.contactRenewPrev = true;
    this.contactRenewDraw -= 1;
    this.lastEvaluatedKey = this.contactRenewPrevEvauatedKeys[this.contactRenewDraw];
    this.initDataTable();
  }

  resetCountResult() {
    this.contactRenewStartPoint = 1;
    this.contactRenewEndPoint = this.pageLength;
    this.contactRenewDraw = 0;
  }

  refreshData() {
    this.contactID = null;
    this.firstName = '';
    this.searchServiceTask = null;
    this.filterStatus = null;
    this.lastEvaluatedKey = '';
    this.dataMessage = Constants.FETCHING_DATA;
    this.remindersData = [];
    this.getRemindersCount();
    this.resetCountResult();
  }
}

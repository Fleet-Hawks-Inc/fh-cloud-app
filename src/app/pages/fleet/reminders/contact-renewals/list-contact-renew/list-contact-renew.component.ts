import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import Constants from '../../../constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
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
  filterStatus= null;
  usersList:any = {};
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
  allUsers = [];
  users = [];

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getRemindersCount();
    this.fetchServiceTaks();
    this.fetchUsersList();
    this.fetchTasksList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
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

  fetchUsersList() {
    this.apiService.getData('contacts/get/list/employee').subscribe((result: any) => {
      this.usersList = result;
    });
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  
  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask +'&status='+this.filterStatus + '&reminderType=contact').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
        if(this.contactID != null || this.searchServiceTask != null) {
          this.contactRenewEndPoint = this.totalRecords;
        }

        this.initDataTable();
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask +'&status='+this.filterStatus +'&reminderType=contact' + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.getStartandEndVal();
        this.remindersData = result[`Items`];
        if(this.contactID != null || this.searchServiceTask != null) {
          this.contactRenewStartPoint = 1;
          this.contactRenewEndPoint = this.totalRecords;
        }

        if (result[`LastEvaluatedKey`] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].reminderSK.replace(/#/g,'--');
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

        if(this.totalRecords < this.contactRenewEndPoint) {
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
    if(this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
      this.remindersData = [];
      this.dataMessage = Constants.FETCHING_DATA;
      this.getRemindersCount();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
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
      let record = {
        date: eventData.createdDate,
        time: eventData.createdTime,
        eventID: eventData.reminderID,
        type: eventData.type
      }
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
    if(value.status !== undefined && value.status !== '') {
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
}

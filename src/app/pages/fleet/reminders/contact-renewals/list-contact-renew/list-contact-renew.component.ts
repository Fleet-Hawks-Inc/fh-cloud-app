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
  currentDate = moment();
  newData = [];
  filterStatus: string;
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

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchAllUsers();
    this.getRemindersCount();
    this.fetchServiceTaks();
    this.fetchRenewals();
    this.fetchGroups();
    this.fetchUsersList();
    this.fetchTasksList();
    this.initDataTable();
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
    let taskType = 'contact';
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'contact');
    });
  }
  fetchGroups() {
    this.apiService.getData('groups/get/list').subscribe((result: any) => {
      this.groups = result;
    });
  }
  fetchUsersList() {
    this.apiService.getData('users/get/list').subscribe((result: any) => {
      this.usersList = result;
      console.log('this.usersList', this.usersList);
    });
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  setContact(userName, firstName, lastName) {
    this.firstName = firstName +' '+ lastName;
    this.contactID = userName;
    this.suggestedContacts = [];
  }
  getSuggestions(value) {
    this.apiService
      .getData(`users/get/suggestions/${value}`)
      .subscribe((result) => {
        this.suggestedContacts = result.Items;
      });

  }
  fetchRenewals = async () => {
    // this.remindersData = [];
    // for (let j = 0; j < this.allRemindersData.length; j++) {
    //   let reminderStatus: string;
    //   if (this.allRemindersData[j].reminderType === 'contact') {
    //     const convertedDate = moment(this.allRemindersData[j].reminderTasks.dueDate, 'DD-MM-YYYY');
    //     const remainingDays = convertedDate.diff(this.currentDate, 'days');

    //     if (remainingDays < 0) {
    //       reminderStatus = 'OVERDUE';
    //     }
    //     else if (remainingDays <= this.allRemindersData[j].reminderTasks.remindByDays && remainingDays >= 0) {
    //       reminderStatus = 'DUE SOON';
    //     }
    //     const data = {
    //       reminderID: this.allRemindersData[j].reminderID,
    //       reminderIdentification: this.allRemindersData[j].reminderIdentification,
    //       reminderTasks: {
    //         task: this.allRemindersData[j].reminderTasks.task,
    //         remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
    //         remainingDays: remainingDays,
    //         reminderStatus: reminderStatus,
    //         dueDate: this.allRemindersData[j].reminderTasks.dueDate,
    //       },
    //       subscribers: this.allRemindersData[j].subscribers,
    //     };
    //     this.remindersData.push(data);
    //   }
    // }
    // if (this.filterStatus === Constants.OVERDUE) {
    //   this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
    // }
    // else if (this.filterStatus === Constants.DUE_SOON) {
    //   this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
    // }
    // else if (this.filterStatus === Constants.ALL){
    //   this.remindersData = this.remindersData;
    // }

  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&reminderType=contact').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
  // console.log('fetcehd result',result);
        if(this.contactID != null || this.searchServiceTask != null) {
          this.contactRenewEndPoint = this.totalRecords;
        }
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&reminderType=contact' + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedContacts = [];
        this.getStartandEndVal();
        this.remindersData = result[`Items`];
        console.log('this.remindersData',this.remindersData);
        this.fetchRenewals();
        if(this.contactID != null || this.searchServiceTask != null) {
          this.contactRenewStartPoint = 1;
          this.contactRenewEndPoint = this.totalRecords;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.contactRenewNext = false;
          // for prev button
          if (!this.contactRenewPrevEvauatedKeys.includes(result['LastEvaluatedKey'].reminderID)) {
            this.contactRenewPrevEvauatedKeys.push(result['LastEvaluatedKey'].reminderID);
          }
          this.lastEvaluatedKey = result['LastEvaluatedKey'].reminderID;

        } else {
          this.contactRenewNext = true;
          this.lastEvaluatedKey = '';
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
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if(this.contactID != null || this.searchServiceTask != null || this.filterStatus !== null) {
      this.contactID = null;
      this.firstName = '';
      this.searchServiceTask = null;
      this.filterStatus = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.remindersData = [];
      this.getRemindersCount();
      this.initDataTable();
      this.resetCountResult();
    } else {
      return false;
    }
  }

  deleteRenewal(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`reminders/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {

        this.remindersData = [];
        this.getRemindersCount();
        this.initDataTable();
        this.toastr.success('Contact Renewal Reminder Deleted Successfully!');
      });
    }
  }

  sendEmailNotification(value) {
    if(value.reminderTasks.reminderStatus !== undefined && value.reminderTasks.reminderStatus !== '') {
      this.apiService.getData(`reminders/send/email-notification/${value.reminderID}?type=contact&status=${value.reminderTasks.reminderStatus}`).subscribe((result) => {
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

  fetchAllUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.allUsers = result.Items;
    });
  }
}

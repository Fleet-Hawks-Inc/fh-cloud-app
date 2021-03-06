import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import Constants from '../../../constants';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {

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
  contactID = '';
  firstName = '';
  serviceTasks = [];
  searchServiceTask = '';
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

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getRemindersCount();
    this.fetchServiceTaks();
    this.fetchRenewals();
    this.fetchGroups();
    this.fetchContactList();
    this.fetchTasksList();
    this.initDataTable()
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
  fetchContactList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driverList = result;
    });
  }
  setFilterStatus(val) {
    this.filterStatus = val;
  }
  setContact(contactID, firstName) {
    this.firstName = firstName;
    this.contactID = contactID;
    this.suggestedContacts = [];
  }
  getSuggestions(value) {
    this.apiService
      .getData(`drivers/get/suggestions/${value}`)
      .subscribe((result) => {
        this.suggestedContacts = result.Items;
        if (this.suggestedContacts.length === 0) {
          this.contactID = '';
        }
      });

  }
  fetchRenewals = async () => {
    this.remindersData = [];
    for (let j = 0; j < this.allRemindersData.length; j++) {
      let reminderStatus: string;
      if (this.allRemindersData[j].reminderType === 'contact') {
        const convertedDate = moment(this.allRemindersData[j].reminderTasks.dueDate, 'DD-MM-YYYY');
        const remainingDays = convertedDate.diff(this.currentDate, 'days');

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
            remainingDays: remainingDays,
            reminderStatus: reminderStatus,
            dueDate: this.allRemindersData[j].reminderTasks.dueDate,
          },
          subscribers: this.allRemindersData[j].subscribers,
        };
        this.remindersData.push(data);
      }
    }
    if (this.filterStatus === Constants.OVERDUE) {
      this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
    }
    else if (this.filterStatus === Constants.DUE_SOON) {
      this.remindersData = this.remindersData.filter((s: any) => s.reminderTasks.reminderStatus === this.filterStatus);
    }
    else if (this.filterStatus === Constants.ALL){
      this.remindersData = this.remindersData;
    }

  }

  getRemindersCount() {
    this.apiService.getData('reminders/get/count?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&reminderType=contact').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecords = result.Count;
      },
    });
  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('reminders/fetch/records?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&reminderType=contact' + '&lastKey=' + this.lastEvaluatedKey)
      .subscribe((result: any) => {
        this.allRemindersData = result['Items'];
        this.fetchRenewals();
        if (this.contactID !== '' || this.searchServiceTask !== '' ) {
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
    if (this.contactID !== '' || this.searchServiceTask !== '' && this.searchServiceTask !== null && this.searchServiceTask !== undefined
      || this.filterStatus !== '' && this.filterStatus !== null && this.filterStatus !== undefined) {
      this.remindersData = [];
      this.getRemindersCount()
      this.initDataTable();
    } else {
      return false;
    }
  }

  resetFilter() {
    if (this.contactID !== '' || this.searchServiceTask !== '' || this.searchServiceTask !== null || this.searchServiceTask !== undefined
      || this.filterStatus !== '' || this.filterStatus !== null || this.filterStatus !== undefined) {
      this.contactID = '';
      this.firstName = '';
      this.searchServiceTask = '';
      this.filterStatus = '';

      this.remindersData = [];
      this.getRemindersCount()
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
        this.getRemindersCount()
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
    this.contactRenewDraw += 1;
    this.initDataTable();
    this.getStartandEndVal();
  }

  // prev button func
  prevResults() {
    this.contactRenewDraw -= 1;
    this.lastEvaluatedKey = this.contactRenewPrevEvauatedKeys[this.contactRenewDraw];
    this.initDataTable();
    this.getStartandEndVal();
  }

  resetCountResult() {
    this.contactRenewStartPoint = 1;
    this.contactRenewEndPoint = this.pageLength;
    this.contactRenewDraw = 0;
  }
}

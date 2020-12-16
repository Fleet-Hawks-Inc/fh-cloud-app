import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import Constants from '../../../constants'
@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {
  public remindersData: any = [];
  contacts: [];
  contactList: any = {};
  tasksList: any = {};
  allRemindersData = [];
  subcribersArray = [];
  groups: any = {};
  dtOptions: any = {};
  currentDate = moment();
  newData = [];
  filterStatus: string;
  contactID = '';
  firstName = '';
  serviceTasks = [];
  searchServiceTask = '';
  suggestedContacts = [];
  filterValue = "item.reminderTasks.reminderStatus == 'OVERDUE' || item.reminderTasks.reminderStatus == 'DUE SOON'";
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchServiceTaks();
    this.fetchRenewals();
    this.fetchGroups();
    this.fetchContactList();
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
    let taskType = 'contact';
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
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
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.contactList = result;
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
      .getData(`contacts/suggestion/${value}`)
      .subscribe((result) => {
        this.suggestedContacts = result.Items;
        if (this.suggestedContacts.length === 0) {
          this.contactID = '';
        }
      });
   
  }
  fetchRenewals = async () => {
    this.remindersData = [];
    this.apiService.getData(`reminders?reminderIdentification=${this.contactID}&serviceTask=${this.searchServiceTask}`).subscribe({
      complete: () => { this.initDataTable(); },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
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
        else {
          this.remindersData = this.remindersData;
        }
      },
    });

  }

  deleteRenewal(entryID) {
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.fetchRenewals();
        this.toastr.success('Contact Renewal Reminder Deleted Successfully!');

      });
  }
  initDataTable() {
    this.dtOptions = {
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
      columnDefs: [
        {
          targets: 0,
          className: 'noVis'
        },
        {
          targets: 1,
          className: 'noVis'
        },
        {
          targets: 2,
          className: 'noVis'
        },
        {
          targets: 3,
          className: 'noVis'
        },
        {
          targets: 4,
          className: 'noVis'
        }
      ],
      colReorder: {
        fixedColumnsLeft: 1
      },
      buttons: [
        'colvis',
      ],
    };
  }
}

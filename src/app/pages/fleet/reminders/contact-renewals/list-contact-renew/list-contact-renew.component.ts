import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
import Constants from '../../../constants';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public remindersData: any = [];
  contacts: [];
  contactList: any = {};
  tasksList: any = {};
  allRemindersData = [];
  subcribersArray = [];
  groups: any = {};
  // dtOptions: any = {};
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

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.getReminders();
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

  }

  // deleteRenewal(entryID) {
  //   this.apiService
  //     .deleteData('reminders/' + entryID)
  //     .subscribe((result: any) => {
  //       this.fetchRenewals();
  //       this.toastr.success('Contact Renewal Reminder Deleted Successfully!');

  //     });
  // }

  getReminders() {
    this.apiService
      .getData('reminders/get-reminders/contact')
      .subscribe((result) => {
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
        { "targets": [0], "orderable": false },
        { "targets": [1], "orderable": false },
        { "targets": [2], "orderable": false },
        { "targets": [3], "orderable": false },
        { "targets": [4], "orderable": false },
        { "targets": [5], "orderable": false },
      ],
      dom: 'lrtip',
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('reminders/fetch/records?reminderIdentification=' + this.contactID + '&serviceTask=' + this.searchServiceTask + '&reminderType=contact' + '&lastKey=' + this.lastEvaluatedKey, dataTablesParameters).subscribe(resp => {
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
    if (this.contactID !== '' || this.searchServiceTask !== '' && this.searchServiceTask !== null && this.searchServiceTask !== undefined
      || this.filterStatus !== '' && this.filterStatus !== null && this.filterStatus !== undefined) {
      this.rerender('reset');
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
      this.rerender();
    } else {
      return false;
    }
  }

  deleteRenewal(entryID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.apiService
      .getData(`reminders/isDeleted/${entryID}/`+1)
      .subscribe((result: any) => {
        // console.log('result', result);
        this.rerender();
        this.toastr.success('Contact Renewal Reminder Deleted Successfully!');
      });
    }
  }
}

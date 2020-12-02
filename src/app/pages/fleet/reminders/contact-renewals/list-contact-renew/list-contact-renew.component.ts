import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as moment from 'moment';
@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {
  public remindersData = [];
  contacts: [];
  contactList: any = {};
  allRemindersData = [];
  subcribersArray = [];
  groups: any = {};
  dtOptions: any = {};
  currentDate = moment();
  newData = [];
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
    this.fetchGroups();
    this.fetchContactList();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
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
  fetchRenewals = async () => {
    this.apiService.getData(`reminders`).subscribe({
      complete: () => {this.initDataTable(); },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        for(let j=0; j < this.allRemindersData.length; j++) {
          if (this.allRemindersData[j].reminderType === 'contact') {
            const convertedDate = moment(this.allRemindersData[j].reminderTasks.dueDate,'DD-MM-YYYY');
            const remainingDays = convertedDate.diff(this.currentDate, 'days');
            console.log('remaining days', remainingDays);
            const data = {
              reminderID: this.allRemindersData[j].reminderID,
              reminderIdentification: this.allRemindersData[j].reminderIdentification,
              reminderTasks: {
                task: this.allRemindersData[j].reminderTasks.task,
                remindByDays: this.allRemindersData[j].reminderTasks.remindByDays,
                remainingDays: remainingDays,
                dueDate: this.allRemindersData[j].reminderTasks.dueDate,
              },
              subscribers : this.allRemindersData[j].subscribers,
             };
             this.remindersData.push(data); 
          }
        
        }
        console.log('new data', this.remindersData);
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

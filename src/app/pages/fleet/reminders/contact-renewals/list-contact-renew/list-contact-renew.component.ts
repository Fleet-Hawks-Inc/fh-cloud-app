import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-list-contact-renew',
  templateUrl: './list-contact-renew.component.html',
  styleUrls: ['./list-contact-renew.component.css']
})
export class ListContactRenewComponent implements OnInit {
  public remindersData = [];
  public contacts = [];
  allRemindersData = [];
  subcribersArray = [];
  groups = [];
  dtOptions: any = {};
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
    this.fetchContacts();
    this.fetchGroups();
    $(document).ready(() => {
      setTimeout(() => {
        $('#DataTables_Table_0_wrapper .dt-buttons').addClass('custom-dt-buttons').prependTo('.page-buttons');
      }, 1800);
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      //   console.log('Groups Data', this.groups);
    });
  }
  fetchContacts() {
    this.apiService.getData('contacts').subscribe((result: any) => {
      this.contacts = result.Items;
      console.log('Contacts', this.contacts);
    });
  }
  fetchRenewals = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => { this.initDataTable(); },
      error: () => { },
      next: (result: any) => {
        this.allRemindersData = result.Items;
        for (let i = 0; i < this.allRemindersData.length; i++) {
          if (this.allRemindersData[i].reminderType === 'contact') {
            this.remindersData.push(this.allRemindersData[i]);
          }
        }
        console.log('Contact renewal array', this.remindersData);
      },
    });
  }
  getSubscribers(arr: any[]) {
    this.subcribersArray = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].subscriberType === 'user') {
        this.subcribersArray.push(arr[i].subscriberIdentification);
      }
      else {
        let test = this.groups.filter((g: any) => g.groupID === arr[i].subscriberIdentification);
        this.subcribersArray.push(test[0].groupName);
      }
    }
    return this.subcribersArray;
  }
  getContactName(ID): string {
    let contact = [];
    contact = this.contacts.filter((c: any) => c.contactID === ID);
    let cName = (contact[0].firstName);
    return cName;
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

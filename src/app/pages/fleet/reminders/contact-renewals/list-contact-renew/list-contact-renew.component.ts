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
  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchRenewals();
    this.fetchContacts();
  }
  fetchContacts() {
    this.apiService.getData('contacts').subscribe((result: any) => {
      this.contacts = result.Items;
      console.log('Contacts', this.contacts);
    });
  }
  fetchRenewals = () => {
    this.apiService.getData('reminders').subscribe({
      complete: () => { },
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
  getContactName(ID) {
    let contact = this.contacts.filter((c: any) => c.contactID === ID);
    let contactName = (contact[0].contactName);
    return contactName;
  }
  deleteRenewal(entryID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/
    this.apiService
      .deleteData('reminders/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Contact Renewal Reminder Deleted Successfully!');
        this.fetchRenewals();
      });
  }
}

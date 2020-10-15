import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'app-add-contact-renew',
  templateUrl: './add-contact-renew.component.html',
  styleUrls: ['./add-contact-renew.component.css']
})
export class AddContactRenewComponent implements OnInit {
  reminderID;
  pageTitle;
  reminderData = {
    reminderType: 'contact',
    reminderTasks: {
      remindByDays: 0
    },
    subscribers: []
  };
  numberOfDays: number;
  time: number;
  timeType: string;
  vehicles = [];
  contacts = [];
  users = [];
  groups = [];
  finalSubscribers = [];
  form;
  errors = {};
  Error: string = '';
  Success: string = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID'];
    this.fetchUsers();
    this.fetchGroups();
    this.fetchContacts();
    if (this.reminderID) {
      this.pageTitle = ' Edit Contact Renewal Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = ' Add Contact Renewal Reminder';
    }

    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    });
  }
  fetchContacts() {
    this.apiService.getData('contacts').subscribe((result: any) => {
      this.contacts = result.Items;
      console.log('CONTACTS', this.contacts);
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      console.log('Groups Data', this.groups);
    });
  }
  subscriberChange(event) {
    console.log('EVENT Data', event);
    this.finalSubscribers = [];
    for (let i = 0; i < event.length; i++) {
      if (event[i].userName !== undefined) {
        // this.finalSubscribers.push(event[i].userName);
        this.finalSubscribers.push({
          subscriberType: 'user',
          subscriberIdentification: event[i].userName
        });

      }
      else {
        // this.finalSubscribers.push(event[i].groupID);
        this.finalSubscribers.push({
          subscriberType: 'group',
          subscriberIdentification: event[i].groupID
        });
      }
    }
    console.log('final array in for loop', this.finalSubscribers);

  }
  addRenewal() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    if (this.time > 0) {
      switch (this.timeType) {
        case 'Day(s)': {
          this.numberOfDays = this.time * 1;
          break;
        }
        case 'Month(s)': {
          this.numberOfDays = this.time * 30;
          break;
        }
        case 'Week(s)': {
          this.numberOfDays = this.time * 7;
          break;
        }
        default:
          {
            this.numberOfDays = this.time * 0;
            break;
          }
      }
      this.reminderData.reminderTasks.remindByDays = this.numberOfDays;
      this.reminderData.subscribers = this.finalSubscribers;
      console.log('contact renewal data', this.reminderData);
      this.apiService.postData('reminders', this.reminderData).subscribe({
        complete: () => { },
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                //console.log(key);
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
                this.Success = '';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.toastr.success('Contact Renewal Added Successfully');
          this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
        },
      });
    }
    else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }
  /*
* Fetch Reminder details before updating
*/
  fetchReminderByID() {
    this.apiService
      .getData('reminders/' + this.reminderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Contact renewal FETCHED  data', result);
        this.reminderData['reminderID'] = this.reminderID;
        this.reminderData['reminderTasks']['dueDate']  = result.reminderTasks.dueDate;
        this.reminderData['reminderTasks']['task']  = result.reminderTasks.task;
        this.time  = result.reminderTasks.remindByDays;
        this.timeType = 'Day(s)';
        this.reminderData['sendEmail']  = result.sendEmail;
        this.reminderData['subscribers'] =  result.subscribers;
        this.reminderData['reminderIdentification']  = result.reminderIdentification;
      });
  }
  // UPDATING REMINDER
  updateRenewal() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    if (this.time > 0) {
      switch (this.timeType) {
        case 'Day(s)': {
          this.numberOfDays = this.time * 1;
          break;
        }
        case 'Month(s)': {
          this.numberOfDays = this.time * 30;
          break;
        }
        case 'Week(s)': {
          this.numberOfDays = this.time * 7;
          break;
        }
        default:
          {
            this.numberOfDays = this.time * 0;
            break;
          }
      }
      this.reminderData.reminderTasks.remindByDays = this.numberOfDays;
      this.reminderData.subscribers = this.finalSubscribers;
      console.log('updated data', this.reminderData);
      this.apiService.putData('reminders', this.reminderData).subscribe({
        complete: () => { },
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                //console.log(key);
                val.message = val.message.replace(/'.*'/, 'This Field');
                this.errors[key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
                this.Success = '';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.toastr.success('Contact Renewal Reminder Updated Successfully');
          this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
          this.Success = '';
        },
      });
    }
    else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }
}

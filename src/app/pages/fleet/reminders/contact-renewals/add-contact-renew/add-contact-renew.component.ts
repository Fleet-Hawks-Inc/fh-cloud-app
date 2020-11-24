import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
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
  contactRenewalForm;
  numberOfDays: number;
  time = 1;
  timeType: string;
  vehicles = [];
  contacts = [];
  users = [];
  test = [];
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
    private ngbCalendar: NgbCalendar,private location: Location, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID'];
    this.fetchUsers();
    this.fetchGroups();
    this.fetchContacts();
    $(document).ready(() => {
      this.contactRenewalForm = $('#contactRenewalForm').validate();
    });
    if (this.reminderID) {
      this.pageTitle = ' Edit Contact Renewal Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = ' Add Contact Renewal Reminder';
    }
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
  getSubscribers(arr: any[]) {
    this.finalSubscribers = [];
    for (let i = 0; i < arr.length; i++) {
      let test: any = [];
       test = this.groups.filter((g: any) => g.groupID === arr[i]);
      if (test.length > 0) {
        this.finalSubscribers.push({
          subscriberType: 'group',
          subscriberIdentification: arr[i]
        });
      }
      else{
        this.finalSubscribers.push({
          subscriberType: 'user',
          subscriberIdentification: arr[i]
        });
      }
    }
    return this.finalSubscribers;
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  addRenewal() {
    this.hideErrors();
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
      this.reminderData.subscribers = this.getSubscribers(this.reminderData.subscribers);
      console.log('contact renewal data', this.reminderData);
      this.apiService.postData('reminders', this.reminderData).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
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
    console.log(this.errors);
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
  }
  
  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
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
        for (let i = 0; i < result.subscribers.length; i++) {
          this.test.push( result.subscribers[i].subscriberIdentification);
    }
        this.reminderData['reminderID'] = this.reminderID;
        this.reminderData['reminderTasks']['dueDate']  = result.reminderTasks.dueDate;
        this.reminderData['reminderTasks']['task']  = result.reminderTasks.task;
        this.time  = result.reminderTasks.remindByDays;
        this.timeType = 'Day(s)';
        this.reminderData['sendEmail']  = result.sendEmail;
        this.reminderData['subscribers'] = this.test;
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
      this.reminderData.subscribers = this.getSubscribers(this.reminderData.subscribers);
      console.log('updated data', this.reminderData);
      this.apiService.putData('reminders', this.reminderData).subscribe({
        complete: () => { },
        error : (err: any) => {
          from(err.error)
              .pipe(
                map((val: any) => {
                  val.message = val.message.replace(/".*"/, 'This Field');
                  this.errors[val.context.key] = val.message;
                }),
              )
              .subscribe((val) => {
                this.throwErrors();
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

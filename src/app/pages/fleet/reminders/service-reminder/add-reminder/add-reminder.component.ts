import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
declare var $: any;


@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.css']
})
export class AddReminderComponent implements OnInit {
  reminderID;
  pageTitle;
  reminderData = {
    reminderType: 'service',
    reminderTasks: {
      remindByDays: 0
    },
    subscribers: []
  };
  numberOfDays: number;
  time: number;
  timeType: string;
  vehicles = [];
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
    private location: Location) { }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID'];
    this.fetchVehicles();
    this.fetchUsers();
    this.fetchGroups();
    if (this.reminderID) {
      this.pageTitle = 'Edit Service Reminder';
      this.fetchReminderByID();
   
    } else {
      this.pageTitle = 'Add Service Reminder';
     
    }

    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }
  fetchUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    });
  }
  fetchGroups() {
    this.apiService.getData('groups').subscribe((result: any) => {
      this.groups = result.Items;
      // console.log('Groups Data', this.groups);
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
  /*
  * Fetch Reminder details before updating
 */
  fetchReminderByID() {
    this.apiService
      .getData('reminders/' + this.reminderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched data', result);
        for (let i = 0; i < result.subscribers.length; i++) {
          if (result.subscribers[i].subscriberType === 'user') {
            let subscribedUser = result.subscribers[i].subscriberIdentification;
            let isAvail = _.filter(this.users, { userName: subscribedUser });
            console.log('isAval', isAvail);
            if (isAvail.length > 0) {
              this.reminderData.subscribers.push(isAvail[0]);
            }
          } else {
            let subscribedGroup = result.subscribers[i].subscriberIdentification;
            let isAvail = _.filter(this.groups, { groupID: subscribedGroup });
            console.log('isAval group', isAvail);
            if (isAvail.length > 0) {
              this.reminderData.subscribers.push(isAvail[0]);
            }
          }
          console.log('Check in fetched', this.reminderData.subscribers);
        }
        this.reminderData['reminderID'] = this.reminderID;
        this.reminderData['reminderType'] = result.reminderType;
        this.reminderData['reminderIdentification'] = result.reminderIdentification;
        this.reminderData['reminderTasks']['task'] = result.reminderTasks.task;
        this.reminderData['reminderTasks']['odometer'] = result.reminderTasks.odometer;
        this.time = result.reminderTasks.remindByDays;
        this.timeType = 'Day(s)';
        this.reminderData['sendEmail'] = result.sendEmail;
        this.reminderData['subscribers'] = result.subscribers;
      });

  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  addReminder() {
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
        case 'Year(s)': {
          this.numberOfDays = this.time * 365;
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
      console.log('Filled Reminder Data', this.reminderData);
      // console.log('subscribers', this.finalSubscribers);
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
          this.toastr.success('Reminder added successfully');
          this.router.navigateByUrl('/fleet/reminders/service-reminder/list');
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

  // UPDATING REMINDER
  updateReminder() {
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
        case 'Year(s)': {
          this.numberOfDays = this.time * 365;
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
          this.toastr.success('Reminder Updated Successfully');
          this.router.navigateByUrl('/fleet/reminders/service-reminder/list');
          this.Success = '';
        },
      });
    }
    else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }
}

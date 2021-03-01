import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import constants from '../../../constants';
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
    reminderIdentification: '',
    reminderType: constants.REMINDER_SERVICE,
    reminderTasks: {
      task: '',
      remindByDays: 0,
      odometer: 0,
    },
    subscribers: [],
    sendEmail: false
  };
  numberOfDays: number;
  time = 1;
  timeType = 'Day(s)';
  serviceTask = {
    taskType: constants.TASK_SERVICE,
    taskName: '',
    description: ''
  };
  vehicles = [];
  users = [];
  groups = [];
  groupData = {
    groupName: '',
    groupType : constants.GROUP_USERS,
    description: '',
    groupMembers: []
  };
  finalSubscribers = [];
  serviceTasks = [];
  serviceForm;
  errors = {};
  Error = '';
  Success = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  test = [];
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private location: Location) { }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params[`reminderID`];
    this.fetchVehicles();
    this.fetchUsers();
    this.fetchGroups();
    this.fetchServiceTaks();
    if (this.reminderID) {
      this.pageTitle = 'Edit Service Reminder';
      this.fetchReminderByID();

    } else {
      this.pageTitle = 'Add Service Reminder';

    }

    $(document).ready(() => {
      this.serviceForm = $('#serviceForm').validate();
    });
  }
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'service');
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
    this.apiService.getData(`groups?groupType=${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  /*
  * Fetch Reminder details before updating
 */
  fetchReminderByID() {
    this.apiService
      .getData('reminders/' + this.reminderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        for (let i = 0; i < result.subscribers.length; i++) {
          this.test.push(result.subscribers[i].subscriberIdentification);
        }
        this.reminderData[`reminderID`] = this.reminderID;
        this.reminderData.reminderType = result.reminderType;
        this.reminderData.reminderIdentification = result.reminderIdentification;
        this.reminderData.reminderTasks.task = result.reminderTasks.task;
        this.reminderData.reminderTasks.odometer = result.reminderTasks.odometer;
        this.time = result.reminderTasks.remindByDays;
        this.timeType = 'Day(s)';
        this.reminderData.sendEmail = result.sendEmail;
        this.reminderData.subscribers = this.test;
      });

  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
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
      else {
        this.finalSubscribers.push({
          subscriberType: 'user',
          subscriberIdentification: arr[i]
        });
      }
    }
    return this.finalSubscribers;
  }
  addReminder() {
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
      this.reminderData.subscribers = this.getSubscribers(this.reminderData.subscribers);
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
          this.toastr.success('Reminder added successfully');
          this.cancel();
          this.reminderData = {
            reminderIdentification: '',
            reminderType: constants.REMINDER_SERVICE,
            reminderTasks: {
              task: '',
              remindByDays: 0,
              odometer: 0,
            },
            subscribers: [],
            sendEmail: false
          };
        },
      });
    } else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }

  throwErrors() {
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

  // UPDATING REMINDER
  updateReminder() {
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
      this.reminderData.subscribers = this.getSubscribers(this.reminderData.subscribers);
      this.apiService.putData('reminders', this.reminderData).subscribe({
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
          this.toastr.success('Reminder Updated Successfully');
          this.Success = '';
          this.cancel();
          this.reminderData = {
            reminderIdentification: '',
            reminderType: constants.REMINDER_SERVICE,
            reminderTasks: {
              task: '',
              remindByDays: 0,
              odometer: 0,
            },
            subscribers: [],
            sendEmail: false
          };
        },
      });
    } else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }


  // SERVICE TASK
  addServiceTask(){
    this.apiService.postData('tasks', this.serviceTask).subscribe({
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
        $('#addServiceTasks').modal('toggle');
        this.toastr.success('Service Task Added Successfully');
        this.fetchServiceTaks();
        this.router.navigateByUrl('/fleet/reminders/service-reminder/add');
      },
    });
  }
  // GROUP MODAL
  addGroup() {
    this.apiService.postData('groups', this.groupData).subscribe({
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
        this.hasSuccess = true;
        this.fetchGroups();
        this.toastr.success('Group added successfully');
        $('#addGroupModal').modal('hide');
        this.fetchGroups();
      },
    });
  }
}

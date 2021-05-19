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
import * as moment from 'moment';
@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.css']
})
export class AddReminderComponent implements OnInit {
  reminderID;
  pageTitle;
  entityID = null;
  taskID = null;
  reminderData = {
    entityID: '',
    type: constants.REMINDER_SERVICE,
    tasks: {
      taskID: '',
      remindByDays: 1,
      odometer: 0,
      time: '',
      timeUnit: ''
    },
    status:'',
    subscribers: [],
    lastServiceDate: '',
    lastServiceOdometer: 0,
    createdDate: '',
    createdTime: '',
  };
  numberOfDays: number;
  time = 1;
  timeType = 'day';
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
    groupType: constants.GROUP_USERS,
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
  submitDisabled = false;
  currentDate = moment().format('YYYY-MM-DD');
  subscribers = [];

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
      // this.serviceForm = $('#serviceForm').validate();
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
    this.apiService.getData(`groups/getGroup/${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
    });
  }

  /*
  * Fetch Reminder details before updating
 */
  fetchReminderByID() {
    this.apiService
      .getData('reminders/detail/' + this.reminderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        for (let i = 0; i < result.subscribers.length; i++) {
          this.test.push(result.subscribers[i].id);
        }
        this.reminderData[`reminderID`] = this.reminderID;
        this.reminderData[`createdDate`] = result.createdDate; 
        this.reminderData[`createdTime`] = result.createdTime; 
        this.reminderData[`timeCreated`] = result.timeCreated;
        this.reminderData[`status`] = result.status;
        this.reminderData.type = result.type;
        this.entityID = result.entityID;
        this.taskID = result.tasks.taskID;
        this.reminderData.tasks.odometer = result.tasks.odometer;
        this.reminderData.tasks.time = result.tasks.time;
        this.reminderData.tasks.timeUnit = result.tasks.timeUnit;
        this.reminderData.lastServiceDate = result.lastServiceDate;
        this.reminderData.lastServiceOdometer = result.lastServiceOdometer;
        this.subscribers = this.test;
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
          type: 'group',
          id: arr[i]
        });
      }
      else {
        this.finalSubscribers.push({
          type: 'user',
          id: arr[i]
        });
      }
    }
    return this.finalSubscribers;
  }
  addReminder() {
    this.hideErrors();
    this.submitDisabled = true;
    switch (this.timeType) {
      case 'day': {
        this.numberOfDays = this.time * 1;
        break;
      }
      case 'month': {
        this.numberOfDays = this.time * 30;
        break;
      }
      case 'week': {
        this.numberOfDays = this.time * 7;
        break;
      }
      case 'year': {
        this.numberOfDays = this.time * 365;
        break;
      }
      default:
        {
          this.numberOfDays = this.time * 0;
          break;
        }
    }
    this.reminderData.tasks.remindByDays = this.numberOfDays;

    const convertedDate = moment(this.reminderData.lastServiceDate).add(this.reminderData.tasks.remindByDays, 'days');
    let remainingDays = convertedDate.diff(this.currentDate, 'days');
    if (remainingDays < 0) {
      this.reminderData.status = 'overdue';
    } else if (remainingDays <= 7 && remainingDays >= 0) {
      this.reminderData.status = 'dueSoon';
    }

    this.reminderData.entityID = (this.entityID != null)? this.entityID : '';
    this.reminderData.tasks.taskID = (this.taskID != null)? this.taskID : '';
    this.reminderData.subscribers = this.getSubscribers(this.subscribers);
    this.apiService.postData('reminders', this.reminderData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toastr.success('Service Reminder Added Successfully!');
        this.cancel();
        this.reminderData = {
          status: '',
          entityID: '',
          type: constants.REMINDER_SERVICE,
          tasks: {
            taskID: '',
            remindByDays: 1,
            odometer: 0,
            time: '',
            timeUnit: ''
          },
          subscribers: [],
          lastServiceDate: '',
          lastServiceOdometer: 0,
          createdDate: '',
          createdTime: '',
        };
      },
    });

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
  async updateReminder() {
    this.hideErrors();
    this.submitDisabled = true;
    switch (this.timeType) {
      case 'day': {
        this.numberOfDays = this.time * 1;
        break;
      }
      case 'month': {
        this.numberOfDays = this.time * 30;
        break;
      }
      case 'week': {
        this.numberOfDays = this.time * 7;
        break;
      }
      case 'year': {
        this.numberOfDays = this.time * 365;
        break;
      }
      default:
        {
          this.numberOfDays = this.time * 0;
          break;
        }
    }

    this.reminderData.tasks.remindByDays = this.numberOfDays;
    // let remainingDays = this.numberOfDays;
    this.reminderData.entityID = (this.entityID != null)? this.entityID : '';
    this.reminderData.tasks.taskID = (this.taskID != null)? this.taskID : '';
    this.reminderData.subscribers = await this.getSubscribers(this.subscribers);
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
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.submitDisabled = false;
        this.toastr.success('Service reminder updated successfully!');
        this.Success = '';
        this.cancel();
      },
    });
  }


  // SERVICE TASK
  addServiceTask() {
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
              // this.throwErrors();
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
              // this.throwErrors();
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
        this.groupData = {
          groupName: '',
          groupType: constants.GROUP_USERS,
          description: '',
          groupMembers: []
        };
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import constants from '../../../constants';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-vehicle-renew-add',
  templateUrl: './vehicle-renew-add.component.html',
  styleUrls: ['./vehicle-renew-add.component.css']
})
export class VehicleRenewAddComponent implements OnInit {
  reminderID;
  pageTitle;
  entityID = null;
  taskID = null;
  reminderData = {
    entityID: '',
    type: constants.REMINDER_VEHICLE,
    tasks: {
      taskID: '',
      remindByDays: 0,
      dueDate: '',
      time: 1,
      timeUnit: 'month'
    },
    status: '',
    subscribers: '',
  };
  serviceTask = {
    taskName: '',
    taskType: constants.TASK_VEHICLE,
    description: ''
  };
  test = [];
  midArray = [];
  numberOfDays: number;
  groupData = {
    groupName: '',
    groupType: constants.GROUP_USERS,
    description: '',
    groupMembers: []
  };
  time = 1;
  timeType = 'day';
  finalSubscribers = [];
  vehicles = [];
  users = [];
  groups = [];
  serviceTasks = [];
  vehicleRenewalForm;
  serviceTaskForm;
  errors = {};
  Error = '';
  Success = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  currentDate = moment().format('YYYY-MM-DD');
  submitDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private location: Location) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.reminderID = this.route.snapshot.params[`reminderID`];
    this.fetchServiceTasks();
    this.fetchVehicles();
    // this.fetchUsers();
    // this.fetchGroups();
    if (this.reminderID) {
      this.pageTitle = 'Edit Vehicle Renewal Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = 'Add Vehicle Renewal Reminder';
    }
  }

  fetchServiceTasks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === constants.TASK_VEHICLE);
    });
  }
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  addRenewal() {
    this.hideErrors();
    this.submitDisabled = true;
    switch (this.reminderData.tasks.timeUnit) {
      case 'day': {
        this.numberOfDays = this.reminderData.tasks.time * 1;
        break;
      }
      case 'month': {
        this.numberOfDays = this.reminderData.tasks.time * 30;
        break;
      }
      case 'week': {
        this.numberOfDays = this.reminderData.tasks.time * 7;
        break;
      }
    }

    this.reminderData.tasks.remindByDays = this.numberOfDays;

    this.reminderData.entityID = (this.entityID != null)? this.entityID : '';
    this.reminderData.tasks.taskID = (this.taskID != null)? this.taskID : '';
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
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => { },
            next: () => { 
              this.submitDisabled = false;
            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toastr.success('Vehicle Renewal Reminder Added Successfully');
        this.cancel();
        this.reminderData = {
          entityID: '',
          type: constants.REMINDER_VEHICLE,
          tasks: {
            taskID: '',
            remindByDays: 0,
            dueDate: '',
            time: 0,
            timeUnit: ''
          },
          status: '',
          subscribers: '',
        };
      },
    });
  }

  fetchReminderByID() {
    this.apiService
      .getData('reminders/detail/' + this.reminderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.reminderData[`createdDate`] = result.createdDate; 
        this.reminderData[`createdTime`] = result.createdTime; 
        this.reminderData[`timeCreated`] = result.timeCreated;
        this.reminderData[`reminderID`] = this.reminderID;
        this.reminderData.tasks.dueDate = result.tasks.dueDate;
        this.taskID = result.tasks.taskID;
        this.reminderData.tasks.time = result.tasks.time;
        this.reminderData.tasks.timeUnit = result.tasks.timeUnit;
        this.entityID = result.entityID;
        this.reminderData.subscribers =result.subscribers;
      });

  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
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

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  // UPDATING REMINDER
  updateRenewal() {
    this.errors = {};
    this.submitDisabled = true;
    this.hasError = false;
    this.hasSuccess = false;
    switch (this.reminderData.tasks.timeUnit) {
      case 'day': {
        this.numberOfDays = this.reminderData.tasks.time * 1;
        break;
      }
      case 'month': {
        this.numberOfDays = this.reminderData.tasks.time * 30;
        break;
      }
      case 'week': {
        this.numberOfDays = this.reminderData.tasks.time * 7;
        break;
      }
    }

    this.reminderData.tasks.remindByDays = this.numberOfDays;
    this.reminderData.entityID = (this.entityID != null)? this.entityID : '';
    this.reminderData.tasks.taskID = (this.taskID != null)? this.taskID : '';
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
        this.toastr.success('Vehicle Renewal Reminder Updated Successfully.');
        this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/list');
        this.Success = '';
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
        this.toastr.success('Renewal Type Added Successfully.');
        this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/add');
        $('#addServiceTasks').modal('toggle');
        this.fetchServiceTasks();
      },
    });
  }

  refreshTypeData() {
    this.fetchServiceTasks();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { NgForm } from "@angular/forms";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../../../services/modal.service";
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil
} from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsavedChangesComponent } from 'src/app/unsaved-changes/unsaved-changes.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import constants from '../../../constants';
declare var $: any;
import * as moment from 'moment';
import { result } from 'lodash';
@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.css']
})
export class AddReminderComponent implements OnInit {
  @ViewChild('serviceF') serviceF: NgForm;
  takeUntil$ = new Subject();
  reminderID;
  pageTitle;
  entityID = null;
  taskID = null;
  isSubmitted = false;
  reminderData = {
    entityID: '',
    type: constants.REMINDER_SERVICE,
    tasks: {
      remindByUnit: 'time',
      taskID: '',
      remindByDays: 1,
      odometer: 0,
      time: '1',
      timeUnit: 'month'
    },
    status: '',
    subscribers: '',
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
  sessionID: string;
  groups = [];
  groupData = {
    groupName: '',
    groupType: constants.GROUP_USERS,
    description: '',
    groupMembers: []
  };
  finalSubscribers = [];
  serviceForm;
  errors = {};
  Error = '';
  Success = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  taskData = [];
  submitDisabled = false;
  currentDate = moment().format('YYYY-MM-DD');
  subscribers = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(
  private apiService: ApiService,
  private route: ActivatedRoute, 
  private router: Router,
  private toastr: ToastrService,
  private modalService: NgbModal,
  private routerMgmtService: RouteManagementServiceService,
  private modalServiceOwn: ModalService,
  private location: Location
    ) { 
      this.sessionID = this.routerMgmtService.serviceRemindersSessionID;
      }

  async ngOnInit() {
    this.reminderID = this.route.snapshot.params[`reminderID`];
    this.fetchServiceTasks();

    if (this.reminderID) {
      this.pageTitle = 'Edit Service Reminder';
      await this.fetchReminderByID();

    } else {
      this.pageTitle = 'Add Service Reminder';

    }
    await this.fetchVehicles();
  }
  fetchServiceTasks() {
    this.apiService.getData('tasks?type=service').subscribe((result: any) => {
      this.taskData = result;
    });
  }

  async fetchVehicles() {
    let result: any = await this.apiService.getData('vehicles/list/minor').toPromise();
    result.Items.forEach(element => {
      if (element.isDeleted === 0) {
        this.vehicles.push(element);
      }
      if (element.isDeleted === 1 && this.reminderData.entityID === element.vehicleID) {
        this.entityID = null;
      }
    });
  }

  async fetchReminderByID() {
    let result: any = await this.apiService.getData('reminders/detail/' + this.reminderID).toPromise();
    result = result.Items[0];
    this.reminderData[`reminderID`] = this.reminderID;
    this.reminderData[`createdDate`] = result.createdDate;
    this.reminderData[`createdTime`] = result.createdTime;
    this.reminderData[`timeCreated`] = result.timeCreated;
    this.reminderData[`status`] = result.status;
    this.reminderData.type = result.type;
    this.reminderData.entityID = result.entityID;
    this.entityID = result.entityID;
    this.taskID = result.tasks.taskID;
    this.reminderData.tasks.odometer = result.tasks.odometer;
    this.reminderData.tasks.time = result.tasks.time;
    this.reminderData.tasks.timeUnit = result.tasks.timeUnit;
    this.reminderData.lastServiceDate = result.lastServiceDate;
    this.reminderData.lastServiceOdometer = result.lastServiceOdometer;
    this.reminderData.subscribers = result.subscribers;
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addReminder() {
    this.hideErrors();
    this.submitDisabled = true;
    switch (this.reminderData.tasks.timeUnit) {
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

    this.reminderData.entityID = (this.entityID != null) ? this.entityID : null;
    this.reminderData.tasks.taskID = (this.taskID != null) ? this.taskID : null;
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
        this.router.navigateByUrl('/fleet/reminders/service-reminder/list/${this.routerMgmtService.serviceReminderUpdated()}');
        this.toastr.success('Service Reminder Added Successfully!');
        this.cancel();
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
    switch (this.reminderData.tasks.timeUnit) {
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
    this.reminderData.entityID = (this.entityID != null) ? this.entityID : null;
    this.reminderData.tasks.taskID = (this.taskID != null) ? this.taskID : null;
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
        this.router.navigateByUrl('/fleet/reminders/service-reminder/list/${this.routerMgmtService.serviceReminderUpdated()}');
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
        this.fetchServiceTasks();
      },
    });
  }

  refreshTaskData() {
    this.fetchServiceTasks();
  }
}

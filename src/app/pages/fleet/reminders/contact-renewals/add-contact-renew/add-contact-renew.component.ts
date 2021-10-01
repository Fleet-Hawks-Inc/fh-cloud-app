import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import constants from '../../../constants';
import * as moment from 'moment';
import { ListService } from '../../../../../services';
declare var $: any;
@Component({
  selector: 'app-add-contact-renew',
  templateUrl: './add-contact-renew.component.html',
  styleUrls: ['./add-contact-renew.component.css']
})
export class AddContactRenewComponent implements OnInit {
  reminderID;
  pageTitle;
  entityID = null;
  taskID = null;
  reminderData = {
    entityID: '',
    type: constants.REMINDER_CONTACT,
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
    taskType: constants.TASK_CONTACT,
    description: ''
  };
  contactRenewalForm;
  numberOfDays: number;
  time = 1;
  timeType = 'day';
  vehicles = [];
  contacts = [];
  employees = [];
  drivers: any;
  users = [];
  test = [];
  groups = [];
  groupData = {
    groupName: '',
    groupType: constants.GROUP_USERS,
    description: '',
    groupMembers: []
  };
  finalSubscribers = [];
  serviceTasks = [];
  form;
  errors = {};
  driverID = null;
  Error: string;
  Success: string;
  response: any = '';
  hasError = false;
  submitDisabled = false;
  hasSuccess = false;
  currentDate = moment().format('YYYY-MM-DD');
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private router: Router, private toastr: ToastrService,
              private listService: ListService,
              private ngbCalendar: NgbCalendar, private location: Location, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.listService.fetchDrivers();
    this.reminderID = this.route.snapshot.params[`reminderID`];
    this.fetchUsers();
    this.fetchEmployees();
    this.fetchServiceTaks();
    if (this.reminderID) {
      this.pageTitle = ' Edit Contact Renewal Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = ' Add Contact Renewal Reminder';
    }
    let driverList = new Array<any>();
    this.getValidDrivers(driverList);
    this.drivers = driverList;
  }
  private getValidDrivers(driverList: any[]) {
    let ids = [];
    this.listService.driversList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.driverID)) {
          driverList.push(element2);
          ids.push(element2.driverID);
        }

        if (element2.isDeleted === 1 && this.driverID === element2.driverID) {
          this.driverID = null;
        }
      });
    });
  }
  fetchEmployees() {
    this.apiService.getData('contacts/employee/records').subscribe((res) => {
    console.log('result', res);
    this.employees = res.Items;
    });
  }
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === constants.TASK_CONTACT);
    });
  }
  fetchUsers() {
    this.apiService.getData('users/fetch/records').subscribe((result: any) => {
      this.users = result.Items;
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
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
              // this.throwErrors();
              this.submitDisabled = false;
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
        this.toastr.success('Contact Renewal Reminder Added Successfully!');
        this.cancel();
        this.reminderData = {
          entityID: '',
          type: constants.REMINDER_CONTACT,
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
  /*
* Fetch Reminder details before updating
*/
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
        this.reminderData.subscribers = result.subscribers;
      });
  }
  // UPDATING REMINDER
  updateRenewal() {
    this.submitDisabled = true;
    this.errors = {};
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

    let remainingDays = moment(this.reminderData.tasks.dueDate,'YYYY-MM-DD').diff(this.currentDate, 'days');
    if (remainingDays < 0) {
      this.reminderData.status = 'overdue';
    } else if (remainingDays <= 7 && remainingDays >= 0) {
      this.reminderData.status = 'dueSoon';
    } else {
      this.reminderData.status = '';
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
            }),
          )
          .subscribe((val) => {
            // this.throwErrors();
            this.submitDisabled = false;
          });

      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toastr.success('Contact Renewal Reminder Updated Successfully');
        this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
        this.Success = '';
        this.reminderData = {
          entityID: '',
          type: constants.REMINDER_CONTACT,
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
        this.toastr.success('Contact Renewal Added Successfully!');
        this.fetchServiceTaks();
      },
    });
  }

  refreshTaskData(){
    this.fetchServiceTaks();
  }
}

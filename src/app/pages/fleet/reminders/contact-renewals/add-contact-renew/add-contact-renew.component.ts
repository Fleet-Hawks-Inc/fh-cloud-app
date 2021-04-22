import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import constants from '../../../constants';
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
    reminderIdentification: '',
    reminderType: constants.REMINDER_CONTACT,
    reminderTasks: {
      task: '',
      remindByDays: 0,
      dueDate: ''
    },
    subscribers: [],
    sendEmail: false
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
  drivers = [];
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
  Error: string;
  Success: string;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService,
    private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private ngbCalendar: NgbCalendar, private location: Location, private dateAdapter: NgbDateAdapter<string>) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params[`reminderID`];
    this.fetchUsers();
    this.fetchGroups();
    this.fetchContacts();
    this.fetchDrivers();
    this.fetchServiceTaks();
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
  fetchServiceTaks() {
    let test = [];
    this.apiService.getData('tasks').subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === constants.TASK_CONTACT);
    });
  }
  fetchUsers() {
    this.apiService.getData('users').subscribe((result: any) => {
      this.users = result.Items;
    });
  }
  fetchDrivers() {
    this.apiService.getData('drivers').subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }
  fetchContacts() {
    this.apiService.getData('staffs').subscribe((result: any) => {
      this.contacts = result.Items;
    });
  }
  fetchGroups() {
    this.apiService.getData(`groups/getGroup/${this.groupData.groupType}`).subscribe((result: any) => {
      this.groups = result.Items;
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
      else {
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
        this.toastr.success('Contact Renewal Reminder Added Successfully!');
        this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
        this.reminderData = {
          reminderIdentification: '',
          reminderType: constants.REMINDER_CONTACT,
          reminderTasks: {
            task: '',
            remindByDays: 0,
            dueDate: ''
          },
          subscribers: [],
          sendEmail: false
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
        this.reminderData.reminderTasks.dueDate = result.reminderTasks.dueDate;
        this.reminderData.reminderTasks.task = result.reminderTasks.task;
        this.time = result.reminderTasks.remindByDays;
        this.timeType = `Day(s)`;
        this.reminderData.sendEmail = result.sendEmail;
        this.reminderData.subscribers = this.test;
        this.reminderData.reminderIdentification = result.reminderIdentification;
      });
  }
  // UPDATING REMINDER
  updateRenewal() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
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
            this.throwErrors();
          });

      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Contact Renewal Reminder Updated Successfully');
        this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
        this.Success = '';
        this.reminderData = {
          reminderIdentification: '',
          reminderType: constants.REMINDER_CONTACT,
          reminderTasks: {
            task: '',
            remindByDays: 0,
            dueDate: ''
          },
          subscribers: [],
          sendEmail: false
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
              this.throwErrors();
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
        this.router.navigateByUrl('/fleet/reminders/contact-renewals/add');
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
        this.toastr.success('Group Added Successfully');
        $('#addGroupModal').modal('hide');
        this.groupData = {
          groupName: '',
          groupType: constants.GROUP_USERS,
          description: '',
          groupMembers: []
        };
        this.fetchGroups();
      },
    });
  }
}

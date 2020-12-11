import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-vehicle-renew-add',
  templateUrl: './vehicle-renew-add.component.html',
  styleUrls: ['./vehicle-renew-add.component.css']
})
export class VehicleRenewAddComponent implements OnInit {
  reminderID;
  pageTitle;
  reminderData = {
    reminderType: 'vehicle',
    reminderTasks: {
      remindByDays: 0
    },
    subscribers: []
  };
  serviceTask = {
    taskType: 'vehicle'
  };
  test = [];
  midArray = [];
  numberOfDays: number;
  groupData = {};
  time = 1;
  timeType = 'Day(s)';
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
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private location: Location) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.reminderID = this.route.snapshot.params[`reminderID`];
    this.fetchServiceTaks();
    this.fetchVehicles();
    this.fetchUsers();
    this.fetchGroups();
    if (this.reminderID) {
      this.pageTitle = 'Edit Vehicle Renewal Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = 'Add Vehicle Renewal Reminder'; 
    }

    $(document).ready(() => {
      this.vehicleRenewalForm = $('#vehicleRenewalForm').validate();
      this.serviceTaskForm = $('#serviceTaskForm').validate();
    });
  }
  fetchServiceTaks() {
    let test = [];
    let taskType = 'vehicle';
    this.apiService.getData('tasks').subscribe((result: any) => {
      // this.apiService.getData(`tasks?taskType=${taskType}`).subscribe((result: any) => {
      test = result.Items;
      this.serviceTasks = test.filter((s: any) => s.taskType === 'vehicle');
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
    });
  }
  getSubscribersObject(arr: any[]) {
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
  addRenewal() {
    this.hideErrors();
    if (this.time > 0) {
      switch (this.timeType) {
        case 'Day(s)': {
          this.numberOfDays = this.time * 1;
          console.log('days in switch', this.timeType);
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
      }
      this.reminderData.subscribers = this.getSubscribersObject(this.reminderData.subscribers);
      this.reminderData.reminderTasks.remindByDays = this.numberOfDays;
      console.log('data', this.reminderData);
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
          this.toastr.success('Vehicle Renewal Added Successfully');
          this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/list');
        },
      });
    }
    else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }
  /*
  * Fetch Reminder details before updating
 */
  fetchReminderByID() {
    this.apiService
      .getData('reminders/' + this.reminderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('vehicle renewal fetched  data', result);
        for (let i = 0; i < result.subscribers.length; i++) {
          this.test.push(result.subscribers[i].subscriberIdentification);
        }
        this.reminderData[`reminderID`] = this.reminderID;
        this.reminderData[`reminderTasks`][`dueDate`] = result.reminderTasks.dueDate;
        this.reminderData[`reminderTasks`][`task`] = result.reminderTasks.task;
        this.time = result.reminderTasks.remindByDays;
        this.timeType = 'Day(s)';
        this.reminderData[`sendEmail`] = result.sendEmail;
        this.reminderData[`reminderIdentification`] = result.reminderIdentification;
        this.reminderData[`subscribers`] = this.test;
      });

  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
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

  // UPDATING REMINDER
  updateRenewal() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    if (this.time > 0) {
      switch (this.timeType) {
        case 'Day(s)': {
          this.numberOfDays = this.time * 1;
          console.log('days in switch', this.timeType);
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
      }
      this.reminderData.reminderTasks.remindByDays = this.numberOfDays;
      this.reminderData.subscribers = this.getSubscribersObject(this.reminderData.subscribers);
      console.log('updated data', this.reminderData);
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
          this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/list');
          this.Success = '';
        },
      });
    }
    else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }

    // SERVICE TASK
    addServiceTask(){
      console.log('servcie task data', this.serviceTask);
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
          this.toastr.success('Renewal Type Added Successfully');
          this.fetchServiceTaks();
          this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/add');
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


      },
    });
  }
}

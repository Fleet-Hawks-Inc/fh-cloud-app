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
  test = [];
  midArray = [];
  numberOfDays: number;
  time: number;
  timeType: string;
  finalSubscribers = [];
  vehicles = [];
  users = [];
  groups = [];
  form;
  errors = {};
  Error: string = '';
  Success: string = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, private location: Location) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID'];
    if (this.reminderID) {
      this.pageTitle = 'Edit Vehicle Renewal Reminder';
      this.fetchReminderByID();
      this.fetchVehicles();
      this.fetchUsers();
      this.fetchGroups();
    } else {
      this.pageTitle = 'Add Vehicle Renewal Reminder';
      this.fetchVehicles();
      this.fetchUsers();
      this.fetchGroups();
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
    });
  }
  fetchGroupName(ID) {
    this.apiService.getData('groups/' + ID).subscribe((result: any) => {
      let group = result.Items;
     // console.log('GroupName' , group);
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
      this.reminderData.subscribers = this.finalSubscribers;
      this.reminderData.reminderTasks.remindByDays = this.numberOfDays;
      console.log('data', this.reminderData);
      this.apiService.postData('reminders', this.reminderData).subscribe({
        complete: () => { },
        error: (err) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/"([^']+)"/)[1];
                console.log('key', key);
                val.message = val.message.replace(/".*"/, 'This Field');
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
        this.reminderData['reminderID'] = this.reminderID;
        this.reminderData['reminderTasks']['dueDate'] = result.reminderTasks.dueDate;
        this.reminderData['reminderTasks']['task'] = result.reminderTasks.task;
        this.time = result.reminderTasks.remindByDays;
        this.timeType = 'Day(s)';
        this.reminderData['sendEmail'] = result.sendEmail;
        // this.reminderData['subscribers'] =  result.subscribers;
        //   this.reminderData['time']  = result.time;
        //   this.reminderData['timeType']  = result.timeType;
        this.reminderData['reminderIdentification'] = result.reminderIdentification;
        this.getSubscribers(result.subscribers);
      });

  }
 getSubscribers(arr) {
    console.log('hello', arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].subscriberType === 'user') {
        console.log('username', arr[i].subscriberIdentification);
        let test =  this.users.filter(u => u.userName === arr[i].subscriberIdentification);
        console.log('test user', test);
        this.midArray.push(test);
      }
      else {
        let test =  this.groups.filter(g => g.groupID === arr[i].subscriberIdentification);
        console.log('test group', test);
        this.midArray.push(test);
      }
    }
    console.log('middle array', this.midArray);
    this.reminderData.subscribers = this.midArray;
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  throwErrors() {
    this.form.showErrors(this.errors);
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
                const key = val.message.match(/"([^']+)"/)[1];
                console.log(key);
                val.message = val.message.replace(/".*"/, 'This Field');
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
          this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/list');
          this.Success = '';
        },
      });
    }
    else {
      this.toastr.warning('Time Must Be Positive Value');
    }
  }
}

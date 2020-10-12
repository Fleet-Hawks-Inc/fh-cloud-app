import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
  reminderData = {};
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
      console.log('Groups Data', this.groups);
    });
  }
  addRenewal() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    console.log('data', this.reminderData);
    this.apiService.postData('vehicleRenewal', this.reminderData).subscribe({
      complete: () => {},
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
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.toastr.success('Vehicle Renewal Added Successfully');
        this.router.navigateByUrl('/fleet/reminders/vehicle-renewals/list');
      },
    });
  }
   /*
   * Fetch Reminder details before updating
  */
 fetchReminderByID() {
  this.apiService
    .getData('vehicleRenewal/' + this.reminderID)
    .subscribe((result: any) => {
      result = result.Items[0];
      console.log('vehicle renewal fetched  data', result);
          this.reminderData['entryID'] = this.reminderID;
          this.reminderData['date']  = result.date;
          this.reminderData['renewalType']  = result.renewalType;
          this.reminderData['sendNotification']  = result.sendNotification;
        // this.reminderData['subscribedUsers'] ["User 3"]
          this.reminderData['time']  = result.time;
          this.reminderData['timeType']  = result.timeType;
          this.reminderData['vehicleID']  = result.vehicleID;
    });

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
  console.log('updated data', this.reminderData);
  this.apiService.putData('vehicleRenewal', this.reminderData).subscribe({
    complete: () => {},
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
          error: () => {},
          next: () => {},
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
}

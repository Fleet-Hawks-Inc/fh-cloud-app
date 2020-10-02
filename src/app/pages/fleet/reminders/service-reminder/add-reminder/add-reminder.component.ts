import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { from, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.css']
})
export class AddReminderComponent implements OnInit {
  reminderID;
  pageTitle;
  reminderData = {};
  vehicles;
  form;
  errors = {};
  Error: string = '';
  Success: string = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID'];
    if (this.reminderID) {
      this.pageTitle = 'Edit Service Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = 'Add Service Reminder';
      this.fetchVehicles();
    }

    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

   /*
   * Fetch Reminder details before updating
  */
 fetchReminderByID() {
  this.apiService
    .getData('serviceReminders/' + this.reminderID)
    .subscribe((result: any) => {
      result = result.Items[0];
      console.log(result);
      this.reminderData['remindersID'] = this.reminderID;
      this.reminderData['vehicleName'] = result.vehicleName;
      this.reminderData['serviceTask'] = result.serviceTask;
      this.reminderData['repeatByTime'] = result.repeatByTime;
      this.reminderData['repeatByOdometer'] = result.repeatByOdometer;
      this.reminderData['repeatByDurationType'] = result.repeatByDurationType;
    });

}

  addReminder() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    console.log('data', this.reminderData);
    this.apiService.postData('serviceReminders', this.reminderData).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              //console.log(key);
              val.message = val.message.replace(/".*"/, 'This Field');
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
        this.toastr.success('Reminder added successfully');
        this.router.navigateByUrl('/fleet/reminders/service-reminder/list');
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
  
  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
      console.log(this.vehicles)
    });
  }

 
}

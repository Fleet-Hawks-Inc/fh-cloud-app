import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'app-add-contact-renew',
  templateUrl: './add-contact-renew.component.html',
  styleUrls: ['./add-contact-renew.component.css']
})
export class AddContactRenewComponent implements OnInit {
  reminderID;
  pageTitle;
  reminderData = {};
  vehicles = [];
  form;
  errors = {};
  Error: string = '';
  Success: string = '';
  response: any = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }
    get today() {
      return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }

  ngOnInit() {
    this.reminderID = this.route.snapshot.params['reminderID'];
    if (this.reminderID) {
      this.pageTitle = ' Edit Contact Renewal Reminder';
      this.fetchReminderByID();
    } else {
      this.pageTitle = ' Add Contact Renewal Reminder';
      
    }

    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  addRenewal() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    console.log('contact renewal data', this.reminderData);
    this.apiService.postData('contactRenewal', this.reminderData).subscribe({
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
        this.toastr.success('Contact Renewal Added Successfully');
        this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
      },
    });
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }
     /*
   * Fetch Reminder details before updating
  */
 fetchReminderByID() {
  this.apiService
    .getData('contactRenewal/' + this.reminderID)
    .subscribe((result: any) => {
      result = result.Items[0];
      console.log('Contact renewal FETCHED  data', result);
          this.reminderData['entryID'] = this.reminderID;
          this.reminderData['date']  = result.date;
          this.reminderData['renewalType']  = result.renewalType;
          this.reminderData['sendNotification']  = result.sendNotification;
        // this.reminderData['subscribedUsers'] ["User 3"]
          this.reminderData['time']  = result.time;
          this.reminderData['timeType']  = result.timeType;
          this.reminderData['contactID']  = result.contactID;
    });
}
// UPDATING REMINDER
updateRenewal() {
  this.errors = {};
  this.hasError = false;
  this.hasSuccess = false;
  console.log('updated data', this.reminderData);
  this.apiService.putData('contactRenewal', this.reminderData).subscribe({
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
      this.toastr.success('Contact Renewal Reminder Updated Successfully');
      this.router.navigateByUrl('/fleet/reminders/contact-renewals/list');
      this.Success = '';
    },
  });
}
}

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
  reminderData = {};
  form;
  errors = {};
  Error: string = '';
  Success: string = '';
  hasError = false;
  hasSuccess = false;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  addService() {
    console.log(this.reminderData);
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
}

import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventActivitiesService {

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  activityData = {
    action: '',
    userID: '',
    tableName: '',
    eventID: '',
    message: ""
  };
  errors: {};
  form;

  constructor(private apiService: ApiService) { }

  addEventActivity(data) {
    this.activityData.action = data.action;
    this.activityData.userID = data.userID;
    this.activityData.tableName = data.tableName;
    this.activityData.eventID = data.eventID;
    this.activityData.message = data.message

    this.apiService.postData('activities', this.activityData).subscribe({
      complete: () => {
      },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.response = res;
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

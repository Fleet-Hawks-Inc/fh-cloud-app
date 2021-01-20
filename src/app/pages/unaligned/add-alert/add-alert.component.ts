import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.css'],
})
export class AddAlertComponent implements OnInit {
  title = 'Add Alert';

  errors = {};
  form;

  /********** Form Fields ***********/

  groupID = '';
  parameter = '';
  condition = '';
  value = '';

  groups = [];
  /******************/

  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error: string = '';
  Success: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.fetchGroups();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  fetchGroups(){
    this.apiService.getData('groups')
      .subscribe((result: any) => {
        this.groups = result.Items;
      });
  }

  addAlert() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      groupID: this.groupID,
      parameter: this.parameter,
      condition: this.condition,
      value: this.value,
    };

    this.apiService.postData('alerts', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.groupID = '';
        this.parameter = '';
        this.condition = '';
        this.value = '';

        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Alert Added successfully';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

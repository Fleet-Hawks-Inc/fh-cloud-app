import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-add-item-group',
  templateUrl: './add-item-group.component.html',
  styleUrls: ['./add-item-group.component.css'],
})
export class AddItemGroupComponent implements OnInit {
  title = 'Add Item Group';
  errors = {};
  form;
  concatArrayKeys = '';
  /********** Form Fields ***********/
  groupName = '';
  description = '';

  /******************/


  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  addGroup() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      groupName: this.groupName,
      description: this.description,
    };

    this.apiService.postData('itemGroups', data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/'([^']+)'/)[1];

              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {},
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Item Group added successfully';
        this.groupName = '';
        this.description = '';
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
      this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(
      0,
      this.concatArrayKeys.length - 1
    );
    return this.concatArrayKeys;
  }
}

import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import {from, of} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  title = 'Add Account';
  errors = {};
  form;
  concatArrayKeys = '';
  /********** Form Fields ***********/

  accountType = '';
  accountName = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {
      $(document).ready(() => {
          this.form = $('#form_').validate();
      });
  }




  addAccount() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      accountType: this.accountType,
      accountName: this.accountName
    };

    console.log(data);
    this.apiService.postData('accounts', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/"([^']+)"/)[1];
                 val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[key] = val.message;
              }),
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => { },
            next: () => { }
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Account Added successfully';
        this.accountType = '';
        this.accountName = '';
      }
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
    this.concatArrayKeys = this.concatArrayKeys.substring(0, this.concatArrayKeys.length - 1);
    return this.concatArrayKeys;
  }
}

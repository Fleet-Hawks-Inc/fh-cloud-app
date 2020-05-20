import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import {from, of} from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  title = 'Edit Account';
  errors = {};
  form;
  concatArrayKeys = '';
  /********** Form Fields ***********/

  accountType = '';
  accountName = '';
  /******************/

  accountID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.accountID = this.route.snapshot.params['accountID'];
  this.fetchAccount();
   
  }

fetchAccount(){
  this.apiService.getData('accounts/' + this.accountID)
  .subscribe((result: any) => {
    result = result.Items[0];
  
    this.accountType = result.accountType;
    this.accountName = result.accountName;
  });

}



  updateAccount() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      accountID: this.accountID,
      accountType: this.accountType,
      accountName: this.accountName
    };

 console.log(data);
    this.apiService.putData('accounts', data).
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
        this.Success = 'Account Updated successfully';
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

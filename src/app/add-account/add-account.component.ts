import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  title = 'Add Account';

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

  ngOnInit() {}




  addAccount() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "accountType": this.accountType,
      "accountName": this.accountName
    };


    this.apiService.postData('accounts', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
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
}

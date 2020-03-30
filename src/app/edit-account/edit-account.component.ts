import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  title = 'Edit Account';

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
      "accountID": this.accountID,
      "accountType": this.accountType,
      "accountName": this.accountName
    };

    this.apiService.putData('accounts', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Account Updated successfully';

      }
    });
  }
}

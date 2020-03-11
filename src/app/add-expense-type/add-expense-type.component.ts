import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-expense-type',
  templateUrl: './add-expense-type.component.html',
  styleUrls: ['./add-expense-type.component.css']
})
export class AddExpenseTypeComponent implements OnInit {
  title = 'Add Expense Types';

  /********** Form Fields ***********/
  expenseType = '';
  description = '';
  carrierID = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  addExpenseType() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "expenseType": this.expenseType,
      "description": this.description
    };


    this.apiService.postData('expenseTypes', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Expense Type Added successfully';

        this.expenseType = '';
        this.description = '';
        this.carrierID = '';

      }
    });
  }
}

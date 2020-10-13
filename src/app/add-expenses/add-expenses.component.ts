import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css']
})
export class AddExpensesComponent implements OnInit {
  title = 'Add Expenses';

  /********** Form Fields ***********/
  carrierID = '';
  expenseTypeID = '';
  userName = '';
  expense = '';
  location = '';
  attachmentID = '';
  tripID = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  addExpenses() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "expenseTypeID": this.expenseTypeID,
      "userName": this.userName,
      "expense": this.expense,
      "location": this.location,
      "attachmentID": this.attachmentID,
      "tripID": this.tripID
    };


    this.apiService.postData('expenses', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Expense Added successfully';


        this.userName = '';
        this.expense = '';
        this.location = '';
        this.attachmentID = '';
        this.tripID = '';



      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-expenses',
  templateUrl: './edit-expenses.component.html',
  styleUrls: ['./edit-expenses.component.css']
})
export class EditExpensesComponent implements OnInit {
  title = 'Edit Expenses';

  /********** Form Fields ***********/
  carrierID = '';
  expenseTypeID = '';
  userName = '';
  expense = '';
  location = '';
  attachmentID = '';
  tripID = '';

  /******************/

  expenseId ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.expenseId = this.route.snapshot.params['expenseId'];

    this.apiService.getData('expenses/' + this.expenseId)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.expenseTypeID = result.expenseTypeID;
          this.userName = result.userName;
          this.expense = result.expense;
          this.location = result.location;
          this.attachmentID = result.attachmentID;
          this.tripID = result.tripID;

        });

  }




  updateExpense() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "expenseID" : this.expenseId,
      "expenseTypeID": this.expenseTypeID,
      "userName": this.userName,
      "expense": this.expense,
      "location": this.location,
      "attachmentID": this.attachmentID,
      "tripID": this.tripID
    };

    this.apiService.putData('expenses', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Expense Updated successfully';

      }
    });
  }

}

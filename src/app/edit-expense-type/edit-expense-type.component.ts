import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-expense-type',
  templateUrl: './edit-expense-type.component.html',
  styleUrls: ['./edit-expense-type.component.css']
})
export class EditExpenseTypeComponent implements OnInit {
  title = 'Edit Expense Type';

  /********** Form Fields ***********/
  expenseType = '';
  description = '';


  /******************/

  expenseTypeId ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.expenseTypeId = this.route.snapshot.params['expenseTypeId'];

    this.apiService.getData('expenseTypes/' + this.expenseTypeId)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.expenseType = result.expenseType;
          this.description = result.description;


        });

  }




  updateExpenseType() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "expenseTypeID" : this.expenseTypeId,
      "expenseType": this.expenseType,
      "description": this.description
    };

    this.apiService.putData('expenseTypes', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Expenses Type Updated successfully';

      }
    });
  }

}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-expense-type',
  templateUrl: './add-expense-type.component.html',
  styleUrls: ['./add-expense-type.component.css']
})
export class AddExpenseTypeComponent implements OnInit {
  title = 'Add Expense Types';

  /********** Form Fields ***********/
  expenseTypeName = '';
  description = '';

  /******************/

  errors={};
  form;
  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }

  

  addExpenseType() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      expenseTypeName: this.expenseTypeName,
      description: this.description  };

    const handleError = this.apiService.postData("expenseTypes", data)
      .pipe(
        catchError((err) => {
          return from(err.error)
        }),
        tap((val) => console.log(val)),
        map((val: any) => {
            val.message = val.message.replace(/".*"/, 'This Field');
            this.errors[val.path[0]] = val.message ;
        }),
        )
      .subscribe({
      complete: () => {},
      error: (err) => {
        console.log(err);
        // this.mapErrors(err.error);
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        if (!$.isEmptyObject(this.errors)) {
         return this.throwErrors();
        }
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Ticket Added successfully";
        this.expenseTypeName = "";
        this.description = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
    }

}

import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-expense-type",
  templateUrl: "./add-expense-type.component.html",
  styleUrls: ["./add-expense-type.component.css"],
})
export class AddExpenseTypeComponent implements OnInit {
  title = "Add Type";

  /********** Form Fields ***********/
  expenseTypeName = "";
  description = "";

  /******************/

  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  addExpenseType() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      expenseTypeName: this.expenseTypeName,
      description: this.description,
    };

    this.apiService.postData("expenseTypes", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];

              val.message = val.message.replace(/".*"/, "This Field");
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
        this.Success = "Expense Type added successfully";
        this.expenseTypeName = "";
        this.description = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

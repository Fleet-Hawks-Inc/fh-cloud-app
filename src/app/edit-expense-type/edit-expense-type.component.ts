import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-expense-type",
  templateUrl: "./edit-expense-type.component.html",
  styleUrls: ["./edit-expense-type.component.css"],
})
export class EditExpenseTypeComponent implements OnInit {
  title = "Edit Expense Types";

  /********** Form Fields ***********/
  expenseTypeID = "";
  expenseTypeName = "";
  description = "";
  timeCreated = "";

  /******************/

  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.expenseTypeID = this.route.snapshot.params["expenseTypeID"];
   
    this.fetchExpenseType();
  }

  fetchExpenseType() {
    this.apiService.getData("expenseTypes/" + this.expenseTypeID).subscribe((result: any) => {
      result = result.Items[0];

      this.expenseTypeName = result.expenseTypeName;
      this.description = result.description;
      this.timeCreated = result.timeCreated;
    });
  }

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
      expenseTypeID: this.expenseTypeID,
      expenseTypeName: this.expenseTypeName,
      description: this.description,
      timeCreated: this.timeCreated
    };

    const handleError = this.apiService
      .putData("expenseTypes", data)
      .pipe(
        catchError((err) => {
          return from(err.error);
        }),
        tap((val) => console.log(val)),
        map((val: any) => {
          val.message = val.message.replace(/".*"/, "This Field");
          this.errors[val.path[0]] = val.message;
        })
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
          this.Success = "Expense Type updated successfully";
        },
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

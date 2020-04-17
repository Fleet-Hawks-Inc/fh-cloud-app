import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
// declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-entry",
  templateUrl: "./add-entry.component.html",
  styleUrls: ["./add-entry.component.css"],
})
export class AddEntryComponent implements OnInit {
  title = "Add Stock Entry";

  /********** Form Fields ***********/

  itemID = "";
  totalQuantity = "";
  vendorID = "";
  description = "";
  /******************/
  form;
  errors = {};
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

  addStockEntry() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      itemID: this.itemID,
      totalQuantity: this.totalQuantity,
      vendorID: this.vendorID,
      description: this.description,
    };

    const handleError = this.apiService
      .postData("stockEntries", data)
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
          this.Success = "Stock entry Added successfully";
          this.itemID = "";
          this.totalQuantity = "";
          this.vendorID = "";
          this.description = "";
        },
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

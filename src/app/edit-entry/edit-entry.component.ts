import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var $: any;

@Component({
  selector: "app-edit-entry",
  templateUrl: "./edit-entry.component.html",
  styleUrls: ["./edit-entry.component.css"],
})
export class EditEntryComponent implements OnInit {
  title = "Add Stock Entry";

  /********** Form Fields ***********/

  entryID = "";
  itemID = "";
  totalQuantity = "";
  vendorID = "";
  description = "";
  timeCreated = "";
  /******************/
  form;
  errors = {};
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.entryID = this.route.snapshot.params["entryID"];

    this.apiService
      .getData("stockEntries/" + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.itemID = result.itemID;
        this.totalQuantity = result.totalQuantity;
        this.vendorID = result.vendorID;
        this.description = result.description;
        this.timeCreated = result.timeCreated
      });
  }

  updateStockEntry() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      entryID: this.entryID,
      itemID: this.itemID,
      totalQuantity: this.totalQuantity,
      vendorID: this.vendorID,
      description: this.description,
      timeCreated: this.timeCreated
    };

    const handleError = this.apiService
      .putData("stockEntries", data)
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
          this.Success = "Stock entry updated successfully";
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

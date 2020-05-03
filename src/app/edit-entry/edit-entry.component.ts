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
  items = [];
  vendors = [];
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
        this.timeCreated = result.timeCreated;
      });

    this.fetchItems();
    this.fetchVendors();
  }

  fetchItems() {
    this.apiService.getData("items").subscribe((result: any) => {
      this.items = result.Items;
    });
  }

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
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
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("stockEntries", data).subscribe({
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
        this.Success = "Stock entry updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

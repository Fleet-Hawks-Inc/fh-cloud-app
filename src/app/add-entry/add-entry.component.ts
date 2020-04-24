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

  items = [];
  vendors = [];
  itemID = "";
  totalQuantity = "";
  vendorID = "";
  description = "";
  /******************/
  form;
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchItems();
    this.fetchVendors();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
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

    this.apiService.postData("stockEntries", data).subscribe({
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
        this.Success = "Stock entry added successfully";
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

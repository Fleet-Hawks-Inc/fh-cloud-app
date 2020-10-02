import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: "app-edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.css"],
})
export class EditItemComponent implements OnInit {
  title = "Edit Item";
  errors = {};
  form;
  concatArrayKeys = "";

  /**
   * Form props
   */
  taxAccounts = [];
  vendors: [];
  itemID = "";
  itemName = "";
  description = "";
  defaultPurchasePrice = "";
  defaultPurchaseVendor = "";
  defaultTaxAccount = "";
  openingStock = "";
  timeCreated = "";

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}
  ngOnInit() {
    this.itemID = this.route.snapshot.params["itemID"];
    this.fetchVendors();
    this.fetchItem();
    this.fetchAccounts();
  }

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
  }

  fetchAccounts() {
    this.apiService
      .getData(`accounts/accountType/Tax`)
      .subscribe((result: any) => {
        this.taxAccounts = result.Items;
      });
  }

  fetchItem() {
    this.apiService.getData("items/" + this.itemID).subscribe((result: any) => {
      result = result.Items[0];

      this.itemID = result.itemID;
      this.itemName = result.itemName;
      this.defaultPurchasePrice = result.defaultPurchasePrice;
      this.defaultPurchaseVendor = result.defaultPurchaseVendor;
      this.defaultTaxAccount = result.defaultTaxAccount;
      this.description = result.description;
      this.openingStock = result.openingStock;
      this.timeCreated = result.timeCreated;
    });
  }

  updateItem() {
    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      itemID: this.itemID,
      itemName: this.itemName,
      description: this.description,
      defaultPurchasePrice: this.defaultPurchasePrice,
      defaultPurchaseVendor: this.defaultPurchaseVendor,
      defaultTaxAccount: this.defaultTaxAccount,
      openingStock: this.openingStock,
      timeCreated: this.timeCreated,
    };

    this.apiService.putData("items", data).subscribe({
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
        this.Success = "Item updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = "";
    for (const i in path) {
      this.concatArrayKeys += path[i] + ".";
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(
      0,
      this.concatArrayKeys.length - 1
    );
    return this.concatArrayKeys;
  }
}

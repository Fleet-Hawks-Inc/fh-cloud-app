import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: "app-add-vendor",
  templateUrl: "./add-vendor.component.html",
  styleUrls: ["./add-vendor.component.css"],
})
export class AddVendorComponent implements OnInit {
  parentTitle = "Vendors";
  title = "Add Vendor";
  errors = {};
  form;
  concatArrayKeys = "";

  /**
   * Form Props
   */
  vendorName = "";
  vendorType = "";
  geoLocation = {
    latitude: "12.2",
    longitude: "23.2",
  };
  address = "";
  stateID = "";
  countryID = "";
  taxID = "";
  creditDays = "";

  countries = [];
  states = [];
  taxAccounts = [];

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCountries();
    this.fetchAccounts();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData(`states/countryID/${this.countryID}`)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  fetchAccounts() {
    this.apiService
      .getData(`accounts/accountType/Tax`)
      .subscribe((result: any) => {
        this.taxAccounts = result.Items;
      });
  }

  addVendor() {
    let data = {
      vendorName: this.vendorName,
      vendorType: this.vendorType,
      geoLocation: {
        latitude: this.geoLocation.latitude,
        longitude: this.geoLocation.longitude,
      },
      address: this.address,
      stateID: this.stateID,
      countryID: this.countryID,
      taxID: this.taxID,
      creditDays: this.creditDays,
    };

    this.apiService.postData("vendors", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
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
        this.Success = "Vendor added successfully";
        this.vendorName = "";
        this.vendorType = "";
        this.geoLocation = {
          latitude: "",
          longitude: "",
        };
        this.address = "";
        this.stateID = "";
        this.countryID = "";
        this.taxID = "";
        this.creditDays = "";
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

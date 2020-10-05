import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";

declare var $: any;

@Component({
  selector: "app-carrier-registration",
  templateUrl: "./carrier-registration.component.html",
  styleUrls: ["./carrier-registration.component.css"],
})
export class CarrierRegistrationComponent implements OnInit {
  title = "Add Carrier";
  activeTab = "company_settings";
  errors = {};
  form;
  concatArrayKeys = "";
  /********** Form Fields ***********/

  carrierName = "";
  taxID = "";
  companyNumber = "";
  address = {
    streetNo: "",
    streetName: "",
    cityID: "",
    stateID: "",
    zipCode: "",
    countryID: "",
  };
  carrierEmail = '';

  /******************/

  users = [];
  cities = [];
  states = [];
  countries = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCountries();
    this.fetchUsers();



    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  fetchUsers() {
    this.apiService.getData("users").subscribe((result: any) => {
      this.users = result.Items;
    });
  }

  getStates() {
    this.apiService
        .getData("states/country/" + this.address.countryID)
        .subscribe((result: any) => {
          this.states = result.Items;
        });
  }

  getCities() {
    this.apiService
        .getData("cities/state/" + this.address.stateID)
        .subscribe((result: any) => {
          this.cities = result.Items;
        });
  }

  company_settings() {
    this.activeTab = "company_settings";
    $("#company_settings").show();
    $("#unit_settings, #asset_settings, #driver_performance").hide();
  }



  addCarrier() {
    this.hasError = false;
    this.hasSuccess = false;



    const data = {
      carrierName: this.carrierName,
      carrierEmail: this.carrierEmail,
      address: {
        streetNo: this.address.streetNo,
        streetName: this.address.streetName,
        cityID: this.address.cityID,
        stateID: this.address.stateID,
        zipCode: this.address.zipCode,
        countryID: this.address.countryID,
      }
    };
    //  console.log(data);return;
    this.apiService.postData("carriers", data).subscribe({
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
        this.Success = "Carrier Added successfully";
        this.carrierName = "";
        this.taxID = "";
        this.companyNumber = "";
        this.address = {
          streetNo: "",
          streetName: "",
          cityID: "",
          stateID: "",
          zipCode: "",
          countryID: "",
        };

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

import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-edit-manufacturer",
  templateUrl: "./edit-manufacturer.component.html",
  styleUrls: ["./edit-manufacturer.component.css"],
})
export class EditManufacturerComponent implements OnInit {
  title = "Edit Manufacturer";

  errors = {};
  form;

  /********** Form Fields ***********/
  manufacturerID = "";
  manufacturerType = "";
  name = "";
  cityID = "";
  stateID = "";
  countryID = "";
  customerCarePhone = "";
  customerCareEmail = "";
  timeCreated = "";
  countries = [];
  states = [];
  cities = [];

  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.manufacturerID = this.route.snapshot.params["manufacturerID"];
    this.fetchCountries();
    this.fetchStates();
    this.fetchCities();
    this.fetchManufacturer();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchManufacturer() {
    this.apiService.getData("manufacturers/" + this.manufacturerID).subscribe((result: any) => {
      result = result.Items[0];
      this.manufacturerType = result.manufacturerType;
      this.name = result.name;
      this.cityID = result.cityID;
      this.stateID = result.stateID;
      this.countryID = result.countryID;
      this.customerCarePhone = result.customerCarePhone;
      this.customerCareEmail = result.customerCareEmail;
      this.timeCreated = result.timeCreated;
    });
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  fetchStates() {
    this.apiService.getData("states").subscribe((result: any) => {
      this.states = result.Items;
    });
  }

  fetchCities() {
    this.apiService.getData("cities").subscribe((result: any) => {
      this.cities = result.Items;
    });
  }

  updateManufacturer() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      manufacturerID: this.manufacturerID,
      manufacturerType: this.manufacturerType,
      name: this.name,
      cityID: this.cityID,
      stateID: this.stateID,
      countryID: this.countryID,
      customerCarePhone: this.customerCarePhone,
      customerCareEmail: this.customerCareEmail,
      timeCreated: this.timeCreated
    };

    this.apiService.putData("manufacturers", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe((val) => {
            this.throwErrors();
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = "Manufacturer updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

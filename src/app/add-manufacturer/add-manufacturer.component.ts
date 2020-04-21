import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-add-manufacturer",
  templateUrl: "./add-manufacturer.component.html",
  styleUrls: ["./add-manufacturer.component.css"],
})
export class AddManufacturerComponent implements OnInit {
  title = "Add Manufacturer";

  errors = {};
  form;

  /********** Form Fields ***********/

  manufacturerType = "";
  name = "";
  cityID = "";
  stateID = "";
  countryID = "";
  customerCarePhone = "";
  customerCareEmail = "";
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
    this.fetchCountries();
    this.fetchStates();
    this.fetchCities();
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchStates(){
    this.apiService.getData('states')
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  fetchCities(){
    this.apiService.getData('cities')
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }


  addManufacturer() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      manufacturerType: this.manufacturerType,
      name: this.name,
      cityID: this.cityID,
      stateID: this.stateID,
      countryID: this.countryID,
      customerCarePhone: this.customerCarePhone,
      customerCareEmail: this.customerCareEmail,
    };

    this.apiService.postData("manufacturers", data).subscribe({
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
        this.manufacturerType = "";
        this.name = "";
        this.cityID = "";
        this.stateID = "";
        this.countryID = "";
        this.customerCarePhone = "";
        this.customerCareEmail = "";

        this.response = res;
        this.hasSuccess = true;
        this.Success = "Manufacturer Added successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

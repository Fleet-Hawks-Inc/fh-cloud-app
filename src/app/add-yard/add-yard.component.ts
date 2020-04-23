import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-yard",
  templateUrl: "./add-yard.component.html",
  styleUrls: ["./add-yard.component.css"],
})
export class AddYardComponent implements OnInit, AfterViewInit {
  title = "Add Yard";

  errors = {};
  form;

  /********** Form Fields ***********/

  yardName = "";
  description = "";
  latitude = "12";
  longitude = "34";
  geofence = "ludhiana";
  state = "";
  country = "";

  /******************/
  countries = [];
  states = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCountries();

  }

  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  getStates(){
    this.apiService.getData('states/countryID/' + this.country)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  addYard() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      yardName: this.yardName,
      description: this.description,
      geolocation: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      geofence: this.geofence,
      state: this.state,
      country: this.country,
    };

    this.apiService
      .postData("yards", data)
      .pipe(
        catchError((err) => {
          return from(err.error);
        }),
        tap((val) => console.log(val)),
        map((val: any) => {
          val.message = val.message.replace(/".*"/, "This Field");
          this.errors[val.context.key] = val.message;
        })
      )
      .subscribe({
        complete: () => {},
        error: (err) => {
          this.hasError = true;
          this.Error = err.error;
        },
        next: (res) => {
          if (!$.isEmptyObject(this.errors)) {
            return this.throwErrors();
          }
          this.response = res;
          this.hasSuccess = true;
          this.Success = "Yard Added successfully";
          this.yardName = "";
          this.description = "";
          this.geofence = "";
          this.latitude = "";
          this.longitude = "";
        },
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

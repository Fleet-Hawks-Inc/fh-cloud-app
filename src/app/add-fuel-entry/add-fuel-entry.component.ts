  import { AfterViewInit, Component, OnInit } from "@angular/core";
  import { ApiService } from "../api.service";
  import { Router } from "@angular/router";
  import { catchError, map, mapTo, tap } from "rxjs/operators";
  import { from, of } from "rxjs";
  declare var jquery: any;
  declare var $: any;

  @Component({
    selector: "app-add-fuel-entry",
    templateUrl: "./add-fuel-entry.component.html",
    styleUrls: ["./add-fuel-entry.component.css"],
  })
  export class AddFuelEntryComponent implements OnInit {
    title = "Add Fuel Entry";

    /********** Form Fields ***********/

    vehicleID: "";
    vendorID: "";
    location: "";
    odometer: "";
    fuelType: "";
    tripID: "";
    date: "";
    price: "";
    volume: "";
    vehicles = [];
    vendors = [];
    /******************/

    errors = {};
    form;
    response: any = "";
    hasError: boolean = false;
    hasSuccess: boolean = false;
    Error: string = "";
    Success: string = "";
    constructor(private apiService: ApiService, private router: Router) {}

    ngOnInit() {
      this.fetchVehicles();
      this.fetchVendors();
    }
  
    fetchVehicles(){
      this.apiService.getData('vehicles')
      .subscribe((result: any) => {
        this.vehicles = result.Items;
      });
    }
  
    fetchVendors(){
      this.apiService.getData('vendors')
      .subscribe((result: any) => {
        this.vendors = result.Items;
      });
    }

    ngAfterViewInit() {
      $(document).ready(() => {
        this.form = $("#form_").validate();
      });
    }

    addFuelEntry() {
      this.errors = {};

      this.hasError = false;
      this.hasSuccess = false;

      let data = {
        vehicleID: this.vehicleID,
        vendorID: this.vendorID,
        location: this.location,
        odometer: this.odometer,
        fuelType: this.fuelType,
        tripID: this.tripID,
        date: this.date,
        price: this.price,
        volume: this.volume,
      };

      const handleError = this.apiService
        .postData("fuelEntries", data)
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
            console.log(err);
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
            this.Success = "Fuel entry Added successfully";
            this.vehicleID = "";
            this.vendorID = "";
            this.location = "";
            this.odometer = "";
            this.fuelType = "";
            this.tripID = "";
            this.date = "";
            this.price = "";
            this.volume = "";
          },
        });
    }

    throwErrors() {
      this.form.showErrors(this.errors);
    }
  }

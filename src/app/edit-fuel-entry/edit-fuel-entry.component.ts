import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-fuel-entry",
  templateUrl: "./edit-fuel-entry.component.html",
  styleUrls: ["./edit-fuel-entry.component.css"],
})
export class EditFuelEntryComponent implements OnInit {
  title = "Add Fuel Entry";

  /********** Form Fields ***********/
  entryID: "";
  vehicleID: "";
  vendorID: "";
  location: "";
  odometer: "";
  fuelType: "";
  tripID: "";
  date: "";
  price: "";
  volume: "";
  timeCreated: "";
  /******************/

  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.entryID = this.route.snapshot.params["entryID"];

    this.fetchFuelEntry();
  }

  fetchFuelEntry() {
    this.apiService
      .getData("fuelEntries/" + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];

        this.vehicleID = result.vehicleID;
        this.vendorID = result.vendorID;
        this.location = result.location;
        this.odometer = result.odometer;
        this.fuelType = result.fuelType;
        this.tripID = result.tripID;
        this.date = result.date;
        this.price = result.price;
        this.volume = result.volume;
        this.timeCreated = result.timeCreated;
      });
  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  updateFuelEntry() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    let data = {
      entryID: this.entryID,
      vehicleID: this.vehicleID,
      vendorID: this.vendorID,
      location: this.location,
      odometer: this.odometer,
      fuelType: this.fuelType,
      tripID: this.tripID,
      date: this.date,
      price: this.price,
      volume: this.volume,
      timeCreated: this.timeCreated
    };
    //console.log(data);return;
    const handleError = this.apiService
      .putData("fuelEntries", data)
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
          this.Success = "Fuel entry updated successfully";
        },
      });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

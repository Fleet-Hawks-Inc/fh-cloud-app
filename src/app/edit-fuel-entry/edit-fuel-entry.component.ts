import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import {AwsUploadService} from '../aws-upload.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-fuel-entry",
  templateUrl: "./edit-fuel-entry.component.html",
  styleUrls: ["./edit-fuel-entry.component.css"],
})
export class EditFuelEntryComponent implements OnInit {
  title = "Add Fuel Entry";

  imageError = '';
  fileName = '';

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

  vehicles = [];
  vendors = [];
  trips = [];
  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private awsUS: AwsUploadService) {}

  ngOnInit() {
    this.entryID = this.route.snapshot.params["entryID"];

    this.fetchFuelEntry();
    this.fetchVehicles();
    this.fetchVendors();
    this.fetchTrips();
  }

  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchTrips() {
    this.apiService.getData("trips").subscribe((result: any) => {
      this.trips = result.Items;
    });
  }

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      this.vendors = result.Items;
    });
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

    if (this.fileName === '') {
      this.imageError = 'Please Choose Image To Upload';
      return;
    }

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
      timeCreated: this.timeCreated,
    };
    //console.log(data);return;
    this.apiService.putData("fuelEntries", data).subscribe({
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
        this.Success = "Fuel entry updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  uploadFile(event) {
    this.imageError = '';
    if (this.awsUS.imageFormat(event.target.files.item(0)) !== -1) {
      this.fileName = this.awsUS.uploadFile('test', event.target.files.item(0));
    } else {
      this.fileName = '';
      this.imageError = 'Invalid Image Format';
    }
  }

}

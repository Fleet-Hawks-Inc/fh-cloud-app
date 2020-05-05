import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
import {AwsUploadService} from '../aws-upload.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-add-fuel-entry",
  templateUrl: "./add-fuel-entry.component.html",
  styleUrls: ["./add-fuel-entry.component.css"],
})
export class AddFuelEntryComponent implements OnInit {
  title = "Add Fuel Entry";

  imageError = '';
  fileName = '';

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
  trips = [];
  /******************/

  errors = {};
  form;
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(private apiService: ApiService,
              private router: Router,
              private awsUS: AwsUploadService) {}

  ngOnInit() {
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

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  addFuelEntry() {
    if (this.fileName === '') {
      this.imageError = 'Please Choose Image To Upload';
      return;
    }

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

    this.apiService.postData("fuelEntries", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              // this.errors[key] = val.message;
              // Or We Can Use This One To Extract Key
              // const key = this.concatArray(path);
              // this.errors[this.concatArray(path)] = val.message;
              // if (key.length === 2) {
              // this.errors[val.context.key] = val.message;
              // } else {
              // this.errors[key] = val.message;
              // }
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

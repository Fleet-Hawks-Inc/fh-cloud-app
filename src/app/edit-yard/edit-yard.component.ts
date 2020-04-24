import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-edit-yard",
  templateUrl: "./edit-yard.component.html",
  styleUrls: ["./edit-yard.component.css"],
})
export class EditYardComponent implements OnInit, AfterViewInit {
  title = "Edit Yard";

  errors = {};
  form;

  /********** Form Fields ***********/

  yardName = "";
  description = "";
  latitude = "";
  longitude = "";
  geofence = "";
  stateID = "";
  countryID = "";
  timeCreated = "";
  /******************/

  yardID = "";
  countries = [];
  states = [];

  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.yardID = this.route.snapshot.params["yardID"];
    this.fetchCountries();

    this.apiService.getData("yards/" + this.yardID).subscribe((result: any) => {
      result = result.Items[0];
      this.yardName = result.yardName;
      this.description = result.description;
      this.latitude = result.geolocation.latitude;
      this.longitude = result.geolocation.longitude;
      this.geofence = result.geofence;
      this.stateID = result.stateID;
      this.countryID = result.countryID;
      this.timeCreated = result.timeCreated;
    });

    setTimeout(() => {
      this.fillCountry();
    }, 2000);
  }

  

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  fillCountry() {
    this.apiService
      .getData("states/" + this.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }

  getStates() {
    this.apiService
      .getData("states/countryID/" + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  updateYard() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      yardID: this.yardID,
      yardName: this.yardName,
      description: this.description,
      geolocation: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      geofence: this.geofence,
      stateID: this.stateID,
      countryID: this.countryID,
      timeCreated: this.timeCreated
    };

    this.apiService.putData("yards", data).subscribe({
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
        this.Success = "Yard updated successfully";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

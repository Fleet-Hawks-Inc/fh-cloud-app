import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { MapBoxService } from "../map-box.service";
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
  latitude = "";
  longitude = "";

  stateID = "";
  countryID = "";

  /******************/
  countries = [];
  states = [];
  response: any = "";
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = "";
  Success: string = "";
  constructor(
    private apiService: ApiService,
    private mapBoxService: MapBoxService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchCountries();
    $(document).ready(() => {
      $("#countryId").select2();
      $("#stateID").select2();
      $("#countryId").on("change", () => {
        this.countryID = $("#countryId").val();
        //$('#stateID').empty();
        $("#stateID").trigger("change");
        // $('#stateID').empty();
        this.getStates();
      });
    });
  }

  initMap() {
    if ($("#map-div").is(":visible")) {
      $("#map-div").hide("slow");
    } else {
      $("#map-div").show("slow");
    }

    this.mapBoxService.initMapbox(-104.618896, 50.44521);
  }

  fetchCountries() {
    this.apiService.getData("countries").subscribe({
      complete: () => {
        //$('#countryId').select2()
      },
      error: () => {},
      next: (result: any) => {
        this.countries = result.Items;
      },
    });
  }

  getStates() {
    this.apiService
      .getData("states/countryID/" + this.countryID)
      .subscribe((result: any) => {
        // $('#stateID').val(null).trigger('change');
        $("#stateID").select2("data", null);
        this.states = result.Items;
        $("#stateID").select2();
        $("#stateID").trigger("change");
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
        latitude: this.mapBoxService.latitude,
        longitude: this.mapBoxService.longitude,
      },
      geofence: this.mapBoxService.plottedMap || "No GeofenceData",
      stateID: this.stateID,
      countryID: this.countryID,
    };

    this.apiService.postData("yards", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
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
        this.Success = "Yard added successfully";
        this.yardName = "";
        this.countryID = "";
        this.stateID = "";
        this.description = "";
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }
}

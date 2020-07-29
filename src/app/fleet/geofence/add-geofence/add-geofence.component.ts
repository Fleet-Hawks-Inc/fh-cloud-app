import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../api.service";
import { from } from "rxjs";
import { MapBoxService } from "../../../map-box.service";
import { map } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-add-geofence",
  templateUrl: "./add-geofence.component.html",
  styleUrls: ["./add-geofence.component.css"],
})
export class AddGeofenceComponent implements OnInit {
  title = "Add Geofence";

  errors = {};
  form;

  /********** Form Fields ***********/

  fenceName = "";
  location = "";
  geofenceType = "";
  description = "";
  geoLocation = {
    latitude: "",
    longitude: "",
  };
  geofence = "";
  geofenceNewCategory = "";
  /******************/

  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  constructor(
    private route: ActivatedRoute,
    private mapBoxService: MapBoxService,

    private apiService: ApiService
  ) {}

  ngOnInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
    this.mapBoxService.initMapbox(-104.618896, 50.44521);
    $(document).ready(() => {
      this.form = $("#form1_").validate();
    });
  }

  // initMap() {
  //   if ($("#map-div").is(":visible")) {
  //     $("#map-div").hide("slow");
  //   } else {
  //     $("#map-div").show("slow");
  //   }

  //   this.mapBoxService.initMapbox(-104.618896, 50.44521);
  // }
addCategory(){
  this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data1 = {
      geofenceNewCategory: this.geofenceNewCategory
    };
    console.log(data1);
}
  addGeofence() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    // if(!this.mapBoxService.plottedMap){
    //   alert('Please draw the geofence'); return false;
    // }

    const data = {
      fenceName: this.fenceName,
      location: this.location,
      description: this.description,
      geofenceType:this.geofenceType,
      geoLocation: {
        latitude: this.mapBoxService.latitude,
        longitude: this.mapBoxService.longitude,
      },
      geofence: this.mapBoxService.plottedMap || [],
    };
console.log(data);
return;
    this.apiService.postData("geofences", data).subscribe({
      complete: () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
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
        this.fenceName = "";
        this.location = "";
        this.description = "";

        this.response = res;
        this.hasSuccess = true;
        this.Success = "Geofence Added successfully";
        // this.initMap();
        this.mapBoxService.plottedMap = '';
        
      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  createGeofenceTypeModal() {
    $( document ).ready(function() {
      $('#addGeofenceCategoryModal').modal('show');
    });
  }
}

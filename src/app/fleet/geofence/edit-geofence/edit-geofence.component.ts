import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../api.service";
import { from } from "rxjs";
import { MapBoxService } from "../../../map-box.service";
import { map } from "rxjs/operators";
declare var $: any;
@Component({
  selector: "app-edit-geofence",
  templateUrl: "./edit-geofence.component.html",
  styleUrls: ["./edit-geofence.component.css"],
})
export class EditGeofenceComponent implements OnInit {
  title = "Edit Geofence";

  errors = {};
  form;

  /********** Form Fields ***********/

  geofenceID = "";
  fenceName = "";
  location = "";
  geofenceType = "";
  geoLocation = {
    latitude: "",
    longitude: "",
  };
  geofence = "";
  description = "";
  timeCreated = "";
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

  mockData = {
    description: "this is description of geo fence.",
    fenceName: "geo fence name",
    geofenceType: "Uncategorized",
    location: "Surrey,Canada"
  }
  ngOnInit() {
    // this.geofenceID = this.route.snapshot.params["fenceID"];

    // this.apiService
    //   .getData("geofences/" + this.geofenceID)
    //   .subscribe((result: any) => {
    //     result = result.Items[0];
        this.fenceName = this.mockData.fenceName;
        this.location = this.mockData.location;
        this.geofenceType = this.mockData.geofenceType;
        this.description = this.mockData.description;
        // this.geoLocation.latitude = result.geoLocation.latitude;
        // this.geoLocation.longitude = result.geoLocation.longitude;
        // this.geofence = result.geofence;
        // this.timeCreated = result.timeCreated;
      // });
      this.mapBoxService.initMapbox(-104.618896, 50.44521);
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
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

   
  //   this.mapBoxService.plotGeofencing(
  //     this.geofence,
  //     this.geoLocation.latitude,
  //     this.geoLocation.longitude
  //   );
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
  updateGeofence() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      geofenceID: this.geofenceID,
      geofenceType : this.geofenceType,
      fenceName: this.fenceName,
      location: this.location,
      description: this.description,
      // geoLocation: {
      //   latitude: this.mapBoxService.latitude,
      //   longitude: this.mapBoxService.longitude,
      // },
      // geofence: this.mapBoxService.plottedMap || [],
      // timeCreated: this.timeCreated,
    };
   console.log(data);
   return;
    this.apiService.putData("geofences", data).subscribe({
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
        this.Success = "Geofence Updated successfully";
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

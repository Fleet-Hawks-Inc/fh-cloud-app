import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { catchError, map, mapTo, tap } from "rxjs/operators";
import { from, of } from "rxjs";
declare var jquery: any;

declare var $: any;

// Mapbox Imports
import * as mapboxgl from 'mapbox-gl';
import * as mapboxSdk from '@mapbox/mapbox-sdk';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Geocoder from '@mapbox/mapbox-gl-geocoder';
import * as Turf from '@turf/turf';
import { environment } from 'src/environments/environment';

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

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/satellite-v9';
  lat = -104.618896;
  lng = 50.445210;
  isControlAdded = false;
  frontEndData = {};
  mapboxDraw: MapboxDraw;
  geoCoder: Geocoder;
  plottedMap: {};
  totalArea;
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.fetchCountries();
    //  this.initMapbox();
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

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
  }

  addYard() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.getGeofenceData();
    const data = {
      yardName: this.yardName,
      description: this.description,
      geolocation: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      geofence: this.plottedMap || 'No GeofenceData',
      stateID: this.stateID,
      countryID: this.countryID,
    };
    
    this.apiService.postData("yards", data).subscribe({
      complete: () => { },
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
            error: () => { },
            next: () => { },
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

  /** Mapbox */
  initMapbox() {
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({

      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-104.618896, 50.445210,],
      accessToken: environment.mapBox.accessToken,

    });
    // Add Geocoder
    this.geoCoder = new Geocoder({ accessToken: environment.mapBox.accessToken, mapboxgl: this.map });
    this.map.addControl(this.geoCoder);

    //Add Navigation
    this.map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

    // Add geofencing controls
    const mapboxDrawOptions = {
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    };

    this.mapboxDraw = new MapboxDraw(mapboxDrawOptions);

    this.map.addControl(this.mapboxDraw, 'top-left');
    this.geoFenceEvents();
  }

  geoFenceEvents() {
    this.map.on('draw.create', (e) => {

      //this.totalArea = `Total area geofenced  (sq. meters) ${Turf.area(e)}`;
      this.plottedMap = JSON.stringify(e.features, null, 4);

    });

    // this.map.on('draw.delete', (e) => {
    //   console.log('deleted')
    // });
    // this.map.on('draw.update', (e) => {
    //   console.log('deleted')
    // });

  }
  getGeofenceData = () => {
    const data = this.mapboxDraw.getAll();
    if (data.features) {
      this.totalArea = `Total area geofenced: ${Math.round(Turf.area(data))} sq. meters`;
      this.plottedMap = JSON.stringify(data.features, null, 4);

    }
  }

  plotGeofencing() {
    var feature = {
      id: 'unique-id',
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon', coordinates: [
          [
            [
              -113.96705829367045,
              50.98511129542845
            ],
            [
              -113.96454774603279,
              50.98509778734271
            ],
            [
              -113.96463357672111,
              50.98270003991033
            ],
            [
              -113.96706902250676,
              50.982747320634246
            ],
            [
              -113.96705829367045,
              50.98511129542845
            ]
          ]
        ]
      }
    };
    this.map.flyTo({
      center: [-113.96705829367045, 50.98511129542845],
      zoom: 16,
      // speed:10,
      // screenSpeed:5
    });

    var featureIds = this.mapboxDraw.add(feature);

  }

}

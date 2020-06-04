import { Injectable } from "@angular/core";

// Mapbox Imports
import * as mapboxgl from "mapbox-gl";
import * as mapboxSdk from "@mapbox/mapbox-sdk";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as Geocoder from "@mapbox/mapbox-gl-geocoder";
import * as Turf from "@turf/turf";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MapBoxService {
  map: mapboxgl.Map;
  style = "mapbox://styles/kunalfleethawks/ck86yfrzp0g3z1illpdp9hs3g";
  isControlAdded = false;
  frontEndData = {};
  mapboxDraw: MapboxDraw;
  geoCoder: Geocoder;
  plottedMap: {};
  totalArea;
  latitude = "";
  longitude = "";
  constructor() {}

  /** Mapbox */
  initMapbox(latitude: number, longitude: number) {
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: "map",
      style: this.style,
      zoom: 12,
      center: [latitude, longitude],
      accessToken: environment.mapBox.accessToken,
    });
    // Add Geocoder
    this.geoCoder = new Geocoder({
      accessToken: environment.mapBox.accessToken,
      mapboxgl: this.map,
    });
    this.map.addControl(this.geoCoder);

    //Add Navigation
    this.map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true })
    );

    // Add geofencing controls
    const mapboxDrawOptions = {
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    };

    this.mapboxDraw = new MapboxDraw(mapboxDrawOptions);

    this.map.addControl(this.mapboxDraw, "top-left");
    this.geoFenceEvents();
  }

  geoFenceEvents() {
    this.map.on("draw.create", (e) => {
      //this.totalArea = `Total area geofenced  (sq. meters) ${Turf.area(e)}`;
      this.plottedMap = e.features;

      //set lat and long
      this.latitude = e.features[0].geometry.coordinates[0][0][0];
      this.longitude = e.features[0].geometry.coordinates[0][0][1];
    });
  }

  getGeofenceData = () => {
    const data = this.mapboxDraw.getAll();
    if (data.features) {
      this.totalArea = `Total area geofenced: ${Math.round(
        Turf.area(data)
      )} sq. meters`;
      this.plottedMap = data.features;

      //set lat and long
      this.latitude = data.features[0].geometry.coordinates[0][0][0];
      this.longitude = data.features[0].geometry.coordinates[0][0][1];
    }
  };

  plotGeofencing(geofence, latitude, longitude) {
    var feature = geofence[0];
    this.map.flyTo({
      center: [latitude, longitude],
      zoom: 16,
      // speed:10,
      // screenSpeed:5
    });

    this.plottedMap = geofence;
    this.latitude = latitude;
    this.longitude = longitude;

    var featureIds = this.mapboxDraw.add(feature);
  }
}

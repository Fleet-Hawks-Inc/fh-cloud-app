import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../api.service";
import { environment } from '../../../../environments/environment';

import { from } from "rxjs";
//import { MapBoxService } from "../../../map-box.service";
import { LeafletMapService } from './../../../services/leaflet-map.service';
import { Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';


declare var $: any;
declare var L: any;
@Component({
  selector: "app-add-geofence",
  templateUrl: "./add-geofence.component.html",
  styleUrls: ["./add-geofence.component.css"],
})
export class AddGeofenceComponent implements OnInit {
  title = "Add Geofence";
  geofenceData = {
    geofence: {
      type: '',
      cords: []
    }
  };
  public marker;
  public map;
  destinationLocation;
  polygonData = [];
  showDestination = true;
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  

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
    //private mapBoxService: MapBoxService,
    private leafMap: LeafletMapService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // here maps initialization
    this.initGeoFenceMap();
    this.searchLocation()

    $(document).ready(() => {
      this.form = $("#form_").validate();
    });
    //this.mapBoxService.initMapbox(-104.618896, 50.44521);
    $(document).ready(() => {
      this.form = $("#form1_").validate();
    });
  }

  /**
   * Initialize Leaflet map for addGeofencing Page
   */
  initGeoFenceMap = () => {

    const here = {
      apiKey: environment.mapConfig.apiKey
    }
    const style = 'normal.night';
	  
    const hereTileUrl = `https://2.base.maps.ls.hereapi.com/maptile/2.1/trucktile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320&congestion=true`;
    
    const map = L.map('map', {
      	center: [37.773972, -122.431297],
      	zoom: 17,
      	layers: [L.tileLayer(hereTileUrl)]
	  });
    //L.marker([37.773972, -122.431297]).addTo(map);

    map.attributionControl.addAttribution('&copy; HERE 2020');
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
      drawMarker: false
    });
	  map.on('pm:create', (e) => {
		  // alert('pm:create event fired. See console for details');
		  const layer = e.layer;
			
			//console.log("lyr", layer)
      var polyedit = layer.toGeoJSON();
      this.geofenceData.geofence.type = polyedit.geometry.type;
      this.geofenceData.geofence.cords = polyedit.geometry.coordinates;
			
			console.log("created",this.geofenceData);
      
      layer.on('pm:edit',({layer}) => {
        
        var polyedit = layer.toGeoJSON();
        this.geofenceData.geofence.type = polyedit.geometry.type;
        this.geofenceData.geofence.cords = polyedit.geometry.coordinates;

        //console.log("edited",this.geofenceData);
        
      })
      
  });
	
	map.on('pm:cut', function (e) {
		  console.log('cut event on map');
		  //console.log(e);
	});
	map.on('pm:remove', function (e) {
		  console.log('pm:remove event fired.');
		  // alert('pm:remove event fired. See console for details');
		  //console.log(e);
  });
  
  this.map = map;
  
  
	
}

  
  addCategory() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    const data1 = {
      geofenceNewCategory: this.geofenceNewCategory
    };
    console.log(data1);
  }
  addGeofence() {
    console.log("data", this.polygonData);
    console.log("geofence", this.geofenceData);
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      fenceName: this.fenceName,
      location: this.location,
      description: this.description,
      geofenceType: this.geofenceType,
      // geoLocation: {
      //   latitude: this.mapBoxService.latitude,
      //   longitude: this.mapBoxService.longitude,
      // },
      //geofence: this.polygonData,
    };
    console.log(data);
    return;
    this.apiService.postData("geofences", data).subscribe({
      complete: () => { },
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
            error: () => { },
            next: () => { },
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
        //this.mapBoxService.plottedMap = '';

      },
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  createGeofenceTypeModal() {
    $(document).ready(function () {
      $('#addGeofenceCategoryModal').modal('show');
    });
  }


  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        target = e;
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.leafMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      console.log("res", res);
      this.searchResults = res;
      
    });
  }

  searchDestination(loc,lat, lng){
    this.destinationLocation = loc;
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.map.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1.5
    });
    //this.map.removeLayer(this.marker)
    
  }
  


  // Use this function while updating edit page of Geofence
  loadExistingGeoFence =(geofence:[]) =>{
    //console.log(this.polygonData)
    // code goes here
    // var polygonPoints = [
    //   [37.786617, -122.404654],
    //   [37.797843, -122.407057],
    //   [37.798962, -122.398260],
    //   [37.794299, -122.395234]];
    // var poly = L.polygon(polygonPoints).addTo(map);
  }
}

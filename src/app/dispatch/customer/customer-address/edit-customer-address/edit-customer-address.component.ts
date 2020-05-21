import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { MapBoxService } from "../../../../map-box.service";
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxClient from '@mapbox/mapbox-sdk';
import * as mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as Geocoder from "@mapbox/mapbox-gl-geocoder";
import { center } from '@turf/turf';

declare var $: any

@Component({
  selector: 'app-edit-customer-address',
  templateUrl: './edit-customer-address.component.html',
  styleUrls: ['./edit-customer-address.component.css']
})
export class EditCustomerAddressComponent implements OnInit {

  title = 'Edit Address';
  errors = {};
  form;
  concatArrayKeys = '';

  /********** Form Fields ***********/
  addressID = "";
  documentID = "";
  parent = "";
  streetNumber = "";
  streetName = "";
  cityID = "";
  stateID = "";
  countryID = "";
  addressZip = "";
  geoLocation = {
    latitude: "",
    longitude: "",
  };
  countries = [];
  states = [];
  cities = [];
  response : any ="";
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = "";
  Success : string = "";
   // MAP BOX Integration
   map: mapboxgl.Map;
   style = 'mapbox://styles/mapbox/streets-v9';
   lng = -104.618896;
   lat = 50.445210;
   mapboxDraw: MapboxDraw;
   
   address = "";
   countryName ="";
   cityName = "";
   stateName = "";

  constructor(private apiService: ApiService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.addressID = this.route.snapshot.params['addressID'];
    this.fetchCountries();
    this.fetchAddress();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    }); 
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-104.618896, 50.445210],
      accessToken: environment.mapBox.accessToken,
    }); 
   }
  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  getStates(){
    this.apiService.getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(){
    this.apiService.getData('cities/state/' + this.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
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
    }, 1000);
    setTimeout(() => {
      this.getCities();
    }, 1000);

  }
  initMap() {
    this.countryName = this.countries.filter(country => country.countryID == this.countryID)[0].countryName;
    this.stateName = this.states.filter(state => state.stateID == this.stateID)[0].stateName;
    this.cityName = this.cities.filter(city => city.cityID == this.cityID)[0].cityName;

    this.address = this.streetName + "," + this.streetNumber +","+ this.addressZip + ","+ this.cityName+" , " + this.stateName+ " , " + this.countryName;
     if ($("#map-div").is(":visible")) {
      $("#map-div").hide("slow");
    } else {
      $("#map-div").show("slow");
    }
 
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [this.lng , this.lat],
      accessToken: environment.mapBox.accessToken,


    });
    //Get address from controls
    // const address = "7725 48 St SE, Calgary, AB T2C 2V3, Canada";
   const address = this.address;
    const baseClient = mapboxClient({ accessToken: environment.mapBox.accessToken });
    const localClient = mapboxGeocoding(baseClient);

    localClient.forwardGeocode({
      query: address,
      limit: 1
    })
      .send()
      .then(response => {
        const match = response.body;
        // console.log(JSON.stringify(match.features[0].geometry.coordinates));
        this.lng = +JSON.stringify(match.features[0].geometry.coordinates[0]);
        this.lat = +JSON.stringify(match.features[0].geometry.coordinates[1]);
        console.log("old longitude", this.lng);
        console.log("old latitude", this.lat);
         var marker = new mapboxgl.Marker({
          draggable: true
        })
          .setLngLat(match.features[0].geometry.coordinates)
          .addTo(this.map);
        this.map.flyTo({
          center: match.features[0].geometry.coordinates,
          zoom: 12

        });
        marker.on('dragend', () => {
          var lngLat = marker.getLngLat();
          this.lat = lngLat.lat;
          this.lng = lngLat.lng;
          console.log("new longitude",this.lng);
          console.log("new latitude",this.lat);
        });
      });
  }
 
  fetchAddress()
  {
    this.apiService.getData('addresses/' + this.addressID)
    .subscribe((result: any) => {
      result = result.Items[0];
      // console.log("result address edit shipper address",result);
      this.parent = result.parent,
      this.documentID = result.documentID,
      this.streetNumber = result.streetNumber;
      this.streetName = result.streetName;
      this.cityID = result.cityID;
      this.stateID = result.stateID;
      this.countryID = result.countryID;
      this.addressZip = result.addressZip;
      this.geoLocation = {
          latitude : result.geoLocation.latitude,
          longitude : result.geoLocation.longitude
      };
    });
    
    setTimeout(() => {
      this.fillCountry();
    }, 1000);
  }
  updateAddress() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

   const dataAddress ={
      addressID: this.addressID,
      documentID : this.documentID,
      parent : this.parent,
      streetNumber: this.streetNumber,
      streetName: this.streetName,
      cityID: this.cityID,
      stateID: this.stateID,
      countryID: this.countryID,
      addressZip : this.addressZip,
      geoLocation: {
        latitude: this.lat,
        longitude: this.lng,
      } 
    }
   console.log("address data",dataAddress);
    this.apiService.putData('addresses', dataAddress).
    subscribe({
      complete : () => {},
      error : (err) =>  {
        from(err.error)
          .pipe(
            map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/"([^']+)"/)[1];
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[key] = val.message;
              }),
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
            },
            error: () => {},
            next: () => {}
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Address Updated successfully'
        this.streetNumber = "";
        this.streetName = "";
        this.cityID = "";
        this.stateID = "";
        this.countryID = "";
        this.addressZip = "";
      }
    });

  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
        this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(0, this.concatArrayKeys.length - 1);
    return this.concatArrayKeys;
  }

}

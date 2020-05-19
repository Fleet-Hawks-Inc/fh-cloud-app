import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import { from, of } from "rxjs";
import {map} from 'rxjs/operators';
import { MapBoxService } from "../../../map-box.service";
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxClient from '@mapbox/mapbox-sdk';
import * as mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  title = 'Edit Customer';
  errors = {};
  form;
  concatArrayKeys = '';


  /********** Form Fields ***********/
  customerID = "";
  customerName = "";
  customerCompanyNo = "";
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
  phone = "";
  email = "";
  fax = "";
  taxID = "";
  countries = [];
  states = [];
  cities = [];
  coordinates = [];
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

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.customerID = this.route.snapshot.params['customerID'];
    this.fetchCountries();
    this.fetchAddress();
    this.fetchCustomer();
    this.fetchCities();
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
  fetchCountries() {
    this.apiService.getData("countries").subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  getStates() {
    this.apiService
      .getData("states/country/" + this.countryID)
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

  fetchCities(){
    this.apiService.getData('cities')
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  fillCountry() {
    this.apiService
      .getData("states/" + this.countryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 2000);
  }

  fetchCustomer()
  {
    this.apiService.getData('customers/' + this.customerID)
    .subscribe((result: any) => {
      result = result.Items[0];

      this.customerName = result.name;
      this.phone = result.phone;
      this.fax = result.fax;
      this.email = result.email;
      this.taxID = result.taxID;
      this.customerCompanyNo = result.customerCompanyNo;
    });
  }

  fetchAddress()
  {
    this.apiService.getData('addresses/' + this.customerID)
    .subscribe((result: any) => {
      result = result.Items[0];

      this.streetNumber = result.streetNumber;
      this.streetName = result.streetName;
      this.cityID = result.cityID;
      this.stateID = result.stateID;
      this.countryID = result.countryID;
      this.addressZip = result.addressZip;
    });
  }

  updateCustomer() {
    this.errors= {};
    this.hasError = false;
    this.hasSuccess = false;

    const dataCustomer = {
      name: this.customerName,
      phone: this.phone,
      fax: this.fax,
      email: this.email,
      taxID: this.taxID,
      customerCompanyNo: this.customerCompanyNo,
    };
    const dataAddress ={
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
    };
    console.log("Address Data",dataAddress, "Customer Data",dataCustomer);
    //ADD INPUT INTO ADDRESS TABLE
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
        // this.hasSuccess = true;
        this.streetNumber = "";
        this.streetName = "";
        this.cityID = "";
        this.stateID = "";
        this.countryID = "";
        this.addressZip = "";
      }
    });
    this.apiService.putData('customers', dataCustomer).
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
            error: () => { },
            next: () => { }
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Customer Updated successfully';
        this.customerName = '';
        this.phone = '';
        this.fax = '';
        this.email = '';
        this.taxID = '';
        this.customerCompanyNo = '';
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

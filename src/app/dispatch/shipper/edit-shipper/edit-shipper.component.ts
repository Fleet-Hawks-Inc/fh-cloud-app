import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { MapBoxService } from "../../../map-box.service";
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxClient from '@mapbox/mapbox-sdk';
import * as mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as Geocoder from "@mapbox/mapbox-gl-geocoder";
import { center } from '@turf/turf';

declare var $: any;

@Component({
  selector: 'app-edit-shipper',
  templateUrl: './edit-shipper.component.html',
  styleUrls: ['./edit-shipper.component.css']
})
export class EditShipperComponent implements OnInit {
  title = 'Edit Shipper';
  errors = {};
  form;
  concatArrayKeys = '';

  /********** Form Fields ***********/
  shipperID = "";
  shipperName = "";
  // streetNumber = "";
  // streetName = "";
  // cityID = "";
  // stateID = "";
  // countryID = "";
  // addressZip = "";
  // geoLocation = {
  //   latitude: "",
  //   longitude: "",
  // };
  phone = "";
  email = "";
  fax = "";
  taxID = "";
  // countries = [];
  // states = [];
  // cities = [];
  response : any ="";
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = "";
  Success : string = "";
   // MAP BOX Integration
  //  map: mapboxgl.Map;
  //  style = 'mapbox://styles/mapbox/streets-v9';
  //  lng = -104.618896;
  //  lat = 50.445210;
  //  mapboxDraw: MapboxDraw;
   
  //  address = "";
  //  countryName ="";
  //  cityName = "";
  //  stateName = "";

  constructor(private apiService: ApiService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.shipperID = this.route.snapshot.params['shipperID'];
    // this.fetchCountries();
    // this.fetchAddress();
    // this.fetchCities();
    this.fetchShipper();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    }); 
  //   this.map = new mapboxgl.Map({
  //     container: 'map',
  //     style: this.style,
  //     zoom: 12,
  //     center: [-104.618896, 50.445210],
  //     accessToken: environment.mapBox.accessToken,
  //   }); 
  //  }
  // fetchCountries(){
  //   this.apiService.getData('countries')
  //     .subscribe((result: any) => {
  //       this.countries = result.Items;
  //     });
  // }
  // getStates(){
  //   this.apiService.getData('states/country/' + this.countryID)
  //     .subscribe((result: any) => {
  //       this.states = result.Items;
  //     });
  // }

  // getCities(){
  //   this.apiService.getData('cities/state/' + this.stateID)
  //     .subscribe((result: any) => {
  //       this.cities = result.Items;
  //     });
  // }
  // fillCountry() {
  //   this.apiService
  //     .getData("states/" + this.stateID)
  //     .subscribe((result: any) => {
  //       result = result.Items[0];
  //       this.countryID = result.countryID;
  //     });

  //   setTimeout(() => {
  //     this.getStates();
  //   }, 2000);
  // }
  // fetchCities(){
  //   this.apiService.getData('cities')
  //     .subscribe((result: any) => {
  //       this.cities = result.Items;
  //     });
  // }
  // initMap() {
  //   this.countryName = this.countries.filter(country => country.countryID == this.countryID)[0].countryName;
  //   this.stateName = this.states.filter(state => state.stateID == this.stateID)[0].stateName;
  //   this.cityName = this.cities.filter(city => city.cityID == this.cityID)[0].cityName;

  //   this.address = this.streetName + "," + this.streetNumber +","+ this.addressZip + ","+ this.cityName+" , " + this.stateName+ " , " + this.countryName;
  //    if ($("#map-div").is(":visible")) {
  //     $("#map-div").hide("slow");
  //   } else {
  //     $("#map-div").show("slow");
  //   }
 
  //   this.map = new mapboxgl.Map({
  //     container: 'map',
  //     style: this.style,
  //     zoom: 12,
  //     center: [this.lng , this.lat],
  //     accessToken: environment.mapBox.accessToken,


  //   });
  //   //Get address from controls
  //   // const address = "7725 48 St SE, Calgary, AB T2C 2V3, Canada";
  //  const address = this.address;
  //   const baseClient = mapboxClient({ accessToken: environment.mapBox.accessToken });
  //   const localClient = mapboxGeocoding(baseClient);

  //   localClient.forwardGeocode({
  //     query: address,
  //     limit: 1
  //   })
  //     .send()
  //     .then(response => {
  //       const match = response.body;
  //       // console.log(JSON.stringify(match.features[0].geometry.coordinates));
  //       this.lng = +JSON.stringify(match.features[0].geometry.coordinates[0]);
  //       this.lat = +JSON.stringify(match.features[0].geometry.coordinates[1]);
  //       console.log("old longitude", this.lng);
  //        var marker = new mapboxgl.Marker({
  //         draggable: true
  //       })
  //         .setLngLat(match.features[0].geometry.coordinates)
  //         .addTo(this.map);
  //       this.map.flyTo({
  //         center: match.features[0].geometry.coordinates,
  //         zoom: 12

  //       });
  //       marker.on('dragend', () => {
  //         var lngLat = marker.getLngLat();
  //         this.lat = lngLat.lat;
  //         this.lng = lngLat.lng;
  //         console.log("new longitude",this.lng);
  //         console.log("new latitude",this.lat);
  //       });
  //     });
  }
    fetchShipper(){
    this.apiService.getData('shippers/' + this.shipperID)
    .subscribe((result: any) => {
      //console.log(result);
      result = result.Items[0];
      this.shipperName = result.shipperName;
      this.phone =  result.phone;
      this.email =  result.email;
      this.fax = result.fax;
      this.taxID = result.taxID;
    });
  }
  
  // fetchAddress()
  // {
  //   this.apiService.getData('addresses/' + this.shipperID)
  //   .subscribe((result: any) => {
  //     result = result.Items[0];

  //     this.streetNumber = result.streetNumber;
  //     this.streetName = result.streetName;
  //     this.cityID = result.cityID;
  //     this.stateID = result.stateID;
  //     this.countryID = result.countryID;
  //     this.addressZip = result.addressZip;
  //   });
  // }
  updateShipper() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    const dataShipper = {
      shipperName: this.shipperName,
      phone: this.phone,
      email: this.email,
      fax : this.fax,
      taxID: this.taxID,
     
    };

    // const dataAddress ={
    //   streetNumber: this.streetNumber,
    //   streetName: this.streetName,
    //   cityID: this.cityID,
    //   stateID: this.stateID,
    //   countryID: this.countryID,
    //   addressZip : this.addressZip,
  
    // }
    console.log("Shipper Data",dataShipper); 

    // this.apiService.putData('addresses', dataAddress).
    // subscribe({
    //   complete : () => {},
    //   error : (err) =>  {
    //     from(err.error)
    //       .pipe(
    //         map((val: any) => {
    //             const path = val.path;
    //             // We Can Use This Method
    //             const key = val.message.match(/"([^']+)"/)[1];
    //             // this.errors[key] = val.message;
    //             // Or We Can Use This One To Extract Key
    //             // const key = this.concatArray(path);
    //             // this.errors[this.concatArray(path)] = val.message;
    //             // if (key.length === 2) {
    //             // this.errors[val.context.key] = val.message;
    //             // } else {
    //             // this.errors[key] = val.message;
    //             // }
    //             val.message = val.message.replace(/".*"/, 'This Field');
    //             this.errors[key] = val.message;
    //           }),
    //       )
    //       .subscribe({
    //         complete: () => {
    //           this.throwErrors();
    //         },
    //         error: () => {},
    //         next: () => {}
    //       });
    //     },
    //   next: (res) => {
    //     this.response = res;
    //     // this.hasSuccess = true;

    //     this.streetNumber = "";
    //     this.streetName = "";
    //     this.cityID = "";
    //     this.stateID = "";
    //     this.countryID = "";
    //     this.addressZip = "";
    //   }
    // });

     this.apiService.putData('shippers', dataShipper).
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
        this.Success = 'Shipper Updated successfully';

        this.shipperName = "";
        this.phone = "";
        this.email = "";
        this.fax = "";
        this.taxID = "";
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

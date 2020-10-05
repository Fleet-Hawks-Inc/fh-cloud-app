import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import { MapBoxService } from '../../../map-box.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxClient from '@mapbox/mapbox-sdk';
import * as mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  title = 'Add Customer';
  errors = {};
  form;
  concatArrayKeys = '';


  /********** Form Fields ***********/
  name = '';
  customerCompanyNo = '';
  customerAddress = {
    streetNumber : '',
    streetName : '',
    cityID : '',
    stateID : '',
    countryID : '',
    addressZip : '',
    geoLocation : {
      latitude: '',
      longitude: '',
    }
  };
  phone = '';
  email = '';
  fax = '';
  taxID = '';
  countries = [];
  states = [];
  cities = [];
  coordinates = [];
  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';


  // MAP BOX Integration
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v9';
  lng = -104.618896;
  lat = 50.445210;
  mapboxDraw: MapboxDraw;

  address = '';
  countryName ='';
  cityName = '';
  stateName = '';
  constructor(private apiService: ApiService,
              private mapBoxService :MapBoxService
              ) {}


  ngOnInit() {
    this.fetchCountries();
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-104.618896, 50.445210],
      accessToken: environment.mapBox.accessToken,
    });

  }
  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  initMap() {
    this.countryName = this.countries.filter(country => country.countryID == this.customerAddress.countryID)[0].countryName;
    this.stateName = this.states.filter(state => state.stateID == this.customerAddress.stateID)[0].stateName;
    this.cityName = this.cities.filter(city => city.cityID == this.customerAddress.cityID)[0].cityName;

    this.address = this.customerAddress.streetName + ',' + this.customerAddress.streetNumber +','+ this.customerAddress.addressZip + ','+ this.cityName+' , ' + this.stateName+ ' , ' + this.countryName;
     if ($('#map-div').is(':visible')) {
      $('#map-div').hide('slow');
    } else {
      $('#map-div').show('slow');
    }

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [this.lng , this.lat],
      accessToken: environment.mapBox.accessToken,


    });
    //Get address from controls
    // const address = '7725 48 St SE, Calgary, AB T2C 2V3, Canada';
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
        console.log('old longitude', this.lng);
        console.log('old latitude', this.lat);
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
          console.log('new longitude',this.lng);
          console.log('new latitude',this.lat);
        });
      });
  }

  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  getStates(){
    this.apiService.getData('states/country/' + this.customerAddress.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(){
    this.apiService.getData('cities/state/' + this.customerAddress.stateID)
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


  addCustomer() {
    this.errors= {};
    this.hasError = false;
    this.hasSuccess = false;

    const dataCustomer = {
      name: this.name,
      phone: this.phone,
      fax: this.fax,
      email: this.email,
      taxID: this.taxID,
      customerCompanyNo: this.customerCompanyNo,
      customerAddress:{
        streetNumber: this.customerAddress.streetNumber,
        streetName: this.customerAddress.streetName,
        cityID: this.customerAddress.cityID,
        stateID: this.customerAddress.stateID,
        countryID: this.customerAddress.countryID,
        addressZip : this.customerAddress.addressZip,
        geoLocation: {
          latitude: this.lat,
          longitude: this.lng,
        }
      }
    };
    console.log('Customer Data',dataCustomer);

    this.apiService.postData('customers', dataCustomer).
    subscribe({
      complete : () => {},
      error : (err) =>  {
        from(err.error)
          .pipe(
            map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/'([^']+)'/)[1];
                 val.message = val.message.replace(/'.*'/, 'This Field');
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
        this.Success = 'Customer Added successfully';
        this.name = '';
        this.phone = '';
        this.fax = '';
        this.email = '';
        this.taxID = '';
        this.customerCompanyNo = '';
        this.customerAddress.streetNumber = '';
        this.customerAddress.streetName = '';
        this.customerAddress.cityID = '';
        this.customerAddress.stateID = '';
        this.customerAddress.countryID = '';
        this.customerAddress.addressZip = '';
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

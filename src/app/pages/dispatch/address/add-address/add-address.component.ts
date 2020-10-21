import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import { MapBoxService } from '../../../../services';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxClient from '@mapbox/mapbox-sdk';
import * as mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit, AfterViewInit {

  title = 'Add Address';
  errors = {};
  form;
  concatArrayKeys = '';


  /********** Form Fields ***********/
  addressType = '';
  streetNumber = '';
  streetName = '';
  cityID = '';
  stateID = '';
  countryID = '';
  addressZip = '';
  geoLocation = {
    latitude: '',
    longitude: '',
  };
   countries = [];
  states = [];
  cities = [];
  coordinates = [];
  response = '';
  hasError  = false;
  hasSuccess = false;
  Error = '';
  Success = '';


  // MAP BOX Integration
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v9';
  lng = -104.618896;
  lat = 50.445210;
  mapboxDraw: MapboxDraw;

  address = '';
  countryName = '';
  cityName = '';
  stateName = '';
  constructor(private apiService: ApiService,
              private mapBoxService : MapBoxService) {}


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
    this.countryName = this.countries.filter(country => country.countryID === this.countryID)[0].countryName;
    this.stateName = this.states.filter(state => state.stateID === this.stateID)[0].stateName;
    this.cityName = this.cities.filter(city => city.cityID === this.cityID)[0].cityName;

    this.address = this.streetName + ',' + this.streetNumber + ',' + this.addressZip + ',' + this.cityName +' , ' + this.stateName + ' , ' + this.countryName;
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

         let marker = new mapboxgl.Marker({
          draggable: true
        })
          .setLngLat(match.features[0].geometry.coordinates)
          .addTo(this.map);
        this.map.flyTo({
          center: match.features[0].geometry.coordinates,
          zoom: 12

        });
        marker.on('dragend', () => {
          let lngLat = marker.getLngLat();
          this.lat = lngLat.lat;
          this.lng = lngLat.lng;
          console.log('new longitude',this.lng);
          console.log('new latitude',this.lat);
        });
      });
  }

  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  getStates() {
    this.apiService.getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities() {
    this.apiService.getData('cities/state/' + this.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  fetchCities() {
    this.apiService.getData('cities')
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  addAddress() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    const dataAddress ={
      addressType: this.addressType,
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

    console.log('Address Data', dataAddress);
    this.apiService.postData('addresses', dataAddress).
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
            error: () => {},
            next: () => {}
          });
        },
      next: (res: any) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Address Added successfully'
        this.addressType = '';
        this.streetNumber = '';
        this.streetName = '';
        this.cityID = '';
        this.stateID = '';
        this.countryID = '';
        this.addressZip = '';
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

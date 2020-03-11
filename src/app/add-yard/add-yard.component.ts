import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-yard',
  templateUrl: './add-yard.component.html',
  styleUrls: ['./add-yard.component.css']
})
export class AddYardComponent implements OnInit {

  title = 'Add Yard';

  /********** Form Fields ***********/

  geoLocationLat = '';
  geoLocationLong = '';
  geofence = '';
  addressID = '';
  timeZone = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addDocument() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "geolocation": {
        'lat' : this.geoLocationLat,
        'long' : this.geoLocationLong

      },
      "geofence": this.geofence,
      "addressID":  this.addressID,
      "timeZone": this.timeZone

    };


    this.apiService.postData('yards', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Yard Added successfully';
        this.geoLocationLat = '';
        this.geoLocationLong = '';
        this.geofence = '';
        this.addressID = '';
        this.timeZone = '';

      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {

  title = 'Add Address';

  /********** Form Fields ***********/

  parent = '';
  documentID = '';
  stNo = '';
  stName = '';
  city = '';
  state = '';
  zipCode = '';
  country = '';
  geoLocationLat = '';
  geoLocationLong = '';
  addressType = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addAddress() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "parent": this.parent,
      "documentID": this.documentID,
      "stNo": this.stNo,
      "stName": this.stNo,
      "city": this.stNo,
      "state": this.stNo,
      "zipCode": this.stNo,
      "country": this.country,
      "geoLocation": {
        "lat": this.geoLocationLat,
        "long": this.geoLocationLong
      },
      "addressType": this.addressType
    };


    this.apiService.postData('addresses', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Address Added successfully';
        this.parent = '';
        this.documentID = '';
        this.stNo = '';
        this.stName = '';
        this.city = '';
        this.state = '';
        this.zipCode = '';
        this.country = '';
        this.geoLocationLat = '';
        this.geoLocationLong = '';
        this.addressType = '';
      }
    });
  }
}

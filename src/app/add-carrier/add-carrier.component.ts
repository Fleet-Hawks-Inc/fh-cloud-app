import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-carrier',
  templateUrl: './add-carrier.component.html',
  styleUrls: ['./add-carrier.component.css']
})
export class AddCarrierComponent implements OnInit {

  title = 'Add Carrier';

  /********** Form Fields ***********/

  carrierName = '';
  addressID = '';
  taxID = '';
  state = '';
  locale = '';
  distanceUnit = '';
  weightUnit = '';
  tempUnit = '';
  HA = '';
  HB = '';
  logTime = '';
  superUserName = '';
  currentStatus = '';
  carrierNumber = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addCarrier() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "carrierName": this.carrierName,
      "addressID": this.addressID,
      "taxID": this.taxID,
      "state": this.state,
      "settings": {
        "locale": this.locale,
        "distanceUnit": this.distanceUnit,
        "weightUnit": this.weightUnit,
        "tempUnit": this.tempUnit,
        "HA": this.HA,
        "HB": this.HB,
        "logTime": this.logTime
      },
      "superUserName": this.superUserName,
      "currentStatus": this.currentStatus,
      "carrierNumber": this.carrierNumber,
    };


    this.apiService.postData('carriers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Carrier Added successfully';
        this.carrierName = '';
        this.addressID = '';
        this.taxID = '';
        this.state = '';
        this.locale = '';
        this.distanceUnit = '';
        this.weightUnit = '';
        this.tempUnit = '';
        this.HA = '';
        this.HB = '';
        this.logTime = '';
        this.superUserName = '';
        this.currentStatus = '';
        this.carrierNumber = '';
      }
    });
  }
}

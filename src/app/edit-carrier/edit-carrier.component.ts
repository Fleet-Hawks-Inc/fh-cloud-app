import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-carrier',
  templateUrl: './edit-carrier.component.html',
  styleUrls: ['./edit-carrier.component.css']
})
export class EditCarrierComponent implements OnInit {
  title = 'Edit Carrier';

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

  carrierID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.carrierID = this.route.snapshot.params['carrierID'];
    this.apiService.getData('carriers/' + this.carrierID)
        .subscribe((result: any) => {
          result = result.Items[0];
          console.log(result);

          this.carrierID = result.carrierID;
          this.carrierName = result.carrierName;
          this.addressID = result.addressID;
          this.taxID = result.taxID;
          this.state = result.state;
          this.locale = result.settings.locale;
          this.distanceUnit = result.settings.distanceUnit;
          this.weightUnit = result.settings.weightUnit;
          this.tempUnit = result.settings.tempUnit;
          this.HA = result.settings.HA;
          this.HB = result.settings.HB;
          this.logTime = result.settings.logTime;
          this.superUserName = result.superUserName;
          this.currentStatus = result.currentStatus;
          this.carrierNumber = result.carrierNumber;



        });

  }




  updateCarrier() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "carrierID": this.carrierID,
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
      "carrierNumber": this.carrierNumber


    };

    this.apiService.putData('carriers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Carrier Updated successfully';

      }
    });
  }
}

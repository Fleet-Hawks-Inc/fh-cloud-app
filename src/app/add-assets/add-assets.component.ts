import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css']
})
export class AddAssetsComponent implements OnInit {
  title = 'Add Assets';

  /********** Form Fields ***********/
  VTN = '';
  type = '';
  year = '';
  make = '';
  model = '';
  length = '';
  axle = '';
  GVWR = '';
  GAWR = '';
  state = '';
  plateNumber = '';
  ownership = '';
  remarks = '';
  state2 = '';
  UID = '';
  status = 'Active';
  currentStatus = '';
  quantum = '';
  quantumSelected = '';
  quantumStatus = '';

  carrierID = 'defualt';
  vehicleID = 'default';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {
    console.log(this.apiService.jwtDecoded);
    this.carrierID = this.apiService.jwtDecoded.carrierID;
  }

  quantumModal() {
    $( document ).ready(function() {
      $('#modalAnim').modal('show');
    });

  }

  onChange(newValue) {
    this.quantum = newValue;
    this.UID = newValue;
  }


  addAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "VTN": this.VTN,
      "type": this.type,
      "assetInfo": {
        "year": this.year,
        "make": this.make,
        "model": this.model
      },
      "length": this.length,
      "axle": this.axle,
      "GVWR": this.GVWR,
      "GAWR": this.GAWR,
      "license": {
        "state": this.state,
        "plateNumber": this.plateNumber
      },
      "ownership": this.ownership,
      "remarks": this.remarks,
      "state": this.state2,
      "quantumInfo": {
        "UID": this.UID,
        "status": this.status
      },
      "carrierID": this.carrierID,
      "vehicleID": this.vehicleID,
      "currentStatus": this.currentStatus

    };


    this.apiService.postData('assets', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Asset Added successfully';

        this.VTN = '';
        this.type = '';
        this.year = '';
        this.make = '';
        this.model = '';
        this.length = '';
        this.axle = '';
        this.GVWR = '';
        this.GAWR = '';
        this.state = '';
        this.plateNumber = '';
        this.ownership = '';
        this.remarks = '';
        this.state2 = '';
        this.UID = '';
        this.currentStatus = '';

      }
    });
  }


}

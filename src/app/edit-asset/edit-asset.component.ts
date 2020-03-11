import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute, Router} from "@angular/router";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.css']
})
export class EditAssetComponent implements OnInit {
  title = 'Edit Assets';

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
  assetId = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.assetId = this.route.snapshot.params['assetId'];

    this.apiService.getData('assets/' + this.assetId)
        .subscribe((result: any) => {
          //console.log(result);
          result = result.Items[0];
          this.VTN = result.VTN;
          this.type = result.type;
          this.year = result.assetInfo.year;
          this.make = result.assetInfo.make;
          this.model = result.assetInfo.model;
          this.length = result.length;
          this.axle = result.axle;
          this.GVWR = result.GVWR;
          this.GAWR = result.GAWR;
          this.state = result.license.state;
          this.plateNumber = result.license.plateNumber;
          this.ownership = result.ownership;
          this.remarks = result.remarks;
          this.state2 = result.state;
          this.UID = result.quantumInfo.UID;
          status = 'Active';
          this.currentStatus = result.currentStatus;
        });


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






  updateAsset() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "assetID": this.assetId,
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


    this.apiService.putData('assets', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Asset Updated successfully';

      }
    });
  }



}

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


  /**
   * Form errors prop
   */
  validationErrors = {
    Assetname: {
      error: false,
    },
    VTN: {
      error: false,
    },
    type: {
      error: false,
    },
    year: {
      error: false,
    },
    make: {
      error: false,
    },
    model: {
      error: false,
    },
    length: {
      error: false,
    },
    axle: {
      error: false,
    },
    GVWR: {
      error: false,
    },
    GAWR: {
      error: false,
    },
    state: {
      error: false,
    },
    plateNumber: {
      error: false,
    },
    ownership: {
      error: false,
    },
    remarks: {
      error: false,
    },
    state2: {
      error: false,
    },
    UID: {
      error: false,
    },
    currentStatus: {
      error: false,
    },
    quantum: {
      error: false,
    },
    quantumSelected: {
      error: false,
    }
  };


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
          this.VTN = result.VIN;
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
      "VIN": this.VTN,
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
      // "carrierID": this.carrierID,
      "vehicleID": this.vehicleID,
      "currentStatus": this.currentStatus

    };


    this.apiService.putData('assets', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.mapErrors(err.error);
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



  mapErrors(errors) {
    for (var i = 0; i < errors.length; i++) {
      let key = errors[i].path;
      let length = key.length;

      //make array of message to remove the fieldName
      let message = errors[i].message.split(" ");
      delete message[0];

      //new message
      let modifiedMessage = `This field${message.join(" ")}`;

      if (length == 1) {
        //single object
        this.validationErrors[key[0]].error = true;
        this.validationErrors[key[0]].message = modifiedMessage;
      } else if (length == 2) {
        //two dimensional object
        this.validationErrors[key[0]][key[1]].error = true;
        this.validationErrors[key[0]][key[1]].message = modifiedMessage;
      }
    }
    console.log(this.validationErrors);
  }

  updateValidation(first, second = "") {
    if (second == "") {
      this.validationErrors[first].error = false;
    } else {
      this.validationErrors[first][second].error = false;
    }
  }


}

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
  Assetname = '';
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


    this.apiService.postData('assets', data).
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

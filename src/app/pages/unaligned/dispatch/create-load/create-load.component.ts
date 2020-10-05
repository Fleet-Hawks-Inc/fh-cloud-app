import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {from, of } from 'rxjs';
import {map} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: "app-create-load",
  templateUrl: "./create-load.component.html",
  styleUrls: ["./create-load.component.css"],
})
export class CreateLoadComponent implements OnInit {
  title = "Create Load";
  activeTab = "general";

  //From props
  customerID = "";
  shipperInfo = {
    shipperID: "",
    addressID: "",
  };
  receiverInfo = {
    receiverID: "",
    addressID: "",
  };
  mapAssets = {
    vehicleID: "",
    assets: [],
    drivers: [],
  };
  loadType = "";
  temperatureRequired = {
    fromTemp: "",
    fromTempScale: "",
    toTemp: "",
    toTempScale: ""
  };
  delivery = {
    date: "",
    time: "",
    estimatedLengthRequired: "",
    estimatedWeightRequired: "",
    pointOfContact: "",
    cargoValue: ""
  };
  loadDetails = [];
  dropDetails = [];

  //for dropdowns
  customers = [];
  shippers = [];
  shipperAddress = [];
  receivers = [];
  receiverAddress = [];
  drivers = [];
  vehicles = [];
  assets = [];
  selectedAssets = [];
  selectedDrivers = [];

  form;
  response : any = '';
  hasError =  false;
  hasSuccess =   false;
  Error : string = '';
  Success : string = '';
  errors = [];



  dropForm : FormGroup;
  dropRepeater = [];


  pickupForm : FormGroup;
  pickupRepeater = [];

  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder) {
                
              }

  ngOnInit() {
    this.fetchCustomers();
    this.fetchShippers();
    this.fetchReceivers();
    this.fetchDrivers();
    this.fetchVehicles();
    this.fetchAssets();

    // this.generalForm = this.formBuilder.group({
    //   dropArray: new FormArray([])
    // });



    this.dropForm = this.formBuilder.group({
      dropArray: new FormArray([])
    });

    this.pickupForm = this.formBuilder.group({
      pickupArray: new FormArray([])
    });

    this.addFields();
    this.addPickupFields();
    this.addFields();
    this.addPickupFields();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });

  }

  get pC() { return this.pickupForm.controls; }
  get pA() { return this.pC.pickupArray as FormArray; }


  get fC() { return this.dropForm.controls; }
  get fA() { return this.fC.dropArray as FormArray; }

  addFields() {
    const numberOfHosRepeater =  this.dropRepeater.length;
    this.dropRepeater.push(numberOfHosRepeater + 1);
    if (this.fA.length < numberOfHosRepeater) {
      for (let i = this.fA.length; i < numberOfHosRepeater; i++) {
        this.fA.push(this.formBuilder.group({
          refrenceNumber: ['', Validators.required],
          dropdate: ['', Validators.required],
          fromTemp: ['', Validators.required],
          toTemp: ['', Validators.required],
          deliveryDate: ['', Validators.required],
          remarks: ['', Validators.required],
        }));
      }
    }

    }


  addPickupFields() {
    const numberPickupRepeater =  this.pickupRepeater.length;
    this.pickupRepeater.push(numberPickupRepeater + 1);
    if (this.pA.length < numberPickupRepeater) {
      for (let i = this.pA.length; i < numberPickupRepeater; i++) {
        this.pA.push(this.formBuilder.group({
          refrenceNumber: ['', Validators.required],
          pickupDate: ['', Validators.required],
          remarks: ['', Validators.required]
        }));
      }
    }

  }



    submitForm() {

      if (this.dropForm.invalid) {
        alert('invalid drop form');
        return;
      }

      if (this.pickupForm.invalid) {
        alert('invalid pickup form');
        return;
      }





      const data = {
  customerID : this.customerID,
  shipperInfo : {
    shipperID: this.shipperInfo.shipperID,
    addressID: this.shipperInfo.addressID,
  },
  receiverInfo : {
    receiverID: this.receiverInfo.receiverID,
    addressID: this.receiverInfo.addressID,
  },
  mapAssets : {
    vehicleID: this.mapAssets.vehicleID,
    assets: this.selectedAssets,
    drivers: this.selectedDrivers,
  },
  loadType : this.loadType,
  temperatureRequired : {
    fromTemp: this.temperatureRequired.fromTemp,
    fromTempScale: this.temperatureRequired.fromTempScale,
    toTemp: this.temperatureRequired.toTemp,
    toTempScale: this.temperatureRequired.toTempScale
  },
  delivery : {
    date: this.delivery.date,
    time: this.delivery.time,
    estimatedLengthRequired: this.delivery.estimatedLengthRequired,
    estimatedWeightRequired: this.delivery.estimatedWeightRequired,
    pointOfContact: this.delivery.pointOfContact,
    cargoValue: this.delivery.cargoValue
  },
  pickUpDetails : [JSON.stringify(this.dropForm.value)],
  dropDetails : [JSON.stringify(this.dropForm.value)]
}
console.log(data);

this.apiService.postData('loads', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
                const path = val.path;
                // We Can Use This Method
                const key = val.message.match(/"([^']+)"/)[1];
                 val.message = val.message.replace(/".*"/, 'This Field');
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
        this.Success = 'Load Added successfully';
        
      }
    });








      // alert( JSON.stringify(this.dropForm.value, null, 5) + JSON.stringify(this.pickupForm.value, null, 5));
    }


    throwErrors() {
      this.form.showErrors(this.errors);
    }
  


  fetchVehicles() {
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchAssets() {
    this.apiService.getData("assets").subscribe((result: any) => {
      this.assets = result.Items;
    });
  }

  assetChange(val) {
    let arr = val.split(",");

    //check if its already seleceted
    let isSelected = this.selectedAssets.filter(
      (asset) => asset.assetID == arr[0]
    );
    if (isSelected.length > 0) {
      alert("Already selected");
      return false;
    }

    this.selectedAssets.push({
      assetID: arr[0],
      assetName: arr[1],
    });
  }

  removeAsset(assetID) {
    const index = this.selectedAssets.findIndex(
      (asset) => asset.assetID == assetID
    );
    this.selectedAssets.splice(index, 1);
  }

  driverChange(val) {
    if(this.selectedDrivers.length == 2){alert('More than 2 drivers are not allowed.'); return false;}
    let arr = val.split(",");
    console.log(val);
    //check if its already seleceted
    let isSelected = this.selectedDrivers.filter(
      (driver) => driver.userName == arr[0]
    );
    if (isSelected.length > 0) {
      alert("Already selected");
      return false;
    }

    this.selectedDrivers.push({
      userName: arr[0],
      driverName: arr[1],
    });
  }

  removeDriver(userName) {
    const index = this.selectedDrivers.findIndex(
      (driver) => driver.userName == userName
    );
    this.selectedDrivers.splice(index, 1);
  }

  fetchCustomers() {
    this.apiService.getData("customers").subscribe((result: any) => {
      this.customers = result.Items;
    });
  }

  fetchShippers() {
    this.apiService.getData("shippers").subscribe((result: any) => {
      this.shippers = result.Items;
    });
  }

  fetchReceivers() {
    this.apiService.getData("receivers").subscribe((result: any) => {
      this.receivers = result.Items;
    });
  }

  fetchDrivers() {
    this.apiService
      .getData("users/userType/driver")
      .subscribe((result: any) => {
        this.drivers = result.Items;
      });
  }

  getShipperAddress() {
    this.apiService
      .getData(`addresses/document/${this.shipperInfo.shipperID}`)
      .subscribe((result: any) => {
        this.shipperAddress = result.Items;
      });
  }

  getReceiverAddress() {
    this.apiService
      .getData(`addresses/document/${this.receiverInfo.receiverID}`)
      .subscribe((result: any) => {
        this.receiverAddress = result.Items;
      });
  }

  general() {
    this.activeTab = "general";
    $("#general").show();
    $("#pickUp, #drop").hide();
  }

  pickUp() {
    this.activeTab = "pickUp";
    $("#pickUp").show();
    $("#general, #drop").hide();
  }

  drop() {
    this.activeTab = "drop";
    $("#drop").show();
    $("#general, #pickUp").hide();
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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


  hosForm : FormGroup;
  hosRepeater = [];


  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.fetchCustomers();
    this.fetchShippers();
    this.fetchReceivers();
    this.fetchDrivers();
    this.fetchVehicles();
    this.fetchAssets();


    this.hosForm = this.formBuilder.group({
      formArrays: new FormArray([])
    });

    this.addFields();

  }

  get fC() { return this.hosForm.controls; }
  get fA() { return this.fC.formArrays as FormArray; }

  addFields() {
    const numberOfHosRepeater =  this.hosRepeater.length;
    this.hosRepeater.push(numberOfHosRepeater + 1);
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


    submitForm() {

      // if (this.hosForm.invalid) {
      //   return;
      // }

      alert( JSON.stringify(this.hosForm.value,null, 5));
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

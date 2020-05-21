import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { Object } from "aws-sdk/clients/s3";
declare var $: any;

@Component({
  selector: 'app-create-load',
  templateUrl: './create-load.component.html',
  styleUrls: ['./create-load.component.css']
})
export class CreateLoadComponent implements OnInit {
  title = "Create Load";
  activeTab = "general";

  //From props
  customerID = "";
  shipperInfo = {
    shipperID: "",
    addressID: ""
  };
  receiverInfo = {
    receiverID: "",
    addressID: ""
  };
  mapAssets: {
    vehicleID: "",
    assets: [],
    drivers: []
  };
  loadType: "";
  remperatureRequired : {
    fromTemp: "",
    toTemp: ""
  };
  deliveryTime: {
    date: "",
    time: "",
    estimatedLengthRequired: "",
    estimatedWeightRequired: "",
    pointOfContact: "",
    cargoValue: ""
  }
  loadDetails: [];
  dropDetails: [];




  //for dropdowns
  customers = [];
  shippers = [];
  shipperAddress = [];
  receivers = [];
  receiverAddress = [];
  drivers = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchCustomers();
    this.fetchShippers();
    this.fetchReceivers();
    this.fetchDrivers();
  }

  fetchCustomers(){
    this.apiService.getData('customers')
    .subscribe((result: any) => {
      this.customers = result.Items;
    });
  }

  fetchShippers(){
    this.apiService.getData('shippers')
    .subscribe((result: any) => {
      this.shippers = result.Items;
    });
  }

  fetchReceivers(){
    this.apiService.getData('receivers')
    .subscribe((result: any) => {
      this.receivers = result.Items;
    });
  }

  fetchDrivers(){
    this.apiService.getData('users/userType/driver')
      .subscribe((result: any) => {
        this.drivers = result.Items;
      });
  }

  getShipperAddress(){
    this.apiService.getData(`addresses/document/${this.shipperInfo.shipperID}`)
      .subscribe((result: any) => {
        this.shipperAddress = result.Items;
      });
  }

  getReceiverAddress(){
    this.apiService.getData(`addresses/document/${this.receiverInfo.receiverID}`)
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

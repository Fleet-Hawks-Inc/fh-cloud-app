import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-quantum',
  templateUrl: './add-quantum.component.html',
  styleUrls: ['./add-quantum.component.css']
})
export class AddQuantumComponent implements OnInit {
  parentTitle = 'Quantums';
  title = 'Add Quantum';

  /********** Form Fields ***********/
  serialNo = '';
  macId = '';
  status = '';
  year = '';
  model = '';
  carrierID = '';
  simSerial = '';
  phoneNumber = '';
  serviceProvider = '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  addQuantum() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "userName" : "test",
      "password": "12345678",
      "address": "ludhiana",
      "phone": "9876543210",
      "carrierID": "kodebuilders",
      "firstName": "Amritpal",
      "lastName": "Singh",
      "email": "amrit@fleethawks.com",
      "userType": "ADMIN",
      "currentStatus": "ENABLED",
      "userPrivileges": {
        "apiKeys": "FULL",
        "users": "FULL"
      }
    };



    this.apiService.postData('quantums', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Quantum Added successfully';

        // this.vehicleID = '';
        // this.vin = '';
        // this.year = '';
        // this.make = '';
        // this.model = '';
        // this.fuelType = '';
        // this.state = '';
        // this.plateNumber = '';
        // this.inspectionFormID = '';
        // this.UID = '';
        // this.status = 'Active';
        // this.driverUserName = '';
        // this.currentStatus = 'Active';
        // this.companyID = '';
        // this.lastServiceTime = '';
        // this.quantum = '';
        // this.quantumSelected = '';



      }
    });
  }
}

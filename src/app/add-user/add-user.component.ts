import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  parentTitle = 'Users';
  title = 'Add User';

  /********** Form Fields ***********/
  userName = '';
  password = '';
  address = '';
  phone = '';
  model = '';
  carrierID = '';
  firstName = '';
  lastName = '';
  email = '';
  userType = '';
  currentStatus = '';
  streetName = '';
  city = '';
  state = '';
  zipCode = '';
  Country = '';



  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  addUser() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "userName" : this.userName,
      "password": this.password,
      "address": this.address,
      "phone":this.phone,
      "carrierID": "kodebuilders",
      "firstName": this.firstName,
      "lastName":this.lastName,
      "email": this.email,
      "userType": this.userType,
      "currentStatus": "ENABLED",
      "userPrivileges": {
        "apiKeys": "FULL",
        "users": "FULL"
      }
    };



    this.apiService.postData('users', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'User Added successfully';

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

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
  city = '';
  state = '';
  zipCode = '';
  phone = '';
  model = '';
  carrierID = '';
  firstName = '';
  lastName = '';
  email = '';
  userType = '';
  currentStatus = '';
  streetName = '';
  Country = '';
  status = '';



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
      "address": this.streetName + ' ,' + this.city + ' ,' + this.zipCode ,
      "phone":this.phone,
      "carrierID": "fleethawks",
      "firstName": this.firstName,
      "lastName":this.lastName,
      "email": this.email,
      "userType": this.userType,
      "currentStatus": this.status,
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

        this.userName = '';
        this.password = '';
        this.address = '';
        this.city = '';
        this.state = '';
        this.zipCode = '';
        this.phone = '';
        this.model = '';
        this.carrierID = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.userType = '';
        this.currentStatus = '';
        this.streetName = '';
        this.Country = '';
        this.status = 'Active';



      }
    });
  }

}

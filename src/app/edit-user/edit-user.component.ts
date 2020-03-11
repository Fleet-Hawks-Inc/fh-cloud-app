import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  title = 'Edit Users';

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


  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.userName = this.route.snapshot.params['userId'];

    this.apiService.getData('users/' + this.userName)
        .subscribe((result: any) => {
          result = result.Items[0];
          this.address = result.address;
          this.phone = result.phone;
          this.carrierID = result;
          this.firstName = result.firstName;
          this.lastName = result.lastName;
          this.email = result.email;
          this.userType = result.userType;
          this.status = result.currentStatus;

        });

  }




  updateUser() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "userName" : this.userName,
      "address": this.address,
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

    this.apiService.putData('users/' + this.userName, data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'User Updated successfully';

      }
    });
  }




}

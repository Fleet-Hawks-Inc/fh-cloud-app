import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-shipper',
  templateUrl: './add-shipper.component.html',
  styleUrls: ['./add-shipper.component.css']
})
export class AddShipperComponent implements OnInit {
  title = 'Add Shipper';

  /********** Form Fields ***********/
  shipperName = '';
  address = '';
  phone = '';
  email = '';
  taxID = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}



  addShipper() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "shipperName": this.shipperName,
      "address": this.address,
      "phone": this.phone,
      "email": this.email,
      "taxID": this.taxID
    };

    this.apiService.postData('shippers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Shipper Added successfully';

        this.shipperName = '';
        this.address = '';
        this.phone = '';
        this.email = '';
        this.taxID = '';

      }
    });
  }

}

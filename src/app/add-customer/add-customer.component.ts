import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  title = 'Add Customer';

  /********** Form Fields ***********/

  name = '';
  address = '';
  phone = '';
  fax = '';
  email = '';
  taxID = '';
  customerCompanyNo: '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addCustomer() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "name": this.name,
      "address": this.address,
      "phone": this.phone,
      "fax": this.fax,
      "email": this.email,
      "taxID": this.taxID,
      "customerCompanyNo": this.customerCompanyNo,
    };


    this.apiService.postData('customers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Customer Added successfully';
        this.name = '';
        this.address = '';
        this.phone = '';
        this.fax = '';
        this.email = '';
        this.taxID = '';
        this.customerCompanyNo = '';
      }
    });
  }
}

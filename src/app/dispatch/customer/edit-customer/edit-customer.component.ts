import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import { from, of } from "rxjs";
import {map} from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  title = 'Edit Customer';
  errors = {};
  form;
  concatArrayKeys = '';


  /********** Form Fields ***********/
  customerID = "";
  customerName = "";
  customerCompanyNo = "";
  phone = "";
  email = "";
  fax = "";
  taxID = "";
  response : any ="";
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = "";
  Success : string = "";



  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.customerID = this.route.snapshot.params['customerID'];
    this.fetchCustomer();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });

  }
 

  fetchCustomer()
  {
    this.apiService.getData('customers/' + this.customerID)
    .subscribe((result: any) => {
      result = result.Items[0];

      this.customerName = result.name;
      this.phone = result.phone;
      this.fax = result.fax;
      this.email = result.email;
      this.taxID = result.taxID;
      this.customerCompanyNo = result.customerCompanyNo;
    });
  }


  updateCustomer() {
    this.errors= {};
    this.hasError = false;
    this.hasSuccess = false;

    const dataCustomer = {
      name: this.customerName,
      phone: this.phone,
      fax: this.fax,
      email: this.email,
      taxID: this.taxID,
      customerCompanyNo: this.customerCompanyNo,
    };
 
    console.log("Customer Data",dataCustomer);

    this.apiService.putData('customers', dataCustomer).
    subscribe({
      complete : () => {},
      error : (err) =>  {
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
        this.Success = 'Customer Updated successfully';
        this.customerName = '';
        this.phone = '';
        this.fax = '';
        this.email = '';
        this.taxID = '';
        this.customerCompanyNo = '';
      }
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

  concatArray(path) {
    this.concatArrayKeys = '';
    for (const i in path) {
        this.concatArrayKeys += path[i] + '.';
    }
    this.concatArrayKeys = this.concatArrayKeys.substring(0, this.concatArrayKeys.length - 1);
    return this.concatArrayKeys;
  }
}

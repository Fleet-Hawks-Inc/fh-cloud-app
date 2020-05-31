import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-shipper',
  templateUrl: './edit-shipper.component.html',
  styleUrls: ['./edit-shipper.component.css']
})
export class EditShipperComponent implements OnInit {
  title = 'Edit Shipper';

  /********** Form Fields ***********/
  shipperName = '';
  address = '';
  phone = '';
  email = '';
  taxID = '';
  /******************/

  shipperID = '';

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.shipperID = this.route.snapshot.params['shipperId'];

    this.apiService.getData('shippers/' + this.shipperID)
        .subscribe((result: any) => {
          //console.log(result);
          result = result.Items[0];
          this.shipperName = result.shipperName;
          this.address =  result.address;
          this.phone =  result.phone;
          this.email =  result.email;
          this.taxID = result.taxID;

        });
  }

  updateShipper() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "shipperID": this.shipperID,
      "shipperName": this.shipperName,
      "address": this.address,
      "phone": this.phone,
      "email": this.email,
      "taxID": this.taxID
    };


    this.apiService.putData('shippers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Shipper Updated successfully';

      }
    });
  }

}

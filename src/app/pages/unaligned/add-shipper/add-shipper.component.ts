import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
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


  response = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  constructor(private apiService: ApiService
             ) {}

  ngOnInit() {}



  addShipper() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'shipperName': this.shipperName,
      'address': this.address,
      'phone': this.phone,
      'email': this.email,
      'taxID': this.taxID
    };

    this.apiService.postData('shippers', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res: any) => {
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

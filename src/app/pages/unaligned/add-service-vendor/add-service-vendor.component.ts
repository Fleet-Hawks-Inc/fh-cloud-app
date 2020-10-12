import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-service-vendor',
  templateUrl: './add-service-vendor.component.html',
  styleUrls: ['./add-service-vendor.component.css']
})
export class AddServiceVendorComponent implements OnInit {

  title = 'Add Service Vendor';

  /********** Form Fields ***********/
  vendorName = '';
  lat = '';
  long = '';
  address = '';
  carrierID = '';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {
    this.carrierID = this.apiService.jwtDecoded.carrierID;
  }



  addServiceVendor() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'vendorName': this.vendorName,
      'geoLocation': {
        'lat': this.lat,
        'long': this.long
      },
      'address': this.address,
      'carrierID': this.carrierID
    };

    this.apiService.postData('serviceVendors', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Service Vendor Added successfully';

        this.vendorName = '';
        this.lat = '';
        this.long = '';
        this.address = '';

      }
    });
  }


}

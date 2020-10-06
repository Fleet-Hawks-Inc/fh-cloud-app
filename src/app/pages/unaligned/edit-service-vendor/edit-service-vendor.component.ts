import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-service-vendor',
  templateUrl: './edit-service-vendor.component.html',
  styleUrls: ['./edit-service-vendor.component.css']
})
export class EditServiceVendorComponent implements OnInit {

  title = 'Edit Service Vendor';

  /********** Form Fields ***********/
  vendorName = '';
  lat = '';
  long = '';
  address = '';
  carrierID = '';
  /******************/

  serviceVendorId = '';

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.carrierID = this.apiService.jwtDecoded.carrierID;

    this.serviceVendorId = this.route.snapshot.params['serviceVendorId'];

    this.apiService.getData('serviceVendors/' + this.serviceVendorId)
        .subscribe((result: any) => {
          //console.log(result);
          result = result.Items[0];
          this.vendorName = result.vendorName;
          this.lat =  result.geoLocation.lat;
          this.long =  result.geoLocation.long;
          this.address =  result.address;
        });
  }

  updateServiceVendor() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'vendorID': this.serviceVendorId,
      'vendorName': this.vendorName,
      'geoLocation': {
        'lat': this.lat,
        'long': this.long
      },
      'address': this.address,
      'carrierID': this.carrierID
    };


    this.apiService.putData('serviceVendors', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Service Vendor updated successfully';

      }
    });
  }

}

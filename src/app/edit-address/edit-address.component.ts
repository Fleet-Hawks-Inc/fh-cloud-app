import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  title = 'Edit Address';

  /********** Form Fields ***********/

  parent = '';
  documentID = '';
  stNo = '';
  stName = '';
  city = '';
  state = '';
  zipCode = '';
  country = '';
  geoLocationLat = '';
  geoLocationLong = '';
  addressType = '';
  /******************/

  addressID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.addressID = this.route.snapshot.params['addressID'];

    this.apiService.getData('addresses/' + this.addressID)
        .subscribe((result: any) => {
          result = result.Items[0];

          this.parent = result.parent;
          this.documentID = result.documentID;
          this.stNo = result.stNo;
          this.stName = result.stName;
          this.city = result.city;
          this.state = result.state;
          this.zipCode = result.zipCode;
          this.country = result.country;
          this.geoLocationLat = result.geoLocation.lat;
          this.geoLocationLong = result.geoLocation.long;
          this.addressType = result.addressType;
        });

  }




  updateAddress() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
        "addressID": this.addressID,
        "parent" : this.parent,
        "documentID" : this.documentID,
        "stNo" : this.stNo,
        "stName" : this.stName,
        "city" : this.city,
        "state" : this.state,
        "zipCode" : this.zipCode,
        "country" : this.country,
        "geoLocation" : {
          "lat": this.geoLocationLat,
          "long": this.geoLocationLong
        },
        "addressType" : this.addressType
    };

    this.apiService.putData('addresses', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Address Updated successfully';

      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import { from, of } from "rxjs";
import { map } from "rxjs/operators";
import { MapBoxService } from "../../../map-box.service";
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxClient from '@mapbox/mapbox-sdk';
import * as mapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as Geocoder from "@mapbox/mapbox-gl-geocoder";
import { center } from '@turf/turf';

declare var $: any;

@Component({
  selector: 'app-edit-shipper',
  templateUrl: './edit-shipper.component.html',
  styleUrls: ['./edit-shipper.component.css']
})
export class EditShipperComponent implements OnInit {
  title = 'Edit Shipper';
  errors = {};
  form;
  concatArrayKeys = '';

  /********** Form Fields ***********/
  shipperID = "";
  shipperName = "";
  phone = "";
  email = "";
  fax = "";
  taxID = "";

  response : any ="";
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = "";
  Success : string = "";


  constructor(private apiService: ApiService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.shipperID = this.route.snapshot.params['shipperID'];
    this.fetchShipper();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    }); 
  }
    fetchShipper(){
    this.apiService.getData('shippers/' + this.shipperID)
    .subscribe((result: any) => {
      //console.log(result);
      result = result.Items[0];
      this.shipperName = result.shipperName;
      this.phone =  result.phone;
      this.email =  result.email;
      this.fax = result.fax;
      this.taxID = result.taxID;
    });
  }
  
  updateShipper() {
    this.errors = {};

    this.hasError = false;
    this.hasSuccess = false;

    const dataShipper = {
      shipperID: this.shipperID,
      shipperName: this.shipperName,
      phone: this.phone,
      email: this.email,
      fax : this.fax,
      taxID: this.taxID,
     
    };


    console.log("Shipper Data",dataShipper); 


     this.apiService.putData('shippers', dataShipper).
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
            error: () => {},
            next: () => {}
          });
        },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Shipper Updated successfully';

        this.shipperName = "";
        this.phone = "";
        this.email = "";
        this.fax = "";
        this.taxID = "";
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

import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-shipper-address-list',
  templateUrl: './shipper-address-list.component.html',
  styleUrls: ['./shipper-address-list.component.css']
})
export class ShipperAddressListComponent implements OnInit {

  title = "Address List";
  addresses = [];
  shippers = [];
  shipperID = "";
  countries = [];
  states = [];
  cities = [];
  countryName = "";
  cityName = "";
  stateName = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchShippers();
    this.getAddress();
    this.fetchCountries();
  }
  fetchCountries(){
      this.apiService.getData('countries')
        .subscribe((result: any) => {
          this.countries = result.Items;
        });
    }
    getStates(){
      this.apiService.getData('states/country/' + this.addresses[0].countryID)
        .subscribe((result: any) => {
          this.states = result.Items;
          this.countryName = this.countries.filter(country => country.countryID == this.addresses[0].countryID)[0].countryName;
         this.stateName = this.states.filter(state => state.stateID == this.addresses[0].stateID)[0].stateName;
        });
    }
  
    getCities(){
      this.apiService.getData('cities/state/' + this.addresses[0].stateID)
        .subscribe((result: any) => {
          this.cities = result.Items;
          this.cityName = this.cities.filter(city => city.cityID == this.addresses[0].cityID)[0].cityName;
        });
   }

  fetchShippers() {
    this.apiService.getData("shippers").subscribe((result: any) => {
      this.shippers = result.Items;
    });
  }

  getAddress() {
    this.apiService.getData(`addresses/document/${this.shipperID}`)
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            this.addresses = result.Items;
            this.getStates();
            this.getCities();
          },
        });
        // this.getStates();
        // this.getCities();
  }

  deleteAddress(addressID) {

             /******** Clear DataTable ************/
             if ($.fn.DataTable.isDataTable('#datatable-default')) {
              $('#datatable-default').DataTable().clear().destroy();
              }
              /******************************/

    this.apiService.deleteData('addresses/' + addressID)
        .subscribe((result: any) => {
          this.getAddress();
        })
  }
  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-customer-address-list',
  templateUrl: './customer-address-list.component.html',
  styleUrls: ['./customer-address-list.component.css']
})
export class CustomerAddressListComponent implements OnInit {

  title = "Address List";
  addresses = [];
  customers = [];
  customerID = "";
  countryID = "";
  countries = [];
  states = [];
  cities = [];
  countryName = "";
  cityName = "";
  stateName = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchcustomers();
    this.fetchCountries();
  }
  fetchCountries(){
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  fetchcustomers() {
    this.apiService.getData("customers").subscribe((result: any) => {
      this.customers = result.Items;
    });
    //console.log(this.drivers);
  }

  getAddress() {
    this.apiService.getData(`addresses/document/${this.customerID}`)
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log("Result of fetching data after button click",result);
            this.addresses = result.Items;
            // this.countryID = this.addresses[0].countryID;
            this.getStates();
            this.getCities();
          },
        });
        // this.getStates();
        // this.getCities();
  }
  getStates(){
    this.apiService.getData('states/country/' +this.addresses[0].countryID)
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

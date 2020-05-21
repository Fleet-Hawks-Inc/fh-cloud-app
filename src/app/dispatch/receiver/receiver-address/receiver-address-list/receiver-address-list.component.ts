import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-receiver-address-list',
  templateUrl: './receiver-address-list.component.html',
  styleUrls: ['./receiver-address-list.component.css']
})
export class ReceiverAddressListComponent implements OnInit {

  title = "Address List";
  addresses = [];
  receivers = [];
  receiverID = "";
  countries = [];
  states = [];
  cities = [];
  countryName = "";
  cityName = "";
  stateName = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchreceivers();
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
  fetchreceivers() {
    this.apiService.getData("receivers").subscribe((result: any) => {
      this.receivers = result.Items;
    });
    //console.log(this.drivers);
  }

  getAddress() {
    this.apiService.getData(`addresses/document/${this.receiverID}`)
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log(result);
            this.addresses = result.Items;
            this.getStates();
            this.getCities();
          },
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

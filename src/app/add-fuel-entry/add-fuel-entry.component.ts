import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-fuel-entry',
  templateUrl: './add-fuel-entry.component.html',
  styleUrls: ['./add-fuel-entry.component.css']
})
export class AddFuelEntryComponent implements OnInit {
  title = 'Add Fuel Entry';

  /********** Form Fields ***********/

  date = '';
  odometer = '';
  price = '';
  volume = '';
  fuelType = '';
  location = '';
  venderName = '';
  expenseID = '';
  tripID = '';
  vehicleID = '';

  carrierID = 'defualt';


  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}


  addFuelEntry() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "vehicleID": this.vehicleID,
      "date": this.date,
      "odometer": this.odometer,
      "price": this.price,
      "volume": this.volume,
      "fuelType": this.fuelType,
      "location": this.location,
      "venderName": this.venderName,
      "carrierID": this.carrierID,
      "expenseID": this.expenseID,
      "tripID": this.tripID
    };


    this.apiService.postData('fuelEntries', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Fuel Entry Added successfully';

        this.date = '';
        this.odometer = '';
        this.price = '';
        this.volume = '';
        this.fuelType = '';
        this.location = '';
        this.venderName = '';
        this.expenseID = '';
        this.tripID = '';

      }
    });
  }
}

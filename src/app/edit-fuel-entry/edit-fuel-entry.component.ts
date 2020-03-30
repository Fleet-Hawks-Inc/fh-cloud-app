import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-fuel-entry',
  templateUrl: './edit-fuel-entry.component.html',
  styleUrls: ['./edit-fuel-entry.component.css']
})
export class EditFuelEntryComponent implements OnInit {
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


  fuelEntryId ='';
  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.fuelEntryId = this.route.snapshot.params['fuelEntryId'];

    this.apiService.getData('fuelEntries/' + this.fuelEntryId)
        .subscribe((result: any) => {
          console.log(result);
          result = result.Items[0];



          this.date = result.date;
          this.odometer = result.odometer;
          this.price = result.price;
          this.volume = result.volume;
          this.fuelType = result.fuelType;
          this.location = result.location;
          this.venderName = result.venderName;
          this.expenseID = result.expenseID;
          this.tripID = result.tripID;
          this.vehicleID = result.vehicleID;


          //this.quantum = result.quantum;
          //this.quantumSelected = result.quantumSelected;


          //console.log(result);
        });

  }


  updateFuelEntry() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "entryID": this.fuelEntryId,
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

    this.apiService.putData('fuelEntries', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Fuel Entry Updated successfully';

      }
    });
  }

}

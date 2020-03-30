import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-vehicle-service-log',
  templateUrl: './add-vehicle-service-log.component.html',
  styleUrls: ['./add-vehicle-service-log.component.css']
})
export class AddVehicleServiceLogComponent implements OnInit {

  title = 'Add vehicle Service Logs';

  /********** Form Fields ***********/

  vehicleID = '';
  vendorID = '';
  task: '';
  description: '';
  value: '';
  image : '';
  serviceType: '';
  odometer: '';

  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}




  addVehicleServiceLog() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "vehicleID": this.vehicleID,
      "vendorID": this.vendorID,
      "task": this.vendorID,
      "description": this.vendorID,
      "value": this.vendorID,
      "image": this.vendorID,
      "serviceType": this.vendorID,
      "odometer": this.odometer
    };


    this.apiService.postData('vehicleServiceLogs', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Vehicle Service Log Added successfully';
        this.vehicleID = '';
        this.vendorID = '';
        this.task = '';
        this.description = '';
        this.value = '';
        this.image = '';
        this.serviceType = '';
        this.odometer = '';
      }
    });
  }
}

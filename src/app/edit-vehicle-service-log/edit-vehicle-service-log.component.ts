import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-edit-vehicle-service-log',
  templateUrl: './edit-vehicle-service-log.component.html',
  styleUrls: ['./edit-vehicle-service-log.component.css']
})
export class EditVehicleServiceLogComponent implements OnInit {
  title = 'Edit Vehicle Service Log';

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

  logID ='';
  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }


  ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];

    this.apiService.getData('vehicleServiceLogs/' + this.logID)
        .subscribe((result: any) => {
          result = result.Items[0];
          this.vehicleID = result.vehicleID;
          this.vendorID = result.vendorID;
          this.task = result.task;
          this.description = result.description;
          this.value = result.value;
          this.image = result.image;
          this.serviceType = result.serviceType;
          this.odometer = result.odometer;
        });

  }




  updateVehicleServiceLog() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "logID": this.logID,
      "vehicleID": this.vehicleID,
      "vendorID": this.vendorID,
      "task": this.task,
      "description": this.description,
      "value": this.value,
      "image": this.image,
      "serviceType": this.serviceType,
      "odometer": this.odometer
    };

    this.apiService.putData('vehicleServiceLogs', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Vehicle Service Log Updated successfully';

      }
    });
  }
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {from, of} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-add-vehicle-service-log',
  templateUrl: './add-vehicle-service-log.component.html',
  styleUrls: ['./add-vehicle-service-log.component.css']
})
export class AddVehicleServiceLogComponent implements OnInit, AfterViewInit {

  title = 'Add vehicle Service Logs';

  errors = {};
  form;

  /********** Form Fields ***********/


    vehicleID = '';
    vendorID =  '';
    taskDescription = '';
    serviceType = '';
    value = '';
    odometer = '';
    attachStockItem = '';



  /******************/


  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }




  addVehicleServiceLog() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "vehicleID": this.vehicleID,
      "vendorID": this.vendorID,
      "taskDescription": this.taskDescription,
      "serviceType": this.serviceType,
      "value": this.vendorID,
      "odometer": this.odometer,
      "attachStockItem": this.attachStockItem
    };


    this.apiService.postData('vehicleServiceLogs', data)
      .pipe(
        catchError((err) => {
          return from(err.error)
        }),
        tap((val) => console.log(val)),
        map((val: any) => {
          val.message = val.message.replace(/".*"/, 'This Field');
          this.errors[val.context.key] = val.message ;
        }),
      )
      .subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {

        if (!$.isEmptyObject(this.errors)) {
          return this.throwErrors();
        }

        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Vehicle Service Log Added successfully';
        this.vehicleID = '';
        this.vendorID = '';
        this.taskDescription = '';
        this.value = '';
        this.odometer = '';
      }
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}

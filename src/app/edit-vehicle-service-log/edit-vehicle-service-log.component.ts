import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
import {from, of} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-edit-vehicle-service-log',
  templateUrl: './edit-vehicle-service-log.component.html',
  styleUrls: ['./edit-vehicle-service-log.component.css']
})
export class EditVehicleServiceLogComponent implements OnInit, AfterViewInit {
  title = 'Edit Vehicle Service Log';

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
          this.serviceType = result.serviceType;
          this.taskDescription = result.taskDescription;
          this.value = result.value;
          this.odometer = result.odometer;
          this.attachStockItem = result.attachStockItem;

        });

  }

  ngAfterViewInit() {
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }




  updateVehicleServiceLog() {

    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "logID": this.logID,
      "vehicleID": this.vehicleID,
      "vendorID": this.vendorID,
      "taskDescription": this.taskDescription,
      "serviceType": this.serviceType,
      "value": this.vendorID,
      "odometer": this.odometer,
      "attachStockItem": this.attachStockItem
    };

    this.apiService.putData('vehicleServiceLogs', data)
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
        this.Success = 'Vehicle Service Log Updated successfully';

      }
    });
  }

  throwErrors() {
    this.form.showErrors(this.errors);
  }

}

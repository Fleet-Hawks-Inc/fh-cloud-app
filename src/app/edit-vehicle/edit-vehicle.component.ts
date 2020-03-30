import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../api.service";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {

  title = 'Add Vehicles';

  /********** Form Fields ***********/
  vehicleID = '';
  vin = '';
  year = '';
  make = '';
  model = '';
  fuelType = '';
  state = '';
  plateNumber = '';
  inspectionFormID = '';
  UID = '';
  status = 'Active';
  driverUserName = '';
  currentStatus = 'Active';
  companyID = '';
  lastServiceTime = '';
  quantum = '';
  quantumSelected = '';
  quantumStatus = '';
  /******************/
    quantumsList = '';

  response : any = '';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';


  vehicleId : string;
  constructor(private route: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit() {
    this.vehicleID = this.route.snapshot.params['vehicleId'];

      this.apiService.getData('quantums')
          .subscribe((result: any) => {
              this.quantumsList = result.Items;
          });

    this.apiService.getData('vehicles/' + this.vehicleID)
        .subscribe((result: any) => {
            result = result.Items[0];

            //     'vehicleID': this.vehicleID,
        //         'vin': this.vin,
        //         'vehicleInfo': {
        //         'year': this.year,
        //             'make': this.make,
        //             'model': this.model
        //     },
        //     'fuelType': this.fuelType,
        //         'license': {
        //         'state': this.status,
        //             'plateNumber': this.plateNumber
        //     },
        //     'inspectionFormID': this.vehicleID,
        //         'quantumInfo': {
        //         'UID': this.vehicleID,
        //             'status': this.status
        //     },
        //     'driverUserName': 'test',
        //         'currentStatus': this.currentStatus,
        //         'carrierID': 'testCompany',
        //         'lastServiceTime': this.lastServiceTime
        // };


          this.vehicleID = result.vehicleID;
          this.vin = result.vin;
          this.year = result.vehicleInfo.year;
          this.make = result.vehicleInfo.make;
          this.model = result.vehicleInfo.model;
          this.fuelType = result.fuelType;
          this.state = result.license.state;
          this.plateNumber = result.license.plateNumber;
          this.inspectionFormID = result.inspectionFormID;
          this.quantum = result.quantumInfo.UID;
          this.quantumStatus = result.quantumInfo.status;
          this.driverUserName = result.driverUserName;
          this.currentStatus = result.currentStatus;
          this.companyID = result.carrierID;
          this.lastServiceTime = result.lastServiceTime;

          //this.quantum = result.quantum;
          //this.quantumSelected = result.quantumSelected;


         //console.log(result);
        });




    //console.log(this.vehicleID);
  }




    updateVehicle() {
        this.hasError = false;
        this.hasSuccess = false;

        const data = {
            'vehicleID': this.vehicleID,
            'vin': this.vin,
            'vehicleInfo': {
                'year': this.year,
                'make': this.make,
                'model': this.model
            },
            'fuelType': this.fuelType,
            'license': {
                'state': this.state,
                'plateNumber': this.plateNumber
            },
            'inspectionFormID': this.inspectionFormID,
            'quantumInfo': {
                'UID': this.quantum,
                'status': this.quantumStatus
            },
            'driverUserName': 'test',
            'currentStatus': this.currentStatus,
            'lastServiceTime': this.lastServiceTime
        };


        this.apiService.putData('vehicles', data).
        subscribe({
            complete : () => {},
            error : (err) => {
                this.hasError = true;
                this.Error = err.error;
            },
            next: (res) => {
                this.response = res;
                this.hasSuccess = true;
                this.Success = 'Vehicle Updated successfully';

            }
        });
    }

    quantumModal() {
        $( document ).ready(function() {
            $('#modalAnim').modal('show');
        });

    }


    onChange(newValue) {
        this.quantum = newValue;
        this.quantumSelected = newValue;
    }







}

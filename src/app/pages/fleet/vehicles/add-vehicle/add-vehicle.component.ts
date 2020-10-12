import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import {Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
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

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {

    this.apiService.getData('quantums')
        .subscribe((result: any) => {
          this.quantumsList = result.Items;
        });

  }

  addVehicle() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
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
      'driverUserName': 'default',
      'currentStatus': this.currentStatus,
      'lastServiceTime': this.lastServiceTime
    };


    this.apiService.postData('vehicles', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Vehicle Added successfully';

        this.vehicleID = '';
        this.vin = '';
        this.year = '';
        this.make = '';
        this.model = '';
        this.fuelType = '';
        this.state = '';
        this.plateNumber = '';
        this.inspectionFormID = '';
        this.UID = '';
        this.status = 'Active';
        this.driverUserName = '';
        this.currentStatus = 'Active';
        this.companyID = '';
        this.lastServiceTime = '';
        this.quantum = '';
        this.quantumSelected = '';



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

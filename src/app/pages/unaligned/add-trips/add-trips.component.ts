import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-add-trips',
  templateUrl: './add-trips.component.html',
  styleUrls: ['./add-trips.component.css']
})
export class AddTripsComponent implements OnInit {
  title = 'Add Trips';

  /********** Form Fields ***********/
  sourceAddress = '';
  destinationAddress = '';
  vehicleID = '';
  assetID = '';
  driverID = '';
  driverContact = '';
  vehicleSelected = '';
  assetSelected = '';


  /******************/

  vehicleList = '';
  assetList = '';

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router) {}

  ngOnInit() {
    this.apiService.getData('vehicles')
        .subscribe((result: any) => {
          this.vehicleList = result.Items;
        });

    this.apiService.getData('assets')
        .subscribe((result: any) => {
          this.assetList = result.Items;
        });

  }

  addTrip() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      'sourceAddress': this.sourceAddress,
      'destinationAddress': this.destinationAddress,
      'vehicleID': this.vehicleSelected,
      'assetID': this.assetSelected,
      'drivers': {
        'driverID': this.driverID,
        'driverContact': this.driverContact
      }
    };


    this.apiService.postData('trips', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Trip Added successfully';

        this.sourceAddress = '';
        this.destinationAddress = '';
        this.driverID = '';
        this.driverContact = '';




      }
    });
  }



}

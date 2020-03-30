import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {

  title = 'Edit Trip';

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
  tripId = '';

  response : any ='';
  hasError : boolean = false;
  hasSuccess: boolean = false;
  Error : string = '';
  Success : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {

    this.tripId = this.route.snapshot.params['tripId'];

    this.apiService.getData('vehicles')
        .subscribe((result: any) => {
          this.vehicleList = result.Items;
        });

    this.apiService.getData('assets')
        .subscribe((result: any) => {
          this.assetList = result.Items;
        });


    this.apiService.getData('trips/' + this.tripId)
        .subscribe((result: any) => {
          //console.log(result);
          result = result.Items[0];


          this.sourceAddress = result.sourceAddress;
          this.destinationAddress =  result.destinationAddress;
          this.vehicleSelected =  result.vehicleID;
          this.assetSelected =  result.assetID;
          this.driverID = result.drivers.driverID;
          this.driverContact = result.drivers.driverContact;


        });
  }

  updateTrip() {
    this.hasError = false;
    this.hasSuccess = false;

    const data = {
      "tripID": this.tripId,
      "sourceAddress": this.sourceAddress,
      "destinationAddress": this.destinationAddress,
      "vehicleID": this.vehicleSelected,
      "assetID": this.assetSelected,
      "drivers": {
        "driverID": this.driverID,
        "driverContact": this.driverContact
      }
    };


    this.apiService.putData('trips', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Trip Updated successfully';

      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { MapBoxService } from '../../../../map-box.service';
import { ApiService } from '../../../../api.service';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../../../../environments/environment';
import * as S3 from 'aws-sdk/clients/s3';
import { AwsDownloadService } from 'src/app/aws-download.service';






@Component({
  selector: 'app-fuel-details',
  templateUrl: './fuel-details.component.html',
  styleUrls: ['./fuel-details.component.css']
})
export class FuelDetailsComponent implements OnInit {
  title = 'Fuel Entry';
  fuelList;
    /********** Form Fields ***********/
    showImage: string;
    unitType = 'Vehicle';
    vehicleID = '';
    vehicleFuelQty = 0;
    vehicleFuelQtyUnit = 'gallons';
    vehicleFuelQtyAmt = 0;
    reeferID = '';
    reeferFuelQty = 0;
    reeferFuelQtyUnit = 'gallons';
    reeferFuelQtyAmt = 0;
    DEFFuelQty = 0;
    DEFFuelQtyUnit = 'gallons';
    DEFFuelQtyAmt = 0;
    discount = 0;
    totalAmount = 0;
    costPerGallon = 0;
    amountPaid = 0;
    date: '';
    fuelType = '';
    //  tripID: '';
    costLabel = 'Cost/gallon';
    paidBy = '';
    paymentMode = '';
    reference = '';
    reimburseToDriver = false;
    deductFromPay = false;
    vendorID = '';
    countryID = '';
    stateID = '';
    cityID = '';
    dispatchAssociate = '';
    dispatchID = '';
    avgGVW = '';
    odometer = '';
    description = '';
    fileToUpload = '';
    timeCreated: '';
    /******************/
    entryID = '';
    vehicles = [];
    vendors = [];
    trips = [];
    countries = [];
    states = [];
    cities = [];
    errors = {};
    vehicleName = '';
    vendorName = '';
    form;
    response: any = '';
    hasError = false;
    hasSuccess = false;
    Error = '';
    Success = '';
    bucketName;
    bucket;
    carrierID;
  constructor( private mapBoxService: MapBoxService, private apiService: ApiService, private route: ActivatedRoute, private fileDownload: AwsDownloadService){
      this.bucket = new S3(
      {
        accessKeyId: environment.awsBucket.accessKeyId,
        secretAccessKey: environment.awsBucket.secretAccessKey,
        region: environment.awsBucket.region
      }
    );this.bucketName = environment.awsBucket.bucketName;
   }

  ngOnInit() {
    this.mapBoxService.initMapbox(-104.618896, 50.44521);
    this.entryID = this.route.snapshot.params['entryID'];
    this.fetchFuelEntry();
    this.fetchTrips();
    this.fetchCountries();
    this.carrierID = this.apiService.getCarrierID();

  }
  getStates() {
    this.apiService
      .getData('states/country/' + this.countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  getCities() {
    this.apiService.getData('cities/state/' + this.stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  fillCountry() {
    this.apiService
      .getData('states/' + this.stateID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.countryID = result.countryID;
      });

    setTimeout(() => {
      this.getStates();
    }, 1500);
    setTimeout(() => {
      this.getCities();
    }, 1500);
  }
  fetchVehicles(ID) {
    this.apiService.getData('vehicles/' + ID).subscribe((result: any) => {
      this.vehicles = result.Items;
      this.vehicleName =  this.vehicles[0].vehicleName;
    });
  }
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
    });
  }
  fetchTrips() {
    this.apiService.getData('trips').subscribe((result: any) => {
      this.trips = result.Items;
    });
  }

  fetchVendors(ID) {
    this.apiService.getData('vendors/' + ID).subscribe((result: any) => {
      this.vendors = result.Items;
      this.vendorName = this.vendors[0].vendorName;
    });
  }
  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        // console.log('result is:' + result);
        this.unitType = result.unitType;
        this.vehicleID = result.vehicleID,
        this.vehicleFuelQty = +result.vehicleFuelQty,
        this.vehicleFuelQtyUnit = result.vehicleFuelQtyUnit,
        this.vehicleFuelQtyAmt = +result.vehicleFuelQtyAmt,
        this.reeferID = result.reeferID,
        this.reeferFuelQty = result.reeferFuelQty,
        this.reeferFuelQtyUnit = result.reeferFuelQtyUnit,
        this.reeferFuelQtyAmt = result.reeferFuelQtyAmt,
        this.DEFFuelQty = +result.DEFFuelQty,
        this.DEFFuelQtyUnit = result.DEFFuelQtyUnit,
        this.DEFFuelQtyAmt = +result.DEFFuelQtyAmt,
        this.discount = +result.discount,
        this.totalAmount = result.totalAmount,
        this.costPerGallon = result.costPerGallon,
        this.amountPaid = result.amountPaid,
        this.date = result.date,
        this.fuelType = result.fuelType,
         // this. tripID = result.tripID,
        this.costLabel = result.costLabel,



          this.paidBy = result.paidBy,
          this.paymentMode = result.paymentMode,
          this.reference = result.reference,
          this.reimburseToDriver = result.reimburseToDriver,
          this.deductFromPay = result.deductFromPay,


          this.vendorID = result.vendorID,
          this.countryID = result.countryID,
          this.stateID = result.stateID,
          this.cityID = result.cityID,


          this.dispatchAssociate = result.dispatchAssociate,
          this.dispatchID = result.dispatchID,


        this.avgGVW = result.avgGVW,
          this.odometer = result.odometer,
          this.description = result.description,
          this.fileToUpload = result.fileToUpload,

          this.fetchVehicles(this.vehicleID);
        this.fetchVendors(this.vendorID);
        this.showImage = this.fileDownload.getFiles(this.carrierID, this.fileToUpload);

      });
  }
}

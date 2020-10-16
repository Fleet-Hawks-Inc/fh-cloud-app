import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {AwsUploadService} from '../../../../../services';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fuel-entry-details',
  templateUrl: './fuel-entry-details.component.html',
  styleUrls: ['./fuel-entry-details.component.css']
})
export class FuelEntryDetailsComponent implements OnInit {

  title = 'Fuel Entry';
  fuelList;
    /********** Form Fields ***********/
    unitType =  '';
    vehicleID = '';
    fuelQtyAmt: number;
    fuelQty: number;
    fuelQtyUnit = 'gallon';
    reeferID = '';
    DEFFuelQty: number;
    DEFFuelQtyAmt: number;
    DEFFuelQtyUnit = 'gallon';
    discount: number;
    totalAmount: number;
    costPerUnit: number;
    amountPaid: number;
    currency: '';
    date: '';
    fuelType = '';
    carrierID;

 paidBy = '';
 paymentMode  = '';
 reference  = '';
 reimburseToDriver = false;
 deductFromPay  = false;

 vendorID  = '';
 countryID  = '';
 stateID  = '';
 cityID  = '';
 public fuelEntryImages = [];
  tripID  = '';
  image;
additionalDetails = {
 avgGVW  : '',
 odometer  : '',
 description  : '',
 uploadedPhotos : [],
};
    timeCreated: '';
    /******************/
    entryID = '';
    vehicles = [];
    assets = [];
    vendors = [];
    trips = [];
    countries = [];
    states = [];
    cities = [];
    errors = {};
    vehicleName = '';
    vendorName = '';
    assetName = '';
    form;
    unit: boolean;
    response: any = '';
    hasError = false;
    hasSuccess = false;
    Error = '';
    Success = '';
    constructor(
                 private apiService: ApiService,
                 private route: ActivatedRoute,
                 private router: Router,
    private toastr: ToastrService,
                 private domSanitizer: DomSanitizer, private awsUS: AwsUploadService) {
   }

  ngOnInit() {
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
      console.log('VEHICLES', this.vehicles);
      this.vehicleName =  this.vehicles[0].vehicleIdentification;
    });
  }
  fetchAssets(ID) {
    this.apiService.getData('assets/' + ID).subscribe((result: any) => {
      this.assets = result.Items;
      console.log('ASSETS', this.assets);
      this.assetName =  this.assets[0].assetIdentification;
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

        this.entryID = this.entryID;
        this.currency = result.currency,
          this.unitType = result.unitType;
        this.vehicleID = result.vehicleID,
          this.reeferID = result.reeferID,
          this.fuelQty = result.fuelQty,
          this.fuelQtyUnit = result.fuelQtyUnit,
          this.fuelQtyAmt = +result.fuelQtyAmt,
          this.DEFFuelQty = +result.DEFFuelQty,
          this.DEFFuelQtyUnit = result.fuelQtyUnit,
          this.DEFFuelQtyAmt = +result.DEFFuelQtyAmt,
          this.discount = +result.discount,
          this.totalAmount = result.totalAmount,
          this.costPerUnit = result.costPerUnit,
          this.amountPaid = result.amountPaid,
          this.date = result.date,
          this.fuelType = result.fuelType,

          this.paidBy = result.paidBy,
          this.paymentMode = result.paymentMode,
          this.reference = result.reference,
          this.reimburseToDriver = result.reimburseToDriver,
          this.deductFromPay = result.deductFromPay,


          this.vendorID = result.vendorID,
          this.countryID = result.countryID,
          this.stateID = result.stateID,
          this.cityID = result.cityID,
          this.tripID = result.tripID,
        this.additionalDetails = {
            avgGVW : result.additionalDetails.avgGVW,
            odometer : result.additionalDetails.odometer,
            description : result.additionalDetails.description,
            uploadedPhotos : result.additionalDetails.uploadedPhotos,
          },
          this.getImages();
        setTimeout(() => {
          this.fillCountry();
        }, 2000);
      });
      this.fetchVehicles(this.vehicleID);
      this.fetchAssets(this.reeferID);
      this.fetchVendors(this.vendorID);
  }
  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.additionalDetails.uploadedPhotos.length; i++) {
      // this.docs = this.domSanitizer.bypassSecurityTrustResourceUrl(
      // await this.awsUS.getFiles(this.carrierID, this.assetData[0].uploadedDocs[i]));
      // this.assetsDocs.push(this.docs)
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
                                                           (this.carrierID, this.additionalDetails.uploadedPhotos[i]));
      this.fuelEntryImages.push(this.image);
    }
  }
  deleteFuelEntry(entryID) {
    this.apiService
      .deleteData('fuelEntries/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Fuel Entry Deleted Successfully!');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      });
  }
}

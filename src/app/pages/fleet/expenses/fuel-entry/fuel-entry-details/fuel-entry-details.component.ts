import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AwsUploadService } from '../../../../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { escapeLeadingUnderscores } from 'typescript';
@Component({
  selector: 'app-fuel-entry-details',
  templateUrl: './fuel-entry-details.component.html',
  styleUrls: ['./fuel-entry-details.component.css']
})
export class FuelEntryDetailsComponent implements OnInit {

  title = 'Fuel Entry';
  fuelList;
  /********** Form Fields ***********/
  fuelData = {
    unitType : 'vehicle',
    currency: 'USD',
    fuelQtyAmt: 0,
    fuelQty: 0,
    DEFFuelQty: 0,
    DEFFuelQtyAmt: 0,
    totalAmount: 0,
    discount: 0,
    amountPaid: 0,
    costPerGallon: 0,
    totalGallons: 0,
        countryID: '',
       stateID: '',
       reimburseToDriver: false,
       deductFromPay: false,
    additionalDetails: {
          avgGVW: '',
          odometer: '',
          description: '',
          uploadedPhotos: [],
        }
   };
  carrierID;
  vehicleList: any = {};
  assetList: any = {};
  tripList: any = {};
 
  public fuelEntryImages = [];
  tripID = '';
  image;
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
  vendorName = '';
  form;
  vehicleData = [];
  ReeferData = [];
  unit: boolean;
  MPG: number;
  costPerMile: number;
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
    this.entryID = this.route.snapshot.params[`entryID`];
    this.fetchFuelEntry();
    this.fetchAssetList();
    this.fetchTripList();
    
    this.carrierID = this.apiService.getCarrierID();
    this.fetchVehicleList();
  }
  fetchVendors(ID) {
    this.apiService.getData('vendors/' + ID).subscribe((result: any) => {
      this.vendors = result.Items;
      this.vendorName = this.vendors[0].vendorName;
    });
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchTripList() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  fetchAllVehicles(ID) {
    let sortedArray: any = [];
    let totalCalculatedGallons = 0;
    let sumCostPerGallon = 0;
    this.apiService.getData(`fuelEntries/unit/` + ID).subscribe((result: any) => {
      this.vehicleData = result.Items;
    //  console.log('Vehicle data', this.vehicleData);
    });
    setTimeout(() => {
      sortedArray = _.orderBy(this.vehicleData, ['additionalDetails.odometer'], ['desc']);
    //  console.log('sorted array', sortedArray);
      if(sortedArray.length < 3){
        this.MPG = 0;
        this.costPerMile = 0;
      }
      else{
        for (let i = 1; i < sortedArray.length; i++) {
        //  console.log('sortedArray.length',sortedArray.length);
          totalCalculatedGallons = totalCalculatedGallons + sortedArray[i].totalGallons;
          sumCostPerGallon = sumCostPerGallon + sortedArray[i].costPerGallon;
            }
     let avgCostPerGallon = +((sumCostPerGallon/(sortedArray.length-1)).toFixed(2));
  //   console.log('avgCostPerGallon', avgCostPerGallon);
 //    console.log('total gallons', totalCalculatedGallons);
        const firstEntry = sortedArray.pop(); //First entry means when vehicle got fuel for first time
      //  console.log('First Entry', firstEntry);
        const latestEntry = sortedArray.shift(); //Latest entry means the last ododmter reading 
     //   console.log('Latest entry', latestEntry); 
        const miles = latestEntry.additionalDetails.odometer - firstEntry.additionalDetails.odometer;
     //   console.log('miles', miles);
        this.MPG = +((miles / totalCalculatedGallons).toFixed(2));
      //  console.log('MPG', this.MPG);
        this.costPerMile = +((avgCostPerGallon / this.MPG).toFixed(2));
       // console.log('cost per mile', this.costPerMile);
      }
    
    }, 4500);
  }
  /**
   * Reefer MPG Calculations
   */
  fetchAllReefers(ID) {
    let sortedArray: any = [];
    let totalCalculatedGallons = 0;
    let sumCostPerGallon = 0;
    this.apiService.getData(`fuelEntries/unit/` + ID).subscribe((result: any) => {
      this.ReeferData = result.Items;
    //  console.log('Reefer Data', this.ReeferData);
    });
    setTimeout(() => {
      sortedArray = _.orderBy(this.ReeferData, ['additionalDetails.odometer'], ['desc']);
    //  console.log('sorted array', sortedArray);
      if(sortedArray.length < 2){
        this.MPG = 0;
        this.costPerMile = 0;
      }
      else{
        for (let i = 1; i < sortedArray.length; i++) {
         // console.log('sortedArray.length',sortedArray.length);
          totalCalculatedGallons = totalCalculatedGallons + sortedArray[i].totalGallons;
          sumCostPerGallon = sumCostPerGallon + sortedArray[i].costPerGallon;
            }
     let avgCostPerGallon = +((sumCostPerGallon/(sortedArray.length-1)).toFixed(2));
    // console.log('avgCostPerGallon', avgCostPerGallon);
   //  console.log('total gallons', totalCalculatedGallons);
        const firstEntry = sortedArray.pop(); //First entry means when vehicle got fuel for first time
      //  console.log('First Entry', firstEntry);
        const latestEntry = sortedArray.shift(); //Latest entry means the last ododmter reading 
      //  console.log('Latest entry', latestEntry); 
        const miles = latestEntry.additionalDetails.odometer - firstEntry.additionalDetails.odometer;
      //  console.log('miles', miles);
        this.MPG = +((miles / totalCalculatedGallons).toFixed(2));
      //  console.log('MPG', this.MPG);
        this.costPerMile = +((avgCostPerGallon / this.MPG).toFixed(2));
      //  console.log('cost per mile', this.costPerMile);
      }
    
    }, 4500);
  }
  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        console.log('Fetched Data', result);        
        this.fuelData[`entryID`] = this.entryID;
        this.fuelData[`currency`] = result.currency,
        this.fuelData[`unitType`] = result.unitType;
        this.fuelData[`unitID`] = result.unitID;
        this.fuelData[`fuelQty`] = result.fuelQty;
        this.fuelData[`fuelQtyAmt`] = +result.fuelQtyAmt;
        this.fuelData[`DEFFuelQty`] = +result.DEFFuelQty;
        this.fuelData[`DEFFuelQtyUnit`] = result.fuelQtyUnit;
        this.fuelData[`DEFFuelQtyAmt`] = result.DEFFuelQtyAmt;
        this.fuelData[`discount`] = result.discount;
        this.fuelData[`totalAmount`] = result.totalAmount;
        this.fuelData[`costPerGallon`] = result.costPerGallon;
        this.fuelData[`totalGallons`] = result.totalGallons;
        this.fuelData[`amountPaid`] = result.amountPaid;
        this.fuelData[`fuelDate`] = result.fuelDate;
        this.fuelData[`fuelTime`] = result.fuelTime;
        this.fuelData[`fuelType`] = result.fuelType;

        this.fuelData[`paidBy`] = result.paidBy;
        this.fuelData[`paymentMode`] = result.paymentMode;
        this.fuelData[`reference`] = result.reference;
        this.fuelData[`reimburseToDriver`] = result.reimburseToDriver;
        this.fuelData[`deductFromPay`] = result.deductFromPay;


        this.fuelData[`vendorID`] = result.vendorID;
        this.fuelData[`countryID`] = result.countryID;
        this.fuelData[`stateID`] = result.stateID;
        this.fuelData[`cityID`] = result.cityID;
        this.fuelData[`tripID`] = result.tripID;

        this.fuelData[`additionalDetails`][`avgGVW`] =  result.additionalDetails.avgGVW;
        this.fuelData[`additionalDetails`][`odometer`] = result.additionalDetails.odometer;
        this.fuelData[`additionalDetails`][`description`] = result.additionalDetails.description;
        this.fuelData[`additionalDetails`][`uploadedPhotos`] = result.additionalDetails.uploadedPhotos;
        this.getImages();
        this.fetchVendors(result.vendorID);
        if(result.unitType === 'vehicle'){
          this.fetchAllVehicles(result.unitID);
        }
        else if(result.unitType === 'reefer'){
          this.fetchAllReefers(result.unitID);
        }
      });
     
  }
  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.fuelData.additionalDetails.uploadedPhotos.length; i++) {
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
        (this.carrierID, this.fuelData.additionalDetails.uploadedPhotos[i]));
      this.fuelEntryImages.push(this.image);
    }
  }
  deleteImage(i: number) {
    this.carrierID =  this.apiService.getCarrierID();
    this.awsUS.deleteFile(this.carrierID, this.fuelData.additionalDetails.uploadedPhotos[i]);
    this.fuelData.additionalDetails.uploadedPhotos.splice(i, 1);
    this.fuelEntryImages.splice(i, 1);
   // this.updateFuelEntry();
    this.toastr.success('Image Deleted Successfully!');
   // this.apiService.getData('fuelEntries//updatePhotos/' + this.entryID + '/' + this.additionalDetails.uploadedPhotos).subscribe((result: any) => {
   //   this.toastr.success('Image Deleted Successfully!');
   // });
  }
  deleteFuelEntry(entryID) {
    this.apiService
      .deleteData('fuelEntries/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Fuel Entry Deleted Successfully!');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      });
  }
  updateFuelEntry() {
    console.log('Updated data', this.fuelData);
    this.apiService.putData('fuelEntries', this.fuelData).subscribe();
  }
}

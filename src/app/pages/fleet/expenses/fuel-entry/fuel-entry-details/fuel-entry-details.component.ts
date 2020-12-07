import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AwsUploadService } from '../../../../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
@Component({
  selector: 'app-fuel-entry-details',
  templateUrl: './fuel-entry-details.component.html',
  styleUrls: ['./fuel-entry-details.component.css']
})
export class FuelEntryDetailsComponent implements OnInit {

  title = 'Fuel Entry';
  fuelList;
  /********** Form Fields ***********/
  unitType = '';
  unitID: string;
  unitName: string;
  fuelQtyAmt: number;
  fuelQty: number;
  tripNumber: string;
  fuelQtyUnit = 'gallon';
  DEFFuelQty: number;
  DEFFuelQtyAmt: number;
  DEFFuelQtyUnit = 'gallon';
  discount: number;
  totalAmount: number;
  costPerUnit: number;
  amountPaid: number;
  currency: string;
  fuelDate: string;
  fuelTime: string;
  fuelType = '';
  carrierID;
  vehicleList: any = {};
  assetList: any = {};
  tripList: any = {};
  paidBy = '';
  paymentMode = '';
  reference = '';
  reimburseToDriver = false;
  deductFromPay = false;

  vendorID = '';
  countryID = '';
  stateID = '';
  cityID = '';
  public fuelEntryImages = [];
  tripID = '';
  image;
  additionalDetails = {
    avgGVW: '',
    odometer: '',
    description: '',
    uploadedPhotos: [],
  };
  MPG = '';
  costPerMile = '';
  fuel = {
    totalLitres: 0,
    totalGallons: 0,
    costPerLitre: 0,
    costPerGallon: 0
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
  vehicleData = [];
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
  fetchAllVehicles() {
    this.apiService.getData(`fuelEntries/vehicle/` + this.unitID).subscribe((result: any) => {
      this.vehicleData = result.Items;
      console.log('Vehicle data', this.vehicleData);
    });
    setTimeout(() => {
      const sortedArray = _.sortBy(this.vehicleData, ['fuelDate']);
      sortedArray.shift();
      console.log('sorted arry', sortedArray);
      const miles = this.additionalDetails.odometer;
    }, 3000);
  }
  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.entryID = this.entryID;
        this.currency = result.currency,
          this.unitType = result.unitType;
        this.unitID = result.unitID;
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
          this.fuelDate = result.fuelDate,
          this.fuelTime = result.fuelTime,
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
            avgGVW: result.additionalDetails.avgGVW,
            odometer: result.additionalDetails.odometer,
            description: result.additionalDetails.description,
            uploadedPhotos: result.additionalDetails.uploadedPhotos,
          },
          this.fuel = {
            totalLitres: result.fuel.totalLitres,
            totalGallons: result.fuel.totalGallons,
            costPerLitre: result.fuel.costPerLitre,
            costPerGallon: result.fuel.costPerGallon
          },
          this.getImages();
          this.fetchAllVehicles();
      });
    this.fetchVendors(this.vendorID);
  }
  getImages = async () => {
    this.carrierID = await this.apiService.getCarrierID();
    for (let i = 0; i < this.additionalDetails.uploadedPhotos.length; i++) {
      this.image = this.domSanitizer.bypassSecurityTrustUrl(await this.awsUS.getFiles
        (this.carrierID, this.additionalDetails.uploadedPhotos[i]));
      this.fuelEntryImages.push(this.image);
    }
  }
  deleteImage(i: number) {
    this.carrierID =  this.apiService.getCarrierID();
    this.awsUS.deleteFile(this.carrierID, this.additionalDetails.uploadedPhotos[i]);
    this.additionalDetails.uploadedPhotos.splice(i, 1);
    this.fuelEntryImages.splice(i, 1);
    this.updateFuelEntry();
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
    const data = {
      entryID: this.entryID,
      unitType: this.unitType,
      unitID: this.unitID,
      fuelQty: this.fuelQty,
      fuelQtyUnit: this.fuelQtyUnit,
      fuelQtyAmt: this.fuelQtyAmt,
      DEFFuelQty: this.DEFFuelQty,
      DEFFuelQtyAmt: this.DEFFuelQtyAmt,
      discount: this.discount,
      totalAmount: this.totalAmount,
      costPerUnit: this.costPerUnit,
      amountPaid: this.amountPaid,
      currency: this.currency,
      fuelDate: this.fuelDate,
      fuelTime: this.fuelTime,
      fuelType: this.fuelType,
      paidBy: this.paidBy,
      paymentMode: this.paymentMode,
      reference: this.reference,
      reimburseToDriver: this.reimburseToDriver,
      deductFromPay: this.deductFromPay,
      vendorID: this.vendorID,
      countryID: this.countryID,
      stateID: this.stateID,
      cityID: this.cityID,
      tripID: this.tripID,
      additionalDetails: {
        avgGVW: this.additionalDetails.avgGVW,
        odometer: this.additionalDetails.odometer,
        description: this.additionalDetails.description,
        uploadedPhotos: this.additionalDetails.uploadedPhotos,
      },
      fuel: {
        totalLitres: this.fuel.totalLitres,
        totalGallons: this.fuel.totalGallons,
        costPerLitre: this.fuel.costPerLitre,
        costPerGallon: this.fuel.costPerGallon
      },
    };
    //  console.log(data);
    this.apiService.putData('fuelEntries', data).subscribe();
  }
}

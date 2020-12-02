import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AwsUploadService } from '../../../../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
          this.getImages();
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
    console.log('new array',this.additionalDetails.uploadedPhotos);
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
}

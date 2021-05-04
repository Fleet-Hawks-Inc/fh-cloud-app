import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import Constants from '../../constants';
import { HereMapService } from '../../../../services';
import { Environment } from 'aws-sdk/clients/lambda';
import { environment } from '../../../../../environments/environment';
declare var H: any;
declare var $: any;
@Component({
  selector: 'app-fuel-entry-details',
  templateUrl: './fuel-entry-details.component.html',
  styleUrls: ['./fuel-entry-details.component.css']
})
export class FuelEntryDetailsComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  title = 'Fuel Entry';
  Asseturl = this.apiService.AssetUrl;
  fuelList;
  /********** Form Fields ***********/
  fuelData = {
    unitID: '',
    fuelUnit: '',
    unitType: '',
    entryID: '',
    billingCurrency: '',
    DEFFuelQtyUnit: '',
    fuelTime: '',
    fuelDate: '',
    fuelType: '',
    paidBy: '',
    paymentMode: '',
    reference: '',
    vendorID: '',
    cityID: '',
    tripID: '',
    fuelQtyAmt: 0,
    fuelQty: 0,
    DEFFuelQty: 0,
    DEFFuelQtyAmt: 0,
    subTotal: 0,
    discType: '',
    discAmount: 0,
    amountPaid: 0,
   fuelCardNumber: '',
    pricePerUnit: 0,
    totalUnits: 0,
    countryID: '',
    stateID: '',
    taxes: [],
    lineItems : [{
        fuelType: '',
        quantity: '',
        amount: '',
        pricePerUnit: '',
        retailAmount: '',
        retailPricePerUnit: '',
        useType: ''
    }],
    reimburseToDriver: false,
    deductFromPay: false,
      odometer: 0,
      description: '',
      uploadedPhotos: []
  };
  carrierID;
  vehicleList: any = {};
  assetList: any = {};
  tripList: any = {};
  vendorList: any = {};
  WEXTaxCodeList: any = {};
  WEXDiscountCodeList: any = {};
  fuelTypeWEXCode: any  = {};
  fuelTypeListCode: any  = {};
  WEXuseTypeCodeList: any = {};
  public fuelEntryImages = [];
  existingPhotos = [];
  tripID = '';
  image;
  timeCreated: '';
  public map;
  marker: any;
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
  vendorAddress: any;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  countryList: any = {};
  stateList: any  = {};
  cityList; any  = {};
  taxTypeList: any = {};
  discountList: any = {};
  driverList: any  = {};
  Error = '';
  Success = '';
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService, private HereMap: HereMapService) {
  }

  ngOnInit() {
    this.entryID = this.route.snapshot.params[`entryID`];
    this.fetchCitiesList();
    this.fetchFuelEntry();
    this.fetchAssetList();
    this.fetchTripList();
    this.fetchVendorList();
    this.fetchFuelTypeList();
    this.fetchFuelTypeWEXCode();
    this.fetchTaxWEXCode();
    this.fetchWEXDiscountCode();
    this.fetchWEXuseTypeCode();
    this.carrierID = this.apiService.getCarrierID();
    this.fetchVehicleList();
    this.HereMap.mapSetAPI();
    this.map = this.HereMap.mapInit();
    this.fetchCountriesList();
    this.fetchStatesList();
    this.fetchTaxTypeFromID();
    this.fetchDiscFromID();
    this.fetchDriverList();
  }
  fetchVehicleList() {
    this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  fetchVendorList() {
    this.apiService.getData('vendors/get/list').subscribe((result: any) => {
      this.vendorList = result;
    });
  }
  fetchDriverList() {
    this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driverList = result;
    });
  }
  fetchCountriesList() {
    this.apiService.getData('countries/get/list').subscribe((result: any) => {
      this.countryList = result;
    });
  }
  fetchStatesList() {
    this.apiService.getData('states/get/list').subscribe((result: any) => {
      this.stateList = result;
    });
  }
  fetchCitiesList() {
    this.apiService.getData('cities/get/list').subscribe((result: any) => {
      this.cityList = result;
    });
  }
  fetchTaxWEXCode() {
    this.apiService.getData('fuelTaxes/get/WEXCode').subscribe((result: any) => {
    this.WEXTaxCodeList = result;
    });
  }
  fetchTaxTypeFromID() {
    this.apiService.getData('fuelTaxes/get/list').subscribe((result: any) => {
    this.taxTypeList = result;
    });
  }
  fetchDiscFromID() {
    this.apiService.getData('fuelDiscounts/get/list').subscribe((result: any) => {
    this.discountList = result;
    });
  }
  fetchWEXDiscountCode() {
    this.apiService.getData('fuelDiscounts/get/WEXCode').subscribe((result: any) => {
      this.WEXDiscountCodeList = result;
    });
  }
  fetchWEXuseTypeCode() {
    this.apiService.getData('WEXuseTypes/get/WEXCode').subscribe((result: any) => {
        this.WEXuseTypeCodeList = result;
    });
  }
  fetchAssetList() {
    this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  fetchFuelTypeList() {
    this.apiService.getData('fuelTypes/get/list').subscribe((result: any) => {
      this.fuelTypeListCode = result;
    });
  }
  fetchFuelTypeWEXCode() {
    this.apiService.getData('fuelTypes/get/WEXCode').subscribe((result: any) => {
      this.fuelTypeWEXCode = result;
    });
  }
  fetchTripList() {
    this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  fetchVendorData(vendorID) {
    this.apiService.getData('vendors/' + vendorID).subscribe((result: any) => {
      // this.vendorAddress = result.Items[0].address;
      // const lat = this.vendorAddress[0].geoCords.lat;
      // const lng = this.vendorAddress[0].geoCords.lng;
      // const markers = new H.map.Marker(
      //   {
      //     lat: lat, lng: lng
      //   });
      // this.map.addObject(markers);
      // this.map.setCenter({
      //   lat: lat,
      //   lng: lng
      // });
    });
  }
  showFn(i: any) {
    $('#readMoreTaxDiv' + i).show();
    $('#showBtn' + i).hide();
    $('#hideBtn' + i).show();
  }
   hideFn(i: any) {
    $('#readMoreTaxDiv' + i).hide();
    $('#showBtn' + i).show();
    $('#hideBtn' + i).hide();
  }
  fetchFuelEntry() {
    this.apiService
      .getData('fuelEntries/' + this.entryID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.carrierID = result.carrierID;
        this.fuelData.entryID = this.entryID;
        this.fuelData.billingCurrency = result.billingCurrency,
        this.fuelData.unitType = result.unitType;
        this.fuelData.unitID = result.unitID;
        this.fuelData.fuelUnit = result.fuelUnit;
        this.fuelData.fuelQty = result.fuelQty;
        this.fuelData.fuelQtyAmt = +result.fuelQtyAmt;
        this.fuelData.DEFFuelQty = +result.DEFFuelQty;
        this.fuelData.DEFFuelQtyUnit = result.fuelQtyUnit;
        this.fuelData.DEFFuelQtyAmt = result.DEFFuelQtyAmt;
        this.fuelData.discType = result.discType;
        this.fuelData.discAmount = result.discAmount;
        this.fuelData.subTotal = result.subTotal;
        this.fuelData.totalUnits = result.totalUnits;
        this.fuelData.pricePerUnit =  result.pricePerUnit;
        this.fuelData.amountPaid = result.amountPaid;
        this.fuelData.fuelDate = result.fuelDate;
        this.fuelData.fuelTime = result.fuelTime;
        this.fuelData.fuelType = result.fuelType;
        this.fuelData.paidBy = result.paidBy;
        this.fuelData.paymentMode = result.paymentMode;
        this.fuelData.fuelCardNumber = result.fuelCardNumber;
        this.fuelData.reference = result.reference;
        this.fuelData.reimburseToDriver = result.reimburseToDriver;
        this.fuelData.deductFromPay = result.deductFromPay;
        this.fuelData.vendorID = result.vendorID;
        this.fuelData.countryID = result.countryID;
        this.fuelData.stateID = result.stateID;
        this.fuelData.cityID = result.cityID;
        this.fuelData.tripID = result.tripID;
        this.fuelData.odometer = result.odometer;
        this.fuelData.description = result.description;
        this.fuelData.uploadedPhotos = result.uploadedPhotos;
        this.existingPhotos = result.uploadedPhotos;
        this.fuelData.lineItems = result.lineItems;
        this.fuelData.taxes = result.taxes;
        if(result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0){
          this.fuelEntryImages = result.uploadedPhotos.map(x => ({path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x}));
        }
        this.fetchVendorData(result.vendorID);
      });

  }
  deleteImage(i: number) {
    // this.carrierID =  this.apiService.getCarrierID();
    // this.awsUS.deleteFile(this.carrierID, this.fuelData.additionalDetails.uploadedPhotos[i]);
    this.fuelData.uploadedPhotos.splice(i, 1);
    this.fuelEntryImages.splice(i, 1);
    this.toastr.success('Image Deleted Successfully!');
  }
  deleteFuelEntry(entryID) {
    this.apiService
      .deleteData('fuelEntries/' + entryID)
      .subscribe((result: any) => {
        this.toastr.success('Fuel Entry Deleted Successfully!');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      });
  }
   // delete uploaded images and documents
 delete(name: string){
  this.apiService.deleteData(`fuelEntries/uploadDelete/${this.entryID}/${name}`).subscribe((result: any) => {
    this.fetchFuelEntry();
  });
}
}

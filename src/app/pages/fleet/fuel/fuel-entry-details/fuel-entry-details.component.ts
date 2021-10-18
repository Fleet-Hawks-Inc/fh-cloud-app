import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http'
import * as _ from 'lodash';
import { HereMapService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';


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
    fuelID: '',
    billingCurrency: '',
    unitType: '',
    unitID: '',
    ppu: '',
    fuelDateTime: '',
    amountPaid: '',
    amount: '',
    quantity: '',
    retailPpu: '',
    retailAmount: '',
    fuelDate: '',
    fuelTime: '',
    fuelType: '',
    paidBy: '',
    DEFFuelQty: '',
    DEFFuelQtyAmt: '',
    fuelCardNumber: '',
    paymentMode: '',
    site: '',
    countryName: '',
    stateName: '',
    cityName: '',
    tripID: '',
    unitNo: '',
    fuelProvider: '',
    discountAmount: '',
    discountType: '',
    transactionID: '',
    unitNumber: '',
    useType: '',
    taxes: [],
    unitOfMeasure: '',
    billingCountry: '',
    category: '',
    groupCategory: '',
    carrierFee: '',
    conversionRate: '',
    reference: '',
    reimburseToDriver: false,
    deductFromPay: false,
    fuelEntryImages: [],
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
  fuelTypeWEXCode: any = {};
  fuelTypeListCode: any = {};
  WEXuseTypeCodeList: any = {};
  public fuelEntryImages = [];
  existingPhotos = [];
  tripID = '';
  image;
  timeCreated: '';
  public map;
  marker: any;
  fuelID = '';
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
  stateList: any = {};
  cityList; any = {};
  taxTypeList: any = {};
  discountList: any = {};
  driverList: any = {};
  wexCategories: any = {};
  Error = '';

  Success = '';
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService, private HereMap: HereMapService,
    private httpClient: HttpClient,
    private countryStateCity: CountryStateCityService
  ) {
  }

  ngOnInit() {
    this.fuelID = this.route.snapshot.params[`fuelID`];
    this.fetchVehicleList();
    this.fetchAssetList();
    this.fetchTripList();
    this.fetchVendorList();
    //this.fetchFuelTypeList();
    this.fetchWEXCode();
    this.fetchTaxWEXCode();
    this.fetchWEXDiscountCode();
    this.fetchWEXuseTypeCode();
    this.carrierID = this.apiService.getCarrierID();
    this.fetchWexCategories();

    // this.HereMap.mapSetAPI();
    //this.map = this.HereMap.mapInit();
    this.fetchTaxTypeFromID();
    this.fetchDiscFromID();
    this.fetchDriverList();
    this.fetchFuelEntry();

  }
  fetchWexCategories() {
    this.httpClient.get('assets/jsonFiles/fuel/wexCategories.json').subscribe((result: any) => {
      this.wexCategories = result;
    })
  }

  async fetchVehicleList() {
    await this.apiService.getData('vehicles/get/list').subscribe((result: any) => {
      this.vehicleList = result;
    });
  }
  async fetchVendorList() {

    await this.apiService.getData('vendors').subscribe(async (result: any) => {

      result.forEach(async element => {
        this.vendorList[element.contactID] = await element.companyName
      }
      );

    });
  }
  async fetchDriverList() {
    await this.apiService.getData('drivers/get/list').subscribe((result: any) => {
      this.driverList = result;
    });
  }
  async fetchTaxWEXCode() {
    await this.httpClient.get('assets/jsonFiles/fuel/wexTaxType.json').subscribe((result: any) => {
      this.WEXTaxCodeList = result;
    });
  }
  async fetchTaxTypeFromID() {
    await this.httpClient.get('assets/jsonFiles/fuel/fuelTaxes.json').subscribe((result: any) => {
      result.Items.forEach(element => {
        this.taxTypeList[element.fuelTaxID] = element.fuelTaxName
      });

    });
  }
  async fetchDiscFromID() {
    await this.httpClient.get('assets/jsonFiles/fuel/fuelDiscounts.json').subscribe((result: any) => {
      result.Items.forEach(element => {
        this.discountList[element.fuelDiscountID] = element.fuelDiscountName
      })

    });
  }
  fetchWEXDiscountCode() {
    this.httpClient.get('assets/jsonFiles/fuel/wexDiscountType.json').subscribe((result: any) => {
      this.WEXDiscountCodeList = result;
    });
  }
  fetchWEXuseTypeCode() {
    this.WEXuseTypeCodeList = {
      0: "non-fuel",
      1: "Vehicle",
      2: "Reefer product"
    }
  }
  async fetchAssetList() {
    await this.apiService.getData('assets/get/list').subscribe((result: any) => {
      this.assetList = result;
    });
  }
  // async fetchFuelTypeList() {
  //   await this.apiService.getData('fuelTypes/get/list').subscribe((result: any) => {
  //     this.fuelTypeListCode = result;
  //   });
  // }
  fetchWEXCode() {
    this.httpClient.get('assets/jsonFiles/fuel/wexFuelType.json').subscribe((result: any) => {
      result.forEach(element => {
        this.fuelTypeWEXCode[element.code] = element.name
      });
    });
  }

  async fetchTripList() {
    await this.apiService.getData('trips/get/list').subscribe((result: any) => {
      this.tripList = result;
    });
  }
  async fetchVendorData(vendorID) {
    await this.apiService.getData('vendors/' + vendorID).subscribe((result: any) => {
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
    //console.log(this.fuelID)
    this.apiService
      .getData('fuelEntries/' + this.fuelID)
      .subscribe(async (result: any) => {
        //console.log(result)




        let tax = [];

        result = result.Items[0];
        //  console.log(result.uploadedPhotos);
        if (Array.isArray(result.data.tax) && result.data.tax.length > 0) {
          // console.log(result.data.tax)
          result.data.tax.forEach(element => {
            let singleTax = {
              taxCode: element.taxCode,
              amount: element.amount
            }
            tax.push(singleTax)
          })
        }
        else {
          tax = [
            {
              taxCode: '',
              amount: 0
            }
          ]
        }

        let date: any = moment(result.data.date)
        if (result.data.time) {
          let time = moment(result.data.time, 'h mm a')
          date.set({
            hour: time.get('hour'),
            minute: time.get('minute')
          })
          date = date.format('MMM Do YYYY, h:mm a')
        }
        else {
          date = date.format('MMM Do YYYY')
        }
        this.carrierID = result.carrierID;
        this.fuelData.fuelID = this.fuelID;
        this.fuelData.billingCurrency = result.data.currency,
          this.fuelData.unitType = result.data.useType;
        this.fuelData.unitID = result.unitID;
        this.fuelData.unitNo = result.data.unitNo;
        this.fuelData.unitOfMeasure = result.data.uom;
        // this.fuelData.discountType = this.discountList[result.data.discType];
        this.fuelData.discountAmount = result.data.discAmt;
        this.fuelData.fuelCardNumber = result.data.cardNo;
        this.fuelData.ppu = result.data.ppu;
        this.fuelData.amount = result.data.amt;
        this.fuelData.retailPpu = result.data.rPpu;
        this.fuelData.retailAmount = result.data.rAmt;
        this.fuelData.fuelType = result.data.type
        this.fuelData.transactionID = result.data.transID;
        this.fuelData.fuelProvider = result.data.fuelProvider;
        this.fuelData.amountPaid = result.data.amt;
        this.fuelData.fuelDateTime = date;
        this.fuelData.paidBy = result.driverID;
        this.fuelData.fuelCardNumber = result.data.cardNo;


        this.fuelData.site = result.data.site

        this.fuelData.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(result.data.country);
        this.fuelData.stateName = result.data.city + "," + await this.countryStateCity.GetStateNameFromCode(result.data.state, result.data.country);
        this.fuelData.cityName = result.data.city;
        this.fuelData.odometer = result.data.odometer;
        this.fuelData.quantity = result.data.qty;
        this.fuelData.fuelProvider = result.data.fuelProvider;


        this.fuelData.reference = result.data.transID;


        this.fuelData.taxes = tax;

      });
  }
  deleteImage(i: number) {
    // this.carrierID =  this.apiService.getCarrierID();
    // this.awsUS.deleteFile(this.carrierID, this.fuelData.additionalDetails.uploadedPhotos[i]);
    this.fuelData.uploadedPhotos.splice(i, 1);
    this.fuelEntryImages.splice(i, 1);
    this.toastr.success('Image Deleted Successfully!');
  }
  deleteFuelEntry(fuelID) {
    this.apiService
      .deleteData('fuelEntries/' + fuelID)
      .subscribe((result: any) => {
        this.toastr.success('Fuel Entry Deleted Successfully!');
        this.router.navigateByUrl('/fleet/expenses/fuel/list');
      });
  }
  // delete uploaded images and documents
  delete(name: string) {
    this.apiService.deleteData(`fuelEntries/uploadDelete/${this.fuelID}/${name}`).subscribe(() => {
      window.location.reload();
      this.toastr.success("Image is Successfully deleted")
    });

  }
}

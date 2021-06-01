import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient} from '@angular/common/http'
import * as _ from 'lodash';
import Constants from '../../constants';
import { HereMapService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import { createAwait } from 'typescript';
import { time } from 'console';

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
  fuelID:'',
  billingCurrency:'',
  unitType:'',
  unitID:'',
  ppu:'',
  fuelDateTime:'',
  amountPaid:'',
  amount:'',
  quantity:'',
  retailPpu:'',
  retailAmount:'',
  fuelDate:'',
  fuelTime:'',
  fuelType:'',
  paidBy:'',
  DEFFuelQty:'',
  DEFFuelQtyAmt:'',
  fuelCardNumber:'',
  paymentMode:'',
  vendorID:'',
  countryName:'',
  stateName:'',
  cityName:'',
  tripID:'',
  fuelProvider:'',
  discountAmount:'',
  discountType:'',
  transactionID:'',
  unitNumber:'',
  useType:'',
  taxes:[],
  unitOfMeasure:'',
  billingCountry:'',
  category:'',
  groupCategory:'',
  carrierFee:'',
  conversionRate:'',
  reference:'',
  reimburseToDriver:false,
  deductFromPay:false,
  fuelEntryImages:[],
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
  stateList: any  = {};
  cityList; any  = {};
  taxTypeList: any = {};
  discountList: any = {};
  driverList: any  = {};
  wexCategories:any={};
  Error = '';
  
  Success = '';
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService, private HereMap: HereMapService,
    private httpClient: HttpClient,
    ) {
  }

  ngOnInit() {
    this.fuelID = this.route.snapshot.params[`fuelID`];
    this.fetchVehicleList();
    this.fetchAssetList();
    this.fetchTripList();
    this.fetchVendorList();
    //this.fetchFuelTypeList();
    this. fetchWEXCode();
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
  fetchWexCategories(){
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
    
    await this.apiService.getData('vendors').subscribe(async(result: any) => {
      
     result.forEach(async element => {
           this.vendorList[element.contactID]= await element.companyName
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
        this.taxTypeList[element.fuelTaxID]=element.fuelTaxName
      });
    
    });
  }
  async fetchDiscFromID() {
   await this.httpClient.get('assets/jsonFiles/fuel/fuelDiscounts.json').subscribe((result: any) => { 
      result.Items.forEach(element=>{
        this.discountList[element.fuelDiscountID]=element.fuelDiscountName
      })
    
    });
  }
   fetchWEXDiscountCode() {
    this.httpClient.get('assets/jsonFiles/fuel/wexDiscountType.json').subscribe((result: any) => {    
      this.WEXDiscountCodeList = result;
    });
  }
  fetchWEXuseTypeCode() {
    this.WEXuseTypeCodeList={
      0:"non-fuel",
      1:"Vehicle",
      2:"Reefer product"
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
        this.fuelTypeWEXCode[element.code]=element.name
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
      .subscribe( (result: any) => {

      //  console.log(result)
       //console.log(result)
        
        if(result.Items[0].fuelProvider=="WEX"){
          let tax=[];
          
         result = result.Items[0];
         
         if(result.tax.length>0){
         result.tax.forEach(element=>{
           
           let singleTax={
             taxCode:element.taxCode,
             taxDesc:this.WEXTaxCodeList[element.taxCode],
             taxAmount:element.amount
           }
           tax.push(singleTax)
         })
        }
        //console.log(tax);
         let date = moment(result.transactionDateTime)
         this.carrierID = result.carrierID;
         this.fuelData.fuelID = this.fuelID;
         this.fuelData.billingCountry=result.billingCountryCode,
         this.fuelData.billingCurrency = result.billingCurrency,
         this.fuelData.unitType = this.WEXuseTypeCodeList[result.useType];
         this.fuelData.unitNumber = result.unitNumber;
        this.fuelData.unitOfMeasure=result.unitOfMeasure;
        this.fuelData.discountType =this.WEXDiscountCodeList[result.discType];
        this.fuelData.discountAmount = result.discAmount;
        this.fuelData.category=this.wexCategories[result.category],
        this.fuelData.groupCategory=result.groupCategory,
        this.fuelData.carrierFee=result.carrierFee,
        this.fuelData.conversionRate=result.conversionRate,
         this.fuelData.ppu =  result.ppu;
         this.fuelData.amount= result.amount;
         this.fuelData.retailPpu=result.retailPpu;
         this.fuelData.retailAmount=result.retailAmount;
         this.fuelData.fuelType=this.fuelTypeWEXCode[result.fuelType] || "non-fuel"
         this.fuelData.transactionID=result.transactionID;
        
         this.fuelData.fuelDateTime =  date.format('MMM Do YYYY, h:mm a')
         
        
         this.fuelData.paidBy = result.driverID;
        
         this.fuelData.fuelCardNumber = result.fuelCardNumber;
        
         this.fuelData.vendorID = result.cityName;
        this.fuelData.countryName = CountryStateCity.GetSpecificCountryNameByCode(result.locationCountry);
         this.fuelData.stateName = CountryStateCity.GetStateNameFromCode(result.locationState, result.locationCountry);
         this.fuelData.cityName = result.cityName;
         this.fuelData.fuelProvider=result.fuelProvider;
         this.fuelData.tripID = result.tripID;
         this.fuelData.odometer = result.odometer;
         this.fuelData.quantity=result.quantity;
         this.fuelData.reference=result.transactionID
        //  this.fuelData.reimburseToDriver=result.reimburseToDriver || false;
        //  this.fuelData.deductFromPay=result.deductFromPay || false;
         

         this.fuelData.taxes = tax;
        
        }

        /* Manual entry Display
        */

        else if(result.Items[0].fuelProvider=="Manual"){
          let tax=[];
          
         result = result.Items[0];
        //  console.log(result.uploadedPhotos);
         if(result.taxes.length>0){
         result.taxes.forEach(element=>{
           let singleTax={
             taxCode:element.taxType,
             taxDesc:this.taxTypeList[element.taxType],
             taxAmount:element.taxAmount
           }
           tax.push(singleTax)
         })
        }

         let date = moment(result.fuelDate)
         this.carrierID = result.carrierID;
         this.fuelData.fuelID = this.fuelID;
         this.fuelData.billingCurrency = result.billingCurrency,
         this.fuelData.unitType = result.unitType;
         this.fuelData.unitNumber = result.unitID;
        this.fuelData.unitOfMeasure=result.fuelUnit;
        this.fuelData.discountType = this.discountList[result.discType];
        this.fuelData.discountAmount = result.discAmount;
        this.fuelData.DEFFuelQty=result.DEFFuelQty;
        this.fuelData.DEFFuelQtyAmt=result.DEFFuelQtyAmt
        this.fuelData.fuelCardNumber=result.fuelCardNumber;
         this.fuelData.ppu =  result.pricePerUnit;
         this.fuelData.amount= result.fuelQtyAmt;
         this.fuelData.retailPpu="";
          this.fuelData.retailAmount="";
         this.fuelData.fuelType=result.fuelType
         this.fuelData.transactionID=result.reference;
         this.fuelData.fuelProvider=result.fuelProvider;
         this.fuelData.amountPaid=result.amountPaid;
         this.fuelData.fuelDateTime =  date.format('MMM Do YYYY')+" "+ result.fuelTime
         this.fuelData.paidBy = this.driverList[result.paidBy];
         this.fuelData.fuelCardNumber = result.fuelCardNumber;
         this.fuelData.reimburseToDriver=result.reimburseToDriver || false;
         this.fuelData.deductFromPay=result.deductFromPay || false;
        
         this.fuelData.vendorID =result.vendorID
        
         this.fuelData.countryName = CountryStateCity.GetSpecificCountryNameByCode(result.countryCode);
         this.fuelData.stateName =result.cityName+","+ CountryStateCity.GetStateNameFromCode(result.stateCode, result.countryCode);
         this.fuelData.cityName = result.cityName;
         this.fuelData.tripID = result.tripID;
         this.fuelData.odometer = result.odometer;
         this.fuelData.quantity=result.fuelQty;
         this.fuelData.fuelProvider=result.fuelProvider;
         this.fuelData.uploadedPhotos=result.uploadedPhotos;
         this.fuelData.paymentMode=result.paymentMode;
         this.fuelData.reference=result.reference;
         this.fuelData.description=result.description
         if (result.uploadedPhotos !== undefined && result.uploadedPhotos.length > 0) {
          this.fuelEntryImages = result.uploadedPhotos.map(x => ({ path: `${this.Asseturl}/${result.carrierID}/${x}`, name: x }));
        }
         
         this.fuelData.taxes = tax;
        }
      });  }
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
  delete(name: string){
 this.apiService.deleteData(`fuelEntries/uploadDelete/${this.fuelID}/${name}`).subscribe(() => {
           window.location.reload();
    this.toastr.success("Image is Successfully deleted")
  });
  
}
}

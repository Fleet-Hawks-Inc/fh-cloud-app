import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import {AwsUploadService} from '../../../../services/aws-upload.service';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsService } from '../../../../services/google-maps.service';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import { environment } from '../../../../../environments/environment.prod';
import {NgbTimeStruct, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
declare var $: any;
declare var H: any;
@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.css']
})
export class AddOrdersComponent implements OnInit {
  public getOrderID;
  pageTitle = 'Add Order';
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  public searchResults1: any;
  public readonly apiKey = environment.mapConfig.apiKey;
  time: NgbTimeStruct = {hour: 13, minute: 30, second: 30};
  seconds = false;
  meridian = true;
  spinners = false;
  apiSelect = '';
  freightFee: any;
  fuelSurcharge: any;
  accessorialFee: any;
  accessorialDeduction: any;
  totalMiles: any;
  subTotal: any;
  totalAmount: any;
  discount: any;
  shipperList = [];
  receiverList = [];
  customers;
  shipperLocation;
  receiverLocation;
  mergedArray;
  getAllCords = [];
  googleCords = [];
  form;
  visibleIndex = 0;
  customerSelected;
  orderMode: string = 'FTL';
  shipperCurrent = {
    shipperName: '',
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '',
    pickupInstruction: '',
    contactPerson: '',
    phone: '',
    BOL: '',
    reference: '',
    notes: '',
    minTemprature: '',
    minTempratureUnit: '',
    maxTemprature: '',
    maxTempratureUnit: '',
    driverLoad: '',
  }
  receiverCurrent = {
    receiverName: '',
    dropOffLocation: '',
    dropOffDate: '',
    dropOffTime: '',
    dropOffInstruction: '',
    contactPerson: '',
    phone: '',
    reference: '',
    notes: '',
    minTemprature: '',
    minTempratureUnit: '',
    maxTemprature: '',
    maxTempratureUnit: '',
    driverUnload: '',
  }
  orderData = {
    shipperInfo: [],
    receiverInfo: [],
    freightDetails: {},
    additionalDetails: {},
    charges: {
      freightFee: {},
      fuelSurcharge: {},
      accessorialFee: {},
      accessorialDeduction: {}
    },
    taxesInfo: {},
    discount: {}
  };
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};

  origin;
  destination;
  allLoadTypes = [
    {name: 'hazMat'},
    {name: 'oversize load'},
    {name: 'reefer'},
    {name: 'tanker'},
  ]
  loadTypeData = [];

  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private awsUS: AwsUploadService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private google: GoogleMapsService,
    private HereMap: HereMapService,
    private route: ActivatedRoute,
    private config: NgbDatepickerConfig
  ) { 
    const current = new Date();
    config.minDate = { year: current.getFullYear(), month: 
    current.getMonth() + 1, day: current.getDate() };
    config.outsideDays = 'hidden';
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.fetchCustomers();
    this.searchLocation();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });

    this.getOrderID = this.route.snapshot.params['orderID'];
    if (this.getOrderID) {
      this.pageTitle = 'Edit Order';
      this.fetchOrderByID();
    } else {
      this.pageTitle = 'Add Order';
    }
  }
  userLocation(label) {
    console.log(label);
    this.orderData.shipperInfo['pickupLocation'] = label;
  }
  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        target = e;
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.HereMap.searchEntries(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
      this.searchResults1 = res;
    });
  }

  async saveShipper() {
    let location = this.shipperCurrent.pickupLocation;
    // if (item.hasOwnProperty('dropOffLocation')) {
    //   item.location = item.dropOffLocation;
    // }
    // console.log('location', item);
    let geoCodeResponse;
    let platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    const service = platform.getSearchService();
    let result = await service.geocode({ q: location })
    result.items.forEach((res) => {
      geoCodeResponse = res;
    });
    let currentShipper: any = {
      shipperName: this.shipperCurrent.shipperName,
      pickupLocation: this.shipperCurrent.pickupLocation,
      locationDateTime: this.shipperCurrent.pickupDate + ' ' +
        this.shipperCurrent.pickupTime['hour'] + ':' +
        this.shipperCurrent.pickupTime['minute'] + ':' +
        this.shipperCurrent.pickupTime['second'],
      pickupInstruction: this.shipperCurrent.pickupInstruction,
      contactPerson: this.shipperCurrent.contactPerson,
      phone: this.shipperCurrent.phone,
      BOL: this.shipperCurrent.BOL,
      reference: this.shipperCurrent.reference,
      notes: this.shipperCurrent.notes,
      minTemprature: this.shipperCurrent.notes,
      minTempratureUnit: this.shipperCurrent.minTempratureUnit,
      maxTemprature: this.shipperCurrent.maxTemprature,
      maxTempratureUnit: this.shipperCurrent.maxTempratureUnit,
      driverLoad: this.shipperCurrent.driverLoad,
      position: geoCodeResponse.position.lng + ',' + geoCodeResponse.position.lat
    }
    this.orderData.shipperInfo.push(currentShipper);
    this.emptyShipper();
    this.shipperReceiverMerge();
  }

  async saveReceiver() {
    let location = this.receiverCurrent.dropOffLocation;
    let geoCodeResponse;
    let platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    const service = platform.getSearchService();
    let result = await service.geocode({ q: location })
    result.items.forEach((res) => {
      geoCodeResponse = res;
    });
    let currentReceiver: any = {
      receiverName: this.receiverCurrent.receiverName,
      dropOffLocation: this.receiverCurrent.dropOffLocation,
      locationDateTime: this.receiverCurrent.dropOffDate + ' ' +
                        this.receiverCurrent.dropOffTime['hour'] + ':' +
                        this.receiverCurrent.dropOffTime['minute'] + ':' +
                        this.receiverCurrent.dropOffTime['second'],
      dropOffInstruction: this.receiverCurrent.dropOffInstruction,
      contactPerson: this.receiverCurrent.contactPerson,
      phone: this.receiverCurrent.phone,
      reference: this.receiverCurrent.reference,
      notes: this.receiverCurrent.notes,
      minTemprature: this.receiverCurrent.notes,
      minTempratureUnit: this.receiverCurrent.minTempratureUnit,
      maxTemprature: this.receiverCurrent.maxTemprature,
      maxTempratureUnit: this.receiverCurrent.maxTempratureUnit,
      driverUnload: this.receiverCurrent.driverUnload,
      position: geoCodeResponse.position.lng + ',' +  geoCodeResponse.position.lat
    }
    this.orderData.receiverInfo.push(currentReceiver);
    this.shipperReceiverMerge();
    this.emptyReceiver()
    console.log("orderData", this.orderData)
  }

  shipperReceiverMerge () {
    this.mergedArray = this.orderData.shipperInfo.concat(this.orderData.receiverInfo);
    console.log("this.orderData", this.orderData);
    console.log("mergedArray", this.mergedArray);
    this.mergedArray.sort((a, b) => {
      return new Date(a.locationDateTime).valueOf() - new Date(b.locationDateTime).valueOf();
    });
  }

  emptyShipper() {
    this.shipperCurrent.shipperName = '';
    this.shipperCurrent.shipperName = '';
    this.shipperCurrent.pickupLocation = '';
    this.shipperCurrent.pickupDate = '';
    this.shipperCurrent.pickupInstruction = '';
    this.shipperCurrent.contactPerson = '';
    this.shipperCurrent.phone = '';
    this.shipperCurrent.BOL = '';
    this.shipperCurrent.reference = '';
    this.shipperCurrent.notes = '';
    this.shipperCurrent.notes = '';
    this.shipperCurrent.minTempratureUnit = '';
    this.shipperCurrent.maxTemprature = '';
    this.shipperCurrent.maxTempratureUnit = '';
    this.shipperCurrent.driverLoad = '';
  }

  emptyReceiver() {
    this.receiverCurrent.receiverName = '';
    this.receiverCurrent.dropOffLocation = '';
    this.receiverCurrent.dropOffDate = '';
    this.receiverCurrent.dropOffInstruction = '';
    this.receiverCurrent.contactPerson = '';
    this.receiverCurrent.phone = '';
    this.receiverCurrent.reference = '';
    this.receiverCurrent.notes = '';
    this.receiverCurrent.notes = '';
    this.receiverCurrent.minTempratureUnit = '';
    this.receiverCurrent.maxTemprature = '';
    this.receiverCurrent.maxTempratureUnit = '';
    this.receiverCurrent.driverUnload = '';
  }

  /*
   * Get all customers from api
   */
  fetchCustomers() {
    this.apiService.getData('customers').subscribe((result: any) => {
      this.customers = result.Items;
      console.log('customers', this.customers);
    });
  }
  onItemChange(value) {
    if (this.mergedArray) {
      this.mergedArray.forEach(element => {
        this.getAllCords.push(element.position);
      });
    }
    console.log("getAllCords", this.getAllCords);
    if (value === 'google') {
      this.mergedArray.forEach(element => {
        let cords = element.position.split(',');
        this.googleCords.push(`${cords[1]},${cords[0]}`);
      });

      if (this.googleCords.length === 2) {
        this.origin = this.googleCords[0];
        this.destination = this.googleCords[1];
      } else {
        this.origin = this.googleCords[0];
        this.destination = this.googleCords.shift();
        console.log("googleCords", this.googleCords);
        console.log("origin", this.origin);
        console.log("destination", this.destination);
      }
      
      this.google.googleDistance([this.origin], [this.googleCords.join('|')]).subscribe(res => {
        console.log("google res", res);
        this.orderData['totalMiles'] =  res;
      }, err => {
        console.log('google res', err);
      });
    } else if (value === 'pcmiles') {
      this.google.pcMiles.next(true);
      this.google.pcMilesDistance(this.getAllCords.join(';')).subscribe(res => {
        this.orderData['totalMiles'] =  res;
      }, err => {
        console.log('pc res', err);
      });
    } else {
      this.orderData['totalMiles'] =  '';
    }
    this.getAllCords = [];
 }

  selectedCustomer(customerID) {
    console.log('customer', customerID);
    this.apiService.getData(`customers/${customerID}`).subscribe((result: any) => {
      this.customerSelected = result.Items;
      console.log('customer', this.customerSelected);
    });
  }

  addShipper() {
    this.orderData.shipperInfo.push({
      shipperName: '',
      pickupLocation: '',
      pickupDate: '',
      pickupTime: '',
      pickupInstruction: '',
      contactPerson: '',
      phone: '',
      BOL: '',
      reference: '',
      notes: '',
      minTemprature: '',
      minTempratureUnit: '',
      maxTemprature: '',
      maxTempratureUnit: '',
      driverLoad: '',
    })
    console.log(this.orderData)
  }

  addReceiver() {
    this.orderData.receiverInfo.push({
      receiverName: '',
      dropOffLocation: '',
      dropOffDate: '',
      dropOffTime: '',
      dropOffInstruction: '',
      contactPerson: '',
      phone: '',
      reference: '',
      notes: '',
      minTemprature: '',
      minTempratureUnit: '',
      maxTemprature: '',
      maxTempratureUnit: '',
      driverUnload: '',
    })
    console.log(this.orderData)
  }

  toggleAccordian(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }
  

  
  onSubmit() {
    console.log("order", this.orderData);
    this.apiService.postData('orders', this.orderData).
    subscribe({
      complete : () => {},
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/'.*'/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.spinner.hide(); // loader hide
              this.throwErrors();
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.Success = 'Order Added successfully';
      }
    });
  }
  throwErrors() {
    this.form.showErrors(this.errors);
  }

  remove(data, i ){
    if(data === 'shipper') {
      this.orderData.shipperInfo.splice(i, 1);
    } else {
      this.orderData.receiverInfo.splice(i, 1);
    }
  }

  taxCalculate(value) {
    console.log(value);
  }
  amountCalculate() {
    if(this.orderData.charges.freightFee['amount'] !== '' && this.orderData.charges.freightFee['amount'] !== undefined){
      this.freightFee = `${this.orderData.charges.freightFee['amount']}`;
    } else {
      this.freightFee = 0;
    }
    if(this.orderData.charges.fuelSurcharge['amount'] !== '' && this.orderData.charges.fuelSurcharge['amount'] !== undefined){
      this.fuelSurcharge = `${this.orderData.charges.fuelSurcharge['amount']}`;
    } else {
      this.fuelSurcharge = 0;
    }
    if(this.orderData.charges.accessorialFee['amount'] !== '' && this.orderData.charges.accessorialFee['amount'] !== undefined){
      this.accessorialFee = `${this.orderData.charges.accessorialFee['amount']}`;
    } else {
      this.accessorialFee = 0;
    }
    if(this.orderData.charges.accessorialDeduction['amount'] !== '' && this.orderData.charges.accessorialDeduction['amount'] !== undefined){
      this.accessorialDeduction = `${this.orderData.charges.accessorialDeduction['amount']}`;
    } else {
      this.accessorialDeduction = 0;
    }
    this.subTotal = parseFloat(this.freightFee) + parseFloat(this.fuelSurcharge) 
                    + parseFloat(this.accessorialFee) - parseFloat(this.accessorialDeduction);
  }

  getLoadTypes(i, value: string, isChecked: boolean) {
    if (isChecked) {
      if(this.loadTypeData.indexOf(value) !== -1) {}
      else {
        this.loadTypeData.push(value);
        this.orderData.additionalDetails['loadType'] = this.loadTypeData;
      }
    } else {
      this.loadTypeData.splice(i , 1);
    }
  }

  removeList(elem, i) {
    if (elem === 'shipper') {
      this.orderData.shipperInfo.splice(i, 1);
    } else {
      this.orderData.receiverInfo.splice(i, 1);
    }
  }

  discountCalculate(){
    let discountUnit = this.orderData.discount['unit'];
    let discountAmount = this.orderData.discount['amount'];
    if (this.subTotal) {
      if (discountUnit === 'percentage') {
        this.discount = discountAmount;
        this.totalAmount = this.subTotal - (this.subTotal * this.discount / 100);
      } else {
        this.discount = discountAmount;
        this.totalAmount = this.subTotal - discountAmount;
      }
    }
  }

  assignLocation(elem, label) {
    if (elem === 'shipper') {
      this.shipperCurrent.pickupLocation = label;
    } else {
      this.receiverCurrent.dropOffLocation = label;
      console.log(this.receiverCurrent.dropOffLocation);
      console.log("orders", this.orderData);
    }
    this.searchResults = false;
  }

  editList(elem, item, i) {
    if (elem === 'shipper') {
      let index = this.orderData.shipperInfo.indexOf(item);
      console.log("index", index);
      this.shipperCurrent.shipperName = item.shipperName;
      this.shipperCurrent.pickupLocation = item.pickupLocation;
      this.shipperCurrent.pickupDate = item.pickupDate;
      this.shipperCurrent.pickupInstruction = item.pickupInstruction;
      this.shipperCurrent.contactPerson = item.contactPerson;
      this.shipperCurrent.phone = item.phone;
      this.shipperCurrent.BOL = item.BOL;
      this.shipperCurrent.reference = item.reference;
      this.shipperCurrent.notes = item.notes;
      this.shipperCurrent.minTempratureUnit = item.minTempratureUnit;
      this.shipperCurrent.maxTemprature = item.maxTemprature;
      this.shipperCurrent.maxTempratureUnit = item.maxTempratureUnit;
      this.shipperCurrent.driverLoad = item.driverLoad;
      this.visibleIndex = i;
    }
  }




  /***************
   * For Edit Orders
  */
 fetchOrderByID(){
  this.apiService
  .getData('orders/' + this.getOrderID)
  .subscribe((result: any) => {
    result = result.Items[0];
    console.log(result);
    this.orderData['customerID'] = result.customerID;
    this.orderData['additionalContact'] = result.additionalContact;
    this.orderData['creationDate'] = result.creationDate;
    this.orderData['csa'] = result.csa;
    this.orderData['ctpat'] = result.ctpat;
    this.orderData['customerPO'] = result.customerPO;
    this.orderData['email'] = result.email;
    this.orderData['orderMode'] = result.orderMode;
    this.orderData['orderNumber'] = result.orderNumber;
    this.orderData['phone'] = result.phone;
    this.orderData['reference'] = result.reference;
    this.orderData['remarks'] = result.remarks;
    this.orderData['totalMiles'] = result.totalMiles;
    this.orderData['tripType'] = result.tripType;

    this.orderData.additionalDetails['dropTrailer'] = result.additionalDetails.dropTrailer;
    this.loadTypeData = result.additionalDetails.loadType;
    
    this.orderData.charges.accessorialDeduction['amount'] = result.charges.accessorialDeduction.amount;
    this.orderData.charges.accessorialDeduction['type'] = result.charges.accessorialDeduction.type;
    this.orderData.charges.accessorialDeduction['unit'] = result.charges.accessorialDeduction.unit;
    this.orderData.charges.accessorialFee['amount'] = result.charges.accessorialFee.amount;
    this.orderData.charges.accessorialFee['currency'] = result.charges.accessorialFee.currency;
    this.orderData.charges.accessorialFee['type'] = result.charges.accessorialFee.type;
    this.orderData.charges.freightFee['amount'] = result.charges.freightFee.amount;
    this.orderData.charges.freightFee['currency'] = result.charges.freightFee.currency;
    this.orderData.charges.freightFee['type'] = result.charges.freightFee.type;
    this.orderData.charges.fuelSurcharge['amount'] = result.charges.fuelSurcharge.amount;
    this.orderData.charges.fuelSurcharge['currency'] = result.charges.fuelSurcharge.currency;
    this.orderData.charges.fuelSurcharge['type'] = result.charges.fuelSurcharge.type;

    this.amountCalculate();
    this.discountCalculate();
    
  });
 }
}

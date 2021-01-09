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
import { NgForm } from '@angular/forms';
declare var $: any;
declare var H: any;
@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.css']
})
export class AddOrdersComponent implements OnInit {
  public getOrderID;
  orderForm: NgForm;
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
  freightFee: any = 0;
  fuelSurcharge: any = 0;
  accessorialFee: any = 0;
  accessorialDeduction: any = 0;
  totalMiles: any;
  subTotal: any;
  totalAmount: any;
  discount: any = 0;
  shipperList = [];
  receiverList = [];
  
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
    shipperID: '',
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
    receiverID: '',
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
    orderMode: 'FTL',
    tripType: 'Regular',
    shippersReceiversInfo: [],
    freightDetails: {},
    additionalDetails: {},
    charges: {
      freightFee: {},
      fuelSurcharge: {},
      accessorialFee: [],
      accessorialDeduction: {}
    },
    taxesInfo: {},
    discount: {},
    milesInfo: {}
  };
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};

  origin: any;
  destination: any;
  allLoadTypes = [
    {name: 'hazMat'},
    {name: 'oversize load'},
    {name: 'reefer'},
    {name: 'tanker'},
  ]
  loadTypeData = [];
  
  shippersReceivers = [{
    shippers: {
      shipperID: '',
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
    },
    receivers: {
      receiverID: '',
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
  }];

  accessFees = [{
      type: '',
      amount: '',
      currency: ''
  }];

  accessDeduction = [{
    type: '',
    amount: '',
    currency: ''
  }]
  customers = [];
  shippers = [];
  receivers = [];
  finalShippersReceivers = [{
    shippers: [],
    receivers: []
  }];

  shippersObjects: any = {};
  receiversObjects: any = {};
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
    this.fetchShippers();
    this.fetchReceivers();
    this.searchLocation();
    this.fetchShippersByIDs();
    this.fetchReceiversByIDs();
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
  // userLocation(label) {
  //   console.log(label);
  //   this.orderData.shipperInfo['pickupLocation'] = label;
  // }
  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
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

  async saveShipper(i) {
    
    let location = this.shippersReceivers[i].shippers.pickupLocation;
    
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
      shipperID: this.shippersReceivers[i].shippers.shipperID,
      pickupLocation: this.shippersReceivers[i].shippers.pickupLocation,
      locationDateTime: this.shippersReceivers[i].shippers.pickupDate + ' ' +
        this.shippersReceivers[i].shippers.pickupTime['hour'] + ':' +
        this.shippersReceivers[i].shippers.pickupTime['minute'] + ':' +
        this.shippersReceivers[i].shippers.pickupTime['second'],
      pickupInstruction: this.shippersReceivers[i].shippers.pickupInstruction,
      contactPerson: this.shippersReceivers[i].shippers.contactPerson,
      phone: this.shippersReceivers[i].shippers.phone,
      BOL: this.shippersReceivers[i].shippers.BOL,
      reference: this.shippersReceivers[i].shippers.reference,
      notes: this.shippersReceivers[i].shippers.notes,
      minTemprature: this.shippersReceivers[i].shippers.notes,
      minTempratureUnit: this.shippersReceivers[i].shippers.minTempratureUnit,
      maxTemprature: this.shippersReceivers[i].shippers.maxTemprature,
      maxTempratureUnit: this.shippersReceivers[i].shippers.maxTempratureUnit,
      driverLoad: this.shippersReceivers[i].shippers.driverLoad,
      position: geoCodeResponse.position.lng + ',' + geoCodeResponse.position.lat
    }
    // this.orderData.shipperInfo.push(currentShipper);
    if(this.finalShippersReceivers[i] == undefined) {
      this.finalShippersReceivers[i].shippers = [];
    } else if(this.finalShippersReceivers[i].shippers == undefined) {
      this.finalShippersReceivers[i].shippers = [];
    }
    this.finalShippersReceivers[i].shippers.push(currentShipper);
    console.log('finalShippersReceivers', this.finalShippersReceivers)
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.emptyShipper();
    this.shipperReceiverMerge();
  }

  async saveReceiver(i) {
    let location = this.shippersReceivers[i].receivers.dropOffLocation;
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
      receiverID: this.shippersReceivers[i].receivers.receiverID,
      dropOffLocation: this.shippersReceivers[i].receivers.dropOffLocation,
      locationDateTime: this.shippersReceivers[i].receivers.dropOffDate + ' ' +
                        this.shippersReceivers[i].receivers.dropOffTime['hour'] + ':' +
                        this.shippersReceivers[i].receivers.dropOffTime['minute'] + ':' +
                        this.shippersReceivers[i].receivers.dropOffTime['second'],
      dropOffInstruction: this.shippersReceivers[i].receivers.dropOffInstruction,
      contactPerson: this.shippersReceivers[i].receivers.contactPerson,
      phone: this.shippersReceivers[i].receivers.phone,
      reference: this.shippersReceivers[i].receivers.reference,
      notes: this.shippersReceivers[i].receivers.notes,
      minTemprature: this.shippersReceivers[i].receivers.notes,
      minTempratureUnit: this.shippersReceivers[i].receivers.minTempratureUnit,
      maxTemprature: this.shippersReceivers[i].receivers.maxTemprature,
      maxTempratureUnit: this.shippersReceivers[i].receivers.maxTempratureUnit,
      driverUnload: this.shippersReceivers[i].receivers.driverUnload,
      position: geoCodeResponse.position.lng + ',' +  geoCodeResponse.position.lat
    }
    // this.orderData.receiverInfo.push(currentReceiver);
    if(this.finalShippersReceivers[i] == undefined) {
      console.log("first")
      this.finalShippersReceivers[i].receivers = [];
    } 
    if(this.finalShippersReceivers[i].receivers == undefined) {
      console.log("second")
      this.finalShippersReceivers[i].receivers = [];
    }
    this.finalShippersReceivers[i].receivers.push(currentReceiver);
    console.log('finalShippersReceivers', this.finalShippersReceivers)
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.shipperReceiverMerge();
    // this.emptyReceiver()
   
  }

  shipperReceiverMerge () {
    this.mergedArray = this.finalShippersReceivers[0].shippers.concat(this.finalShippersReceivers[0].receivers);
    //console.log("this.orderData", this.orderData);
    console.log("mergedArray", this.mergedArray);
    this.mergedArray.sort((a, b) => {
      return new Date(a.locationDateTime).valueOf() - new Date(b.locationDateTime).valueOf();
    });
  }

  emptyShipper() {
    this.shipperCurrent.shipperID = '';
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
    this.receiverCurrent.receiverID = '';
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

  /*
   * Get all shippers's IDs of names from api
   */
  fetchShippersByIDs() {
    this.apiService.getData('shippers/get/list').subscribe((result: any) => {
      this.shippersObjects = result;
      console.log('shippersObjects', this.shippersObjects);
    });
  }
  /*
   * Get all Shippers from api
   */
  fetchShippers() {
    this.apiService.getData('shippers').subscribe((result: any) => {
      this.shippers = result.Items;
      console.log('shippers', this.shippers);
    });
  }

  /*
   * Get all receivers's IDs of names from api
   */
  fetchReceiversByIDs() {
    this.apiService.getData('receivers/get/list').subscribe((result: any) => {
      this.receiversObjects = result;
      console.log('receiversObjects', this.receiversObjects);
    });
  }

  /*
   * Get all Receivers from api
   */
  fetchReceivers() {
    this.apiService.getData('receivers').subscribe((result: any) => {
      this.receivers = result.Items;
      console.log('receivers', this.receivers);
    });
  }
  getMiles(value) {
    console.log('calculateBy', value);
    this.orderData.milesInfo['calculateBy'] = value;
    if (this.mergedArray) {
      this.mergedArray.forEach(element => {
        this.getAllCords.push(element.position);
      });
    }
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
      }
      
      this.google.googleDistance([this.origin], [this.googleCords.join('|')]).subscribe(res => {
        console.log('res', res);
        this.orderData.milesInfo['totalMiles'] =  res;
      });
    } else if (value === 'pcmiles') {
      this.google.pcMiles.next(true);
      this.google.pcMilesDistance(this.getAllCords.join(';')).subscribe(res => {
        console.log('res', res);
        this.orderData.milesInfo['totalMiles'] =  res;
      });
    } else {
      this.orderData.milesInfo['totalMiles'] =  '';
    }
    this.getAllCords = [];
 }

  selectedCustomer(customerID: any) {
    this.apiService.getData(`customers/${customerID}`).subscribe((result: any) => {
      this.customerSelected = result.Items;
      console.log('customer', this.customerSelected);
    });
  }

  addShipper() {
    // this.orderData.shipperInfo.push({
    //   shipperID: '',
    //   pickupLocation: '',
    //   pickupDate: '',
    //   pickupTime: '',
    //   pickupInstruction: '',
    //   contactPerson: '',
    //   phone: '',
    //   BOL: '',
    //   reference: '',
    //   notes: '',
    //   minTemprature: '',
    //   minTempratureUnit: '',
    //   maxTemprature: '',
    //   maxTempratureUnit: '',
    //   driverLoad: '',
    // })
    // console.log(this.orderData)
  }

  addReceiver() {
    // this.orderData.receiverInfo.push({
    //   receiverID: '',
    //   dropOffLocation: '',
    //   dropOffDate: '',
    //   dropOffTime: '',
    //   dropOffInstruction: '',
    //   contactPerson: '',
    //   phone: '',
    //   reference: '',
    //   notes: '',
    //   minTemprature: '',
    //   minTempratureUnit: '',
    //   maxTemprature: '',
    //   maxTempratureUnit: '',
    //   driverUnload: '',
    // })
    // console.log(this.orderData)
  }

  toggleAccordian(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }
  

  onChangeUnitType(type: string, value: any) {
    if(type === 'order') {
      this.orderData['orderMode'] = value;
    } else {
      this.orderData['tripType'] = value;
    }
  }

  checkTrailer(value: boolean) {
    if (value) {
      this.orderData.additionalDetails['trailerType'] = '';
    }
  }

  
  onSubmit() {
    console.log("order", this.orderData);
    this.hideErrors();
    if(this.orderForm.valid) {
      return;
      this.apiService.postData('orders', this.orderData).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.label] = val.message;
              })
            )
            .subscribe({
              complete: () => {
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
    
  }
  
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error')
      });
    // this.vehicleForm.showErrors(this.errors);
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  remove(data, i ){
    if(data === 'shipper') {
      // this.orderData.shipperInfo.splice(i, 1);
    } else {
      // this.orderData.receiverInfo.splice(i, 1);
    }
  }

  taxCalculate(value) {
    console.log(value);
  }
  amountCalculate(i) {
    
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
      // this.orderData.shipperInfo.splice(i, 1);
    } else {
      // this.orderData.receiverInfo.splice(i, 1);
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

  assignLocation(i, elem, label) {
    if (elem === 'shipper') {
      this.shippersReceivers[i].shippers.pickupLocation = label;
    } else {
      this.shippersReceivers[i].receivers.dropOffLocation = label;
      // console.log(this.receiverCurrent.dropOffLocation);
      console.log("orders", this.orderData);
    }
    $('div').removeClass('show-search__result');
    // this.searchResults = false;
  }

  editList(elem, item, i) {
    if (elem === 'shipper') {
      // let index = this.orderData.shipperInfo.indexOf(item);
      // console.log("index", index);
      this.shipperCurrent.shipperID = item.shipperID;
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
    this.orderData.milesInfo['totalMiles'] = result.totalMiles;
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

    // this.amountCalculate();
    this.discountCalculate();
    
  });
 }

 addAccordian() {
   let allFields = {
    shippers: {
      shipperID: '',
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
    },
    receivers: {
      receiverID: '',
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
  }
  this.shippersReceivers.push(allFields)
  this.finalShippersReceivers.push({
    shippers: [],
    receivers: []
  })

 }

 removeAccordian() {
   this.shippersReceivers.splice(-1, 1);
 }

 addAccessFee(value: string) {
   if(value === 'accessFee') {
      this.accessFees.push({
        type: '',
        amount: '',
        currency: ''
    })
   } else {
    this.accessDeduction.push({
        type: '',
        amount: '',
        currency: ''
    })
   }
  
    console.log("accesssFee", this.accessFees);
    console.log("accessDeduction", this.accessDeduction);
 }

}

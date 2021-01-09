import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import { AwsUploadService } from '../../../../services/aws-upload.service';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsService } from '../../../../services/google-maps.service';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import { environment } from '../../../../../environments/environment.prod';
import { NgbTimeStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
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
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  seconds = false;
  meridian = true;
  spinners = false;
  apiSelect = '';
  freightFee: any = 0;
  fuelSurcharge: any = 0;
  accessorialFee: any = 0;
  accessorialDeduction: any = 0;
  totalMiles: any = 0;
  subTotal: any = 0;
  totalAmount: any = 0;
  discount: any = 0;
  tax: any = 0;
  shipperList = [];
  receiverList = [];

  shipperLocation;
  receiverLocation;
  mergedArray = [];
  getAllCords = [];
  googleCords = [];
  form;
  visibleIndex = 0;
  customerSelected;
  orderMode: string = 'FTL';

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
    taxesInfo: [
      {
        name: 'GST',
        amount: '5'
      },
      {
        name: 'PST',
        amount: '5'
      },
      {
        name: 'HST',
        amount: '0'
      },
    ],
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
    { name: 'hazMat' },
    { name: 'oversize load' },
    { name: 'reefer' },
    { name: 'tanker' },
  ]
  loadTypeData = [];

  showUpdate: boolean = false;
  shippersReceivers = [{
    shippers: {
      shipperID: '',
      pickupLocation: '',
      pickupDate: '',
      pickupTime: '',
      pickupInstruction: '',
      contactPerson: '',
      phone: '',
      reference: '',
      notes: '',
      commodity: [{
        name: '',
        quantity: '',
        quantityUnit: '',
        weight: '',
        weightUnit: '',
      }],
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
      commodity: [{
        name: '',
        quantity: '',
        quantityUnit: '',
        weight: '',
        weightUnit: '',
      }],
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

  accessDeductions = [{
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
  singleDatePickerOptions;

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
    config.minDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
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

      this.timpickerInit();
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
  timpickerInit() {
   
  }
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
    if (location !== '') {
      let result = await service.geocode({ q: location });
      result.items.forEach((res) => {
        geoCodeResponse = res;
      });
    }

    
    let currentShipper: any = {
      shipperID: this.shippersReceivers[i].shippers.shipperID,
      pickupLocation: this.shippersReceivers[i].shippers.pickupLocation,
      dateAndTime: this.shippersReceivers[i].shippers.pickupDate + ' ' +
        this.shippersReceivers[i].shippers.pickupTime,
      pickupInstruction: this.shippersReceivers[i].shippers.pickupInstruction,
      contactPerson: this.shippersReceivers[i].shippers.contactPerson,
      phone: this.shippersReceivers[i].shippers.phone,
      // BOL: this.shippersReceivers[i].shippers.BOL,
      reference: this.shippersReceivers[i].shippers.reference,
      notes: this.shippersReceivers[i].shippers.notes,
      commodity: this.shippersReceivers[i].shippers.commodity,
      minTemprature: this.shippersReceivers[i].shippers.notes,
      minTempratureUnit: this.shippersReceivers[i].shippers.minTempratureUnit,
      maxTemprature: this.shippersReceivers[i].shippers.maxTemprature,
      maxTempratureUnit: this.shippersReceivers[i].shippers.maxTempratureUnit,
      driverLoad: this.shippersReceivers[i].shippers.driverLoad,
      position: geoCodeResponse.position.lng + ',' + geoCodeResponse.position.lat
    }
    // this.orderData.shipperInfo.push(currentShipper);
    if (this.finalShippersReceivers[i] == undefined) {
      this.finalShippersReceivers[i].shippers = [];
    } else if (this.finalShippersReceivers[i].shippers == undefined) {
      this.finalShippersReceivers[i].shippers = [];
    }
    this.finalShippersReceivers[i].shippers.push(currentShipper);
    
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.emptyShipper(i);
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
      dateAndTime: this.shippersReceivers[i].receivers.dropOffDate + ' ' +
        this.shippersReceivers[i].receivers.dropOffTime,
      dropOffInstruction: this.shippersReceivers[i].receivers.dropOffInstruction,
      contactPerson: this.shippersReceivers[i].receivers.contactPerson,
      phone: this.shippersReceivers[i].receivers.phone,
      reference: this.shippersReceivers[i].receivers.reference,
      notes: this.shippersReceivers[i].receivers.notes,
      commodity: this.shippersReceivers[i].receivers.commodity,
      minTemprature: this.shippersReceivers[i].receivers.notes,
      minTempratureUnit: this.shippersReceivers[i].receivers.minTempratureUnit,
      maxTemprature: this.shippersReceivers[i].receivers.maxTemprature,
      maxTempratureUnit: this.shippersReceivers[i].receivers.maxTempratureUnit,
      driverUnload: this.shippersReceivers[i].receivers.driverUnload,
      position: geoCodeResponse.position.lng + ',' + geoCodeResponse.position.lat
    }
    // this.orderData.receiverInfo.push(currentReceiver);
    if (this.finalShippersReceivers[i] == undefined) {
      this.finalShippersReceivers[i].receivers = [];
    }
    if (this.finalShippersReceivers[i].receivers == undefined) {
      this.finalShippersReceivers[i].receivers = [];
    }
    this.finalShippersReceivers[i].receivers.push(currentReceiver);
    
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    this.shipperReceiverMerge();
    this.emptyShipper(i);

  }

  shipperReceiverMerge() {
    this.mergedArray = [];
    this.finalShippersReceivers.forEach(item => {
        item.shippers.forEach(elem => {
          this.mergedArray.push(elem)
        });
        item.receivers.forEach(elem => {
          this.mergedArray.push(elem)
        });
    })
    // this.mergedArray = this.finalShippersReceivers[0].shippers.concat(this.finalShippersReceivers[0].receivers);
    //console.log("this.orderData", this.orderData);
    this.mergedArray.sort((a, b) => {
     return new Date(a.dateAndTime).valueOf() - new Date(b.dateAndTime).valueOf();
    });
    
  }

  emptyShipper(i) {
    this.shippersReceivers[i].shippers['shipperID'] = '';
    this.shippersReceivers[i].shippers['pickupLocation'] = '';
    this.shippersReceivers[i].shippers['pickupDate'] = '';
    this.shippersReceivers[i].shippers['pickupTime'] = '';
    this.shippersReceivers[i].shippers['pickupInstruction'] = '';
    this.shippersReceivers[i].shippers['contactPerson'] = '';
    this.shippersReceivers[i].shippers['phone'] = '';
    this.shippersReceivers[i].shippers['BOL'] = '';
    this.shippersReceivers[i].shippers['reference'] = '';
    this.shippersReceivers[i].shippers['notes'] = '';
    this.shippersReceivers[i].shippers['notes'] = '';
    this.shippersReceivers[i].shippers['minTempratureUnit'] = '';
    this.shippersReceivers[i].shippers['maxTemprature'] = '';
    this.shippersReceivers[i].shippers['maxTempratureUnit'] = '';
    this.shippersReceivers[i].shippers['driverLoad'] = '';
  }

  emptyReceiver(i) {
    this.shippersReceivers[i].receivers['receiverID'] = '';
    this.shippersReceivers[i].receivers['dropOffLocation'] = '';
    this.shippersReceivers[i].receivers['dropOffDate'] = '';
    this.shippersReceivers[i].receivers['dropOffInstruction'] = '';
    this.shippersReceivers[i].receivers['contactPerson'] = '';
    this.shippersReceivers[i].receivers['phone'] = '';
    this.shippersReceivers[i].receivers['reference'] = '';
    this.shippersReceivers[i].receivers['notes'] = '';
    this.shippersReceivers[i].receivers['notes'] = '';
    this.shippersReceivers[i].receivers['minTempratureUnit'] = '';
    this.shippersReceivers[i].receivers['maxTemprature'] = '';
    this.shippersReceivers[i].receivers['maxTempratureUnit'] = '';
    this.shippersReceivers[i].receivers['driverUnload'] = '';
  }

  /*
   * Get all customers from api
   */
  fetchCustomers() {
    this.apiService.getData('customers').subscribe((result: any) => {
      this.customers = result.Items;
    });
  }

  /*
   * Get all shippers's IDs of names from api
   */
  fetchShippersByIDs() {
    this.apiService.getData('shippers/get/list').subscribe((result: any) => {
      this.shippersObjects = result;
    });
  }
  /*
   * Get all Shippers from api
   */
  fetchShippers() {
    this.apiService.getData('shippers').subscribe((result: any) => {
      this.shippers = result.Items;
    });
  }

  /*
   * Get all receivers's IDs of names from api
   */
  fetchReceiversByIDs() {
    this.apiService.getData('receivers/get/list').subscribe((result: any) => {
      this.receiversObjects = result;
    });
  }

  /*
   * Get all Receivers from api
   */
  fetchReceivers() {
    this.apiService.getData('receivers').subscribe((result: any) => {
      this.receivers = result.Items;
    });
  }

  getTimeFormat(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  getMiles(value) {
    this.orderData.milesInfo['calculateBy'] = value;
    
    if (this.mergedArray !== undefined) {
      this.mergedArray.forEach(element => {
        this.getAllCords.push(element.position);
      });
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
          
          this.orderData.milesInfo['totalMiles'] = res;
        });
      } else if (value === 'pcmiles') {
        this.google.pcMiles.next(true);
        this.google.pcMilesDistance(this.getAllCords.join(';')).subscribe(res => {
          
          this.orderData.milesInfo['totalMiles'] = res;
        });
      } else {
        this.orderData.milesInfo['totalMiles'] = '';
      }
      this.getAllCords = [];
    }
  }

  selectedCustomer(customerID: any) {
    this.apiService.getData(`customers/${customerID}`).subscribe((result: any) => {
      this.customerSelected = result.Items;
    });
  }

  addCommodity(arr, parentIndex) {
    
    if(arr === 'shipper') {
      this.shippersReceivers[parentIndex].shippers.commodity.push(
        {
          name: '',
          quantity: '',
          quantityUnit: '',
          weight: '',
          weightUnit: '',
        }
      )
    } else {
      this.shippersReceivers[parentIndex].receivers.commodity.push(
        {
          name: '',
          quantity: '',
          quantityUnit: '',
          weight: '',
          weightUnit: '',
        }
      )
    }
  }

  removeCommodity(obj: string, parentIndex:number, i: number) {
    
    if (obj === 'shipper') {
      this.shippersReceivers[parentIndex].shippers.commodity.splice(i, 1);
    } else {
      this.shippersReceivers[parentIndex].receivers.commodity.splice(i, 1);
    }
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
    setTimeout(() => {
      this.timpickerInit();
    }, 200);
  }


  onChangeUnitType(type: string, value: any) {
    if (type === 'order') {
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
    if (this.orderForm.valid) {
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

  remove(data, i) {
    if (data === 'shipper') {
      // this.orderData.shipperInfo.splice(i, 1);
    } else {
      // this.orderData.receiverInfo.splice(i, 1);
    }
  }

  taxCalculate(value) {
    console.log(value);
  }
  calculateAmount() {
    this.freightFee = this.orderData.charges.freightFee['amount'];
    this.fuelSurcharge = this.orderData.charges.fuelSurcharge['amount'];
    let sum = 0;
    console.log('accessFees', this.accessFees)
    this.accessFees.forEach(item => {
      console.log('item', item.amount)
      sum += (parseFloat(item.amount) || 0);
    })

    this.accessDeductions.forEach(item => {
      sum -= (parseFloat(item.amount) || 0);
    })

    sum += (parseFloat(this.freightFee) || 0) + (parseFloat(this.fuelSurcharge) || 0);
    console.log('subTotal', sum)
    this.subTotal = sum;

    let totalTax = 0; 
    this.orderData.taxesInfo.forEach(elem => {
      totalTax += ( parseFloat(elem.amount) || 0)
    })
    
    this.tax = ( this.subTotal * totalTax ) / 100;

    let discountAmount = (parseFloat(this.orderData.discount['amount']) || 0 );
    let discountUnit = this.orderData.discount['unit'];
    if(discountUnit === 'percentage') {
      this.discount = (this.subTotal * discountAmount ) / 100;
    }
    this.totalAmount = this.subTotal - this.discount - this.tax;
    console.log('totalTax', totalTax)
    // if (this.orderData.charges.freightFee['amount'] !== '' && this.orderData.charges.freightFee['amount'] !== undefined) {
    //   this.freightFee = `${this.orderData.charges.freightFee['amount']}`;
    // } else {
    //   this.freightFee = 0;
    // }
    // if (this.orderData.charges.fuelSurcharge['amount'] !== '' && this.orderData.charges.fuelSurcharge['amount'] !== undefined) {
    //   this.fuelSurcharge = `${this.orderData.charges.fuelSurcharge['amount']}`;
    // } else {
    //   this.fuelSurcharge = 0;
    // }
    // if (this.orderData.charges.accessorialFee['amount'] !== '' && this.orderData.charges.accessorialFee['amount'] !== undefined) {
    //   this.accessorialFee = `${this.orderData.charges.accessorialFee['amount']}`;
    // } else {
    //   this.accessorialFee = 0;
    // }
    // if (this.orderData.charges.accessorialDeduction['amount'] !== '' && this.orderData.charges.accessorialDeduction['amount'] !== undefined) {
    //   this.accessorialDeduction = `${this.orderData.charges.accessorialDeduction['amount']}`;
    // } else {
    //   this.accessorialDeduction = 0;
    // }
    // this.subTotal = parseFloat(this.freightFee) + parseFloat(this.fuelSurcharge)
    //   + parseFloat(this.accessorialFee) - parseFloat(this.accessorialDeduction);
  }

  getLoadTypes(i, value: string, isChecked: boolean) {
    if (isChecked) {
      if (this.loadTypeData.indexOf(value) !== -1) { }
      else {
        this.loadTypeData.push(value);
        this.orderData.additionalDetails['loadType'] = this.loadTypeData;
      }
    } else {
      this.loadTypeData.splice(i, 1);
    }
  }

  removeList(elem, parentIndex, i) {
    if (elem === 'shipper') {
      this.finalShippersReceivers[parentIndex].shippers.splice(i, 1);
    } else {
      this.finalShippersReceivers[parentIndex].receivers.splice(i, 1);
    }
  }

  discountCalculate() {
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
    }
    $('div').removeClass('show-search__result');
    
  }

  editList(elem, item, parentIndex, i) {
    let j = parentIndex;
    
    if (elem === 'shipper') {
      // let index = this.orderData.shipperInfo.indexOf(item);
      // console.log("index", index);
      let itemDateAndTime = item.dateAndTime.split(' ');
      this.shippersReceivers[i].shippers['shipperID'] = item.shipperID;
      this.shippersReceivers[i].shippers['pickupLocation'] = item.pickupLocation;
      this.shippersReceivers[i].shippers['pickupDate'] = itemDateAndTime[0];
      this.shippersReceivers[i].shippers['pickupTime'] = itemDateAndTime[1];
      this.shippersReceivers[i].shippers['pickupInstruction'] = item.pickupInstruction;
      this.shippersReceivers[i].shippers['contactPerson'] = item.contactPerson;
      this.shippersReceivers[i].shippers['phone'] = item.phone;
      this.shippersReceivers[i].shippers['commodity'] = item.commodity;
      this.shippersReceivers[i].shippers['reference'] = item.reference;
      this.shippersReceivers[i].shippers['notes'] = item.notes;
      this.shippersReceivers[i].shippers['minTempratureUnit'] = item.minTempratureUnit;
      this.shippersReceivers[i].shippers['maxTemprature'] = item.maxTemprature;
      this.shippersReceivers[i].shippers['maxTempratureUnit'] = item.maxTempratureUnit;
      this.shippersReceivers[i].shippers['driverLoad'] = item.driverLoad;
      this.visibleIndex = i;
      this.showUpdate = true;
    }
  }

  updateShipperReceiver(obj, item, i) {
    if(obj === 'shipper') {
      let itemIndex = this.finalShippersReceivers[i].shippers.findIndex(elem => elem.shipperID == item.shipperID);
      this.finalShippersReceivers[i].shippers[itemIndex] = item;
  
      // this.showUpdate = false;
      // this.visibleIndex = -1;
    }
   
  }



  /***************
   * For Edit Orders
  */
  fetchOrderByID() {
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
        reference: '',
        notes: '',
        commodity: [{
          name: '',
          quantity: '',
          quantityUnit: '',
          weight: '',
          weightUnit: '',
        }],
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
        commodity: [{
          name: '',
          quantity: '',
          quantityUnit: '',
          weight: '',
          weightUnit: '',
        }],
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
    if (value === 'accessFee') {
      this.accessFees.push({
        type: '',
        amount: '',
        currency: ''
      })
    } else {
      this.accessDeductions.push({
        type: '',
        amount: '',
        currency: ''
      })
    }

  }

  accordianChange() {
    setTimeout(() => {
      this.timpickerInit();
    }, 200);
  }
}

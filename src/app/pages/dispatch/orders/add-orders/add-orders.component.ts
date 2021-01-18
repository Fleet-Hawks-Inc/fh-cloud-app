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
import { ToastrService } from 'ngx-toastr';
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
    orderStatus: 'confirmed',
    orderMode: 'FTL',
    tripType: 'Regular',
    shippersReceiversInfo: [],
    additionalDetails: {},
    charges: {
      freightFee: {
        type: '',
        amount: '',
        currency: '',
      },
      fuelSurcharge: {
        type: '',
        amount: '',
        currency: '',
      },
      accessorialFeeInfo: {
        accessorialFee: []
      },
      accessorialDeductionInfo : {
        accessorialDeduction: []
      }
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
    discount: {
      amount: '',
      unit: ''
    },
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

  showShipperUpdate: boolean = false;
  showReceiverUpdate: boolean = false;
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

  accessFeesInfo = {
    accessFees: [{
      type: '',
      amount: '',
      currency: ''
    }],
  };

  accessorialDeductionInfo = {
    accessDeductions: [{
      type: '',
      amount: '',
      currency: ''
    }]
  }
  
  customers = [];
  shippers = [];
  receivers = [];
  finalShippersReceivers = [{
    shippers: [],
    receivers: []
  }];

  shippersObjects: any = {};
  receiversObjects: any = {};
  countriesObjects: any = {};
  singleDatePickerOptions;

  stateShipperIndex: any;
  stateReceiverIndex: number;
  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private awsUS: AwsUploadService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private google: GoogleMapsService,
    private HereMap: HereMapService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
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
    this.fetchCountriesByIDs();

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
      position: geoCodeResponse.position
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
      position: geoCodeResponse.position
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
    this.emptyReceiver(i);

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
    // this.shippersReceivers[i].shippers['commodity'].forEach( item => {
    //   item.name = '',
    //   item.quantity = ''
    //   item.quantityUnit = ''
    //   item.weight = ''
    //   item.weightUnit = ''
    // });
    this.shippersReceivers[i].shippers['minTempratureUnit'] = '';
    this.shippersReceivers[i].shippers['maxTemprature'] = '';
    this.shippersReceivers[i].shippers['maxTempratureUnit'] = '';
    this.shippersReceivers[i].shippers['driverLoad'] = '';
  }

  emptyReceiver(i) {
    this.shippersReceivers[i].receivers['receiverID'] = '';
    this.shippersReceivers[i].receivers['dropOffLocation'] = '';
    this.shippersReceivers[i].receivers['dropOffDate'] = '';
    this.shippersReceivers[i].receivers['dropOffTime'] = '';
    this.shippersReceivers[i].receivers['dropOffInstruction'] = '';
    this.shippersReceivers[i].receivers['contactPerson'] = '';
    this.shippersReceivers[i].receivers['phone'] = '';
    this.shippersReceivers[i].receivers['reference'] = '';
    this.shippersReceivers[i].receivers['notes'] = '';
    // this.shippersReceivers[i].receivers['commodity'].forEach( item => {
    //   item.name = '',
    //   item.quantity = ''
    //   item.quantityUnit = ''
    //   item.weight = ''
    //   item.weightUnit = ''
    // });
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

  fetchCountriesByIDs(){
    this.apiService.getData('countries/get/list').subscribe((result: any) => {
      this.countriesObjects = result;
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

  async getMiles(value) {
    this.orderData.milesInfo['calculateBy'] = value;
    
    if (this.mergedArray !== undefined) {
      this.mergedArray.forEach(element => {
        let cords =  `${element.position.lng},${element.position.lat}`
        this.getAllCords.push(cords);
      });
      
      if (value === 'google') {
        this.mergedArray.forEach(element => {
          this.googleCords.push(`${element.position.lat},${element.position.lng}`);
        });

        if (this.googleCords.length === 2) {
          this.origin = this.googleCords[0];
          this.destination = this.googleCords[1];
        } else {
          this.origin = this.googleCords[0];
          this.destination = this.googleCords.shift();
        }

        this.orderData.milesInfo['totalMiles'] = await this.google.googleDistance([this.origin], [this.googleCords.join('|')]);
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
    
    this.orderData.shippersReceiversInfo = this.finalShippersReceivers;
    
    this.hideErrors();
    
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
         
          this.toastr.success('Order added successfully');
          
          this.router.navigateByUrl('/dispatch/orders');
        }
      });
    

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

  calculateAmount() {
    this.freightFee = this.orderData.charges.freightFee['amount'];
    this.fuelSurcharge = this.orderData.charges.fuelSurcharge['amount'];
    let sum = 0;
    
    this.accessFeesInfo.accessFees.forEach(item => {
      
      sum += (parseFloat(item.amount) || 0);
    })
    this.orderData.charges.accessorialFeeInfo['total'] = sum;
    this.orderData.charges.accessorialFeeInfo.accessorialFee = this.accessFeesInfo.accessFees;

    let totalDeductions = 0;
    this.accessorialDeductionInfo.accessDeductions.forEach(item => {
      
      sum -= (parseFloat(item.amount) || 0);
      totalDeductions += (parseFloat(item.amount) || 0);
    })
    
    this.orderData.charges.accessorialDeductionInfo['total'] = totalDeductions;
    this.orderData.charges.accessorialDeductionInfo.accessorialDeduction = this.accessorialDeductionInfo.accessDeductions;

    sum += (parseFloat(this.freightFee) || 0) + (parseFloat(this.fuelSurcharge) || 0);
    
    this.subTotal = sum;
    
    let discountAmount = (parseFloat(this.orderData.discount['amount']) || 0 );
    let discountUnit = this.orderData.discount['unit'];
    if(discountUnit === 'percentage') {
      this.discount = (this.subTotal * discountAmount ) / 100;
    } else {
      this.discount = discountAmount;
    }
    

    if(this.orderData.discount['amount'] !== '') {
      let totalTax = 0; 
      this.orderData.taxesInfo.forEach(elem => {
        totalTax += ( parseFloat(elem.amount) || 0)
      })
      
      this.tax = ( (this.subTotal - this.discount) * totalTax ) / 100;
    }

    
    this.totalAmount = (this.subTotal - this.discount + this.tax).toFixed(2);
    this.orderData['totalAmount'] = this.totalAmount;
    
    
  }

  getLoadTypes(i, event) {
    var index = this.loadTypeData.indexOf(event.target.value);
    if(index === -1){
      this.loadTypeData.push(event.target.value);
    }else{
      this.loadTypeData.splice(index,1);
    }
    this.orderData.additionalDetails['loadType'] = this.loadTypeData;
    
  }

  removeList(elem, parentIndex, i) {
    if (elem === 'shipper') {
      this.finalShippersReceivers[parentIndex].shippers.splice(i, 1);
    } else {
      this.finalShippersReceivers[parentIndex].receivers.splice(i, 1);
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

  editList(elem, parentIndex, i) {
    let j = parentIndex;
    
    if (elem === 'shipper') {
      let data = this.finalShippersReceivers[parentIndex].shippers[i];
      let itemDateAndTime = data.dateAndTime.split(' ');
      this.shippersReceivers[j].shippers.shipperID = data.shipperID;
      this.shippersReceivers[j].shippers.pickupLocation = data.pickupLocation;
      this.shippersReceivers[j].shippers.pickupDate = itemDateAndTime[0];
      this.shippersReceivers[j].shippers.pickupTime = itemDateAndTime[1];
      this.shippersReceivers[j].shippers.pickupInstruction = data.pickupInstruction;
      this.shippersReceivers[j].shippers.contactPerson = data.contactPerson;
      this.shippersReceivers[j].shippers.phone = data.phone;
      this.shippersReceivers[j].shippers.commodity = data.commodity;
      this.shippersReceivers[j].shippers.reference = data.reference;
      this.shippersReceivers[j].shippers.notes = data.notes;
      this.shippersReceivers[j].shippers.minTempratureUnit = data.minTempratureUnit;
      this.shippersReceivers[j].shippers.maxTemprature = data.maxTemprature;
      this.shippersReceivers[j].shippers.maxTempratureUnit = data.maxTempratureUnit;
      this.shippersReceivers[j].shippers.driverLoad = data.driverLoad;
      this.stateShipperIndex = i;
      this.showShipperUpdate = true;
    } else {
      let data = this.finalShippersReceivers[parentIndex].receivers[i];
      let itemDateAndTime = data.dateAndTime.split(' ');
      this.shippersReceivers[j].receivers.receiverID = data.receiverID;
      this.shippersReceivers[j].receivers.dropOffLocation = data.dropOffLocation;
      this.shippersReceivers[j].receivers.dropOffDate = itemDateAndTime[0];
      this.shippersReceivers[j].receivers.dropOffTime = itemDateAndTime[1];
      this.shippersReceivers[j].receivers.dropOffInstruction = data.pickupInstruction;
      this.shippersReceivers[j].receivers.contactPerson = data.contactPerson;
      this.shippersReceivers[j].receivers.phone = data.phone;
      this.shippersReceivers[j].receivers.commodity = data.commodity;
      this.shippersReceivers[j].receivers.reference = data.reference;
      this.shippersReceivers[j].receivers.notes = data.notes;
      this.shippersReceivers[j].receivers.minTempratureUnit = data.minTempratureUnit;
      this.shippersReceivers[j].receivers.maxTemprature = data.maxTemprature;
      this.shippersReceivers[j].receivers.maxTempratureUnit = data.maxTempratureUnit;
      this.shippersReceivers[j].receivers.driverUnload = data.driverUnload;
      this.stateShipperIndex = i;
    }
    // this.visibleIndex = i;
    this.showReceiverUpdate = true;
  }

  updateShipperReceiver(obj, i) {
    
    if(obj === 'shipper') {
      let data = this.shippersReceivers[i].shippers;

      delete this.finalShippersReceivers[i].shippers[this.stateShipperIndex].pickupDate;
      delete this.finalShippersReceivers[i].shippers[this.stateShipperIndex].pickupTime;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].shipperID = data.shipperID;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].pickupLocation = data.pickupLocation;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].dateAndTime = data.pickupDate + ' ' + data.pickupTime;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].pickupInstruction = data.pickupInstruction;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].contactPerson = data.contactPerson;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].phone = data.phone;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].commodity = data.commodity;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].reference = data.reference;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].notes = data.notes;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].minTempratureUnit = data.minTempratureUnit;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].maxTemprature = data.maxTemprature;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].maxTempratureUnit = data.maxTempratureUnit;
      this.finalShippersReceivers[i].shippers[this.stateShipperIndex].driverLoad = data.driverLoad;
      this.showShipperUpdate = false;
      this.emptyShipper(i);
    } else {
      let data = this.shippersReceivers[i].receivers;

      delete this.finalShippersReceivers[i].receivers[this.stateShipperIndex].dropOffDate;
      delete this.finalShippersReceivers[i].receivers[this.stateShipperIndex].dropOffTime;

      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].receiverID = data.receiverID;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].dropOffLocation = data.dropOffLocation;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].dateAndTime = data.dropOffDate + ' ' + data.dropOffTime;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].dropOffInstruction = data.dropOffInstruction;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].contactPerson = data.contactPerson;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].phone = data.phone;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].commodity = data.commodity;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].reference = data.reference;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].notes = data.notes;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].minTempratureUnit = data.minTempratureUnit;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].maxTemprature = data.maxTemprature;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].maxTempratureUnit = data.maxTempratureUnit;
      this.finalShippersReceivers[i].receivers[this.stateShipperIndex].driverUnload = data.driverUnload;
      this.showReceiverUpdate = false;
      this.emptyReceiver(i);
    }
    
    this.visibleIndex = -1;
    this.stateShipperIndex = '';
    
  }



  /***************
   * For Edit Orders
  */
  fetchOrderByID() {
    this.apiService
      .getData('orders/' + this.getOrderID)
      .subscribe((result: any) => {
        result = result.Items[0];
        
        this.orderData['customerID'] = result.customerID;
        this.orderData['additionalContact'] = result.additionalContact;
        this.orderData['creationDate'] = result.creationDate;
        this.orderData['creationTime'] = result.creationTime;
        this.orderData['invoiceEmail'] = result.invoiceEmail;
        this.orderData['csa'] = result.csa;
        this.orderData['ctpat'] = result.ctpat;
        this.orderData['customerPO'] = result.customerPO;
        this.orderData['email'] = result.email;
        this.orderData['orderMode'] = result.orderMode;
        this.orderData['orderNumber'] = result.orderNumber;
        this.orderData['phone'] = result.phone;
        this.orderData['reference'] = result.reference;
        this.orderData['remarks'] = result.remarks;
        this.orderData.milesInfo['totalMiles'] = result.milesInfo.totalMiles;
        this.orderData.milesInfo['calculateBy'] = result.milesInfo.calculateBy;
        
        this.orderData['tripType'] = result.tripType;

        this.orderData.additionalDetails['dropTrailer'] = result.additionalDetails.dropTrailer;
        this.orderData.additionalDetails['trailerType'] = result.additionalDetails.trailerType;
        
        this.orderData.shippersReceiversInfo = result.shippersReceiversInfo;

        let length = result.shippersReceiversInfo.length;
        let emptyArr = [];
        let newArray: any = this.shippersReceivers.slice();
        
        for (let i = 0; i < length; i++) {
          
          emptyArr.push(newArray[0])
          
        }
        
        this.shippersReceivers = emptyArr;
        
        this.finalShippersReceivers = result.shippersReceiversInfo;
        
    

        let newLoadTypes = [];
        if (result.additionalDetails.loadType && result.additionalDetails.loadType.length > 0) {
          for (let i = 0; i < result.additionalDetails.loadType.length; i++) {
            newLoadTypes.push(result.additionalDetails.loadType[i])
          }
          this.loadTypeData = newLoadTypes;
        }
        
        
        this.orderData.charges.freightFee.amount = result.charges.freightFee.amount;
        this.orderData.charges.freightFee.currency = result.charges.freightFee.currency;
        this.orderData.charges.freightFee.type = result.charges.freightFee.type;
        this.orderData.charges.fuelSurcharge.amount = result.charges.fuelSurcharge.amount;
        this.orderData.charges.fuelSurcharge.currency = result.charges.fuelSurcharge.currency;
        this.orderData.charges.fuelSurcharge.type = result.charges.fuelSurcharge.type;
        
        let newAccessDeductions = [];
        for (let i = 0; i < result.charges.accessorialDeductionInfo.accessorialDeduction.length; i++) {
          newAccessDeductions.push({
            type: result.charges.accessorialDeductionInfo.accessorialDeduction[i].type,
            currency: result.charges.accessorialDeductionInfo.accessorialDeduction[i].currency,
            amount: result.charges.accessorialDeductionInfo.accessorialDeduction[i].amount,
          })
        }
        this.accessorialDeductionInfo.accessDeductions = newAccessDeductions;

        let newAccessFees = [];
        for (let i = 0; i < result.charges.accessorialFeeInfo.accessorialFee.length; i++) {
          newAccessFees.push({
            type: result.charges.accessorialFeeInfo.accessorialFee[i].type,
            amount: result.charges.accessorialFeeInfo.accessorialFee[i].amount,
            currency: result.charges.accessorialFeeInfo.accessorialFee[i].currency,
          })
        }
        this.accessFeesInfo.accessFees = newAccessFees;
        
       

        this.orderData.discount.amount = result.discount.amount;
        this.orderData.discount.unit = result.discount.unit;
        this.orderData['totalAmount'] = result.totalAmount;
        this.calculateAmount();

      });
  }


  updateOrder() {
    
    this.orderData['orderID'] = this.getOrderID;
    this.apiService.putData('orders', this.orderData).subscribe({
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
        
        this.toastr.success('Order updated successfully');
        this.router.navigateByUrl('/dispatch/orders');

      },
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

  removeAccordian(i) {
    this.shippersReceivers.splice(i, 1);
  }

  addAccessFee(value: string) {
    if (value === 'accessFee') {
      this.accessFeesInfo.accessFees.push({
        type: '',
        amount: '',
        currency: ''
      })
    } else {
      this.accessorialDeductionInfo.accessDeductions.push({
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

  changeCurrency(value) {
    
    this.orderData.charges.freightFee.currency = value;
    this.orderData.charges.fuelSurcharge.currency = value;
    
    this.accessFeesInfo.accessFees.forEach(item => {
      item.currency = value;
    });

    this.accessorialDeductionInfo.accessDeductions.forEach(item => {
      item.currency = value;
    });
    
    
  }
}

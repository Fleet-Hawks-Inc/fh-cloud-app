import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import { Router } from '@angular/router';
import { from, Subject, throwError } from 'rxjs';
import {AwsUploadService} from '../../../../services/aws-upload.service';
import { v4 as uuidv4 } from 'uuid';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NgbCalendar, NgbDateAdapter,  NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsService } from '../../../../services/google-maps.service';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import { environment } from '../../../../../environments/environment.prod';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
declare var $: any;
declare var H: any;
@Component({
  selector: 'app-add-quotes',
  templateUrl: './add-quotes.component.html',
  styleUrls: ['./add-quotes.component.css']
})
export class AddQuotesComponent implements OnInit {
  private readonly search: any;
  public searchTerm = new Subject<string>();
  public searchResults: any;
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
  quoteData = {
    shipperInfo: [{
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
    }],
    receiverInfo: [{
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
    }],
    freightDetails: {},
    additionalDetails: {},
    charges: {
      freightFee: {},
      fuelSurcharge: {},
      accessorialFee: {},
      accessorialDeduction: {}
    },
    taxesInfo: {},
  };
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};

  origin;
  destination;

  constructor(
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private awsUS: AwsUploadService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private google: GoogleMapsService,
    private HereMap: HereMapService
  ) { }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    this.fetchCustomers();
    this.searchLocation();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  userLocation(label) {
    console.log(label);
    this.quoteData.shipperInfo['pickupLocation'] = label;
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
      console.log(this.searchResults)
    });
  }

  async saveShipper(elem, item) {
    item.location = item.pickupLocation;
    if (item.hasOwnProperty('dropOffLocation')) {
      item.location = item.dropOffLocation;
    }
    console.log('location', item);
    let geoCodeResponse;
    let platform = new H.service.Platform({
      'apikey': this.apiKey,
    });
    const service = platform.getSearchService();
    let result = await service.geocode({ q: item.location })
    result.items.forEach((res) => {
      geoCodeResponse = res;
    });
    if (elem === 'shipper') {
      this.shipperList.push({
        shipperName: item.shipperName,
        pickupLocation: item.pickupLocation,
        locationDateTime: item.pickupDate + ' ' + item.pickupTime.hour + ':' + item.pickupTime.minute + ':' + item.pickupTime.second,
        pickupInstruction: item.pickupInstruction,
        contactPerson: item.contactPerson,
        phone: item.phone,
        BOL: item.BOL,
        reference: item.reference,
        notes: item.notes,
        minTemprature: item.notes,
        minTempratureUnit: item.minTempratureUnit,
        maxTemprature: item.maxTemprature,
        maxTempratureUnit: item.maxTempratureUnit,
        driverLoad: item.driverLoad,
        position: geoCodeResponse.position.lng + ',' + geoCodeResponse.position.lat
      })
    } else {
      this.receiverList.push({
        receiverName: item.receiverName,
        dropOffLocation: this.receiverLocation,
        locationDateTime: item.dropOffDate + ' ' + item.dropOffTime.hour + ':' + item.dropOffTime.minute + ':' + item.dropOffTime.second,
        dropOffInstruction: item.dropOffInstruction,
        contactPerson: item.contactPerson,
        phone: item.phone,
        BOL: item.BOL,
        reference: item.reference,
        notes: item.notes,
        minTemprature: item.notes,
        minTempratureUnit: item.minTempratureUnit,
        maxTemprature: item.maxTemprature,
        maxTempratureUnit: item.maxTempratureUnit,
        driverUnload: item.driverUnload,
        position: geoCodeResponse.position.lng + ',' + geoCodeResponse.position.lat
      })
    }
    this.mergedArray = this.shipperList.concat(this.receiverList);
    console.log("mergedArray", this.mergedArray);
    this.mergedArray.sort((a, b) => {
      return new Date(a.locationDateTime).valueOf() - new Date(b.locationDateTime).valueOf();
    });
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
        this.quoteData['totalMiles'] = res;
      }, err => {
        console.log('google res', err);
      });
    } else if (value === 'pcmiles') {
      this.google.pcMiles.next(true);
      this.google.pcMilesDistance(this.getAllCords.join(';')).subscribe(res => {
        this.quoteData['totalMiles'] = res;
      }, err => {
        console.log('pc res', err);
      });
    } else {

    }
  }

  selectedCustomer(customerID) {
    console.log('customer', customerID);
    this.apiService.getData(`customers/${customerID}`).subscribe((result: any) => {
      this.customerSelected = result.Items;
      console.log('customer', this.customerSelected);
    });
  }

  addShipper() {
    this.quoteData.shipperInfo.push({
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
    console.log(this.quoteData)
  }

  addReceiver() {
    this.quoteData.receiverInfo.push({
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
    console.log(this.quoteData)
  }

  toggleAccordian(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }



  onSubmit() {
    console.log("order", this.quoteData);
    this.apiService.postData('orders', this.quoteData).
      subscribe({
        complete: () => { },
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

  remove(data, i) {
    if (data === 'shipper') {
      this.quoteData.shipperInfo.splice(i, 1);
    } else {
      this.quoteData.receiverInfo.splice(i, 1);
    }
  }

  taxCalculate(value) {
    console.log(value);
  }
  amountCalculate(value) {

    if (this.quoteData.charges.freightFee['amount'] !== '' && this.quoteData.charges.freightFee['amount'] !== undefined) {
      this.freightFee = `${this.quoteData.charges.freightFee['amount']}`;
    } else {
      this.freightFee = 0;
    }
    if (this.quoteData.charges.fuelSurcharge['amount'] !== '' && this.quoteData.charges.fuelSurcharge['amount'] !== undefined) {
      this.fuelSurcharge = `${this.quoteData.charges.fuelSurcharge['amount']}`;
    } else {
      this.fuelSurcharge = 0;
    }
    if (this.quoteData.charges.accessorialFee['amount'] !== '' && this.quoteData.charges.accessorialFee['amount'] !== undefined) {
      this.accessorialFee = `${this.quoteData.charges.accessorialFee['amount']}`;
    } else {
      this.accessorialFee = 0;
    }
    if (this.quoteData.charges.accessorialDeduction['amount'] !== '' && this.quoteData.charges.accessorialDeduction['amount'] !== undefined) {
      this.accessorialDeduction = `${this.quoteData.charges.accessorialDeduction['amount']}`;
    } else {
      this.accessorialDeduction = 0;
    }
    this.subTotal = parseFloat(this.freightFee) + parseFloat(this.fuelSurcharge)
      + parseFloat(this.accessorialFee) - parseFloat(this.accessorialDeduction);


  }

}

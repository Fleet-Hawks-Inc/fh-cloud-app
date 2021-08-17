import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HereMapService, ListService } from 'src/app/services';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { type } from 'os';

declare var $: any;

@Component({
  selector: 'app-new-address-book',
  templateUrl: './new-address-book.component.html',
  styleUrls: ['./new-address-book.component.css']
})
export class NewAddressBookComponent implements OnInit {
  modalTitle = 'Add ';
  imageText = 'Add Picture';
  closeResult = '';
  public searchTerm = new Subject<string>();
  public searchResults: any;
  
  
  additionalDisabled = false;
  newArr = [];
  unitData = {
    cName: '',
    dba: '',
    workPhone: '',
    workEmail: '',
    eTypes: [],
    address: [{
      addressType: null,
      countryName: '',
      stateName: '',
      cityName: null,
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLocation: '',
      manual: false,
      countryCode: null,
      stateCode: null,
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      phone: '',
      designation: '',
      email: '',
      fax: ''
    }],
    data: []
  }

  customerData = {
    companyName: '',
    dbaName: '',
    // firstName: '',
    // lastName: '',
    ein: '',
    accountNumber: '',
    workPhone: '',
    workEmail: '',
    mc: '',
    dot: '',
    fast: '',
    fastExpiry: '',
    // trailerPreference: '',
    csa: false,
    ctpat: false,
    pip: false,
    entityType: 'customer',
    address: [{
      addressType: null,
      countryName: '',
      stateName: '',
      cityName: null,
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLocation: '',
      manual: false,
      countryCode: null,
      stateCode: null,
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      phone: '',
      designation: '',
      email: '',
      fax: ''
    }]
  };
  constructor( private HereMap: HereMapService, private listService: ListService) { }

  ngOnInit() {
    this.searchLocation();
    console.log('hello');
  }


  openModal(content) {
    this.listService.triggerModal(content);
  }

  public searchLocation() {
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $('div').removeClass('show-search__result');
        $(e.target).closest('div').addClass('show-search__result');
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
      if (res) {
        this.searchResults = res;
      }
    });
  }

  addAdditionalContact(data){
    if(data.additionalContact.length < 3) {
      this.additionalDisabled = false;
      let newObj = {
        fullName: '',
        firstName: '',
        lastName: '',
        designation: '',
        phone: '',
        email: '',
        fax: '',
      };
      data.additionalContact.push(newObj);
      if(data.additionalContact.length == 3) {
        this.additionalDisabled = true;
      }
    } else {
      this.additionalDisabled = true;
      return false
    }
  }

  async userAddress(data: any, i: number, item: any) {
    console.log('item',data, i, item);
    data.address[i].userLocation = item.address.label;
    data.address[i].geoCords.lat = item.position.lat;
    data.address[i].geoCords.lng = item.position.lng;
    data.address[i].countryName = item.address.CountryFullName;
    data.address[i].stateName = item.address.StateName;
    data.address[i].cityName = item.address.City;

    data.address[i].countryCode = item.address.Country;
    data.address[i].stateCode = item.address.State;
    data.address[i].zipCode = item.address.Zip;
    data.address[i].street = item.address.StreetAddress;
    
    $('div').removeClass('show-search__result');
  }

  delAdditionalContact(index) {
    this.unitData.additionalContact.splice(index, 1);
      if(this.unitData.additionalContact.length < 3) {
        this.additionalDisabled = false;
      } else {
        this.additionalDisabled = true;
      }
  }

  unitChange(types: any) {
    // console.log('types', this.unitData.eTypes)
    console.log('this.newArr', this.newArr)
    // console.log('this.unitData.eTypes', this.unitData.eTypes)
    this.unitData.eTypes.forEach(element => {
      console.log('element', element)
      if(element === 'broker') {
        if(!this.newArr.includes('broker')){
          console.log('not include')
          let data = {
            brokerData : {
              type: 'individual',
              dot: '',
              fn: '',
              ln: '',
              acc: '',
              ein: '',
              mc: ''
            }
          }
          this.newArr.push('broker');
          this.unitData.data.push(data)
        } 
      } else if (element === 'carrier') {
        if(!this.newArr.includes('carrier')){
          console.log('not include')
          let data = {
            carrierData : {
              csa: false,
              ctpat: false,
              pip: false,
              inBonded: false,
              mc: '',
              dot: '',
              fast: '',
              fastExpiry: '',
              ccc: '',
              scac: '',
              cvor: '',
              localTax: '',
              federalTax: '',
              payrollType: null,
              payrollRate: '',
              payrollRateCurrency: null,
              payrollPercent: '',
              percentType: '',
              loadedMiles: '',
              loadedMilesCurrency: null,
              emptyMiles: '',
              emptyMilesCurrency: null,
              deliveryRate: '',
              deliveryRateCurrency: null,
              applyTax: false,
              wsib: false,
              wsibAccountNumber: '',
              wsibExpiry: ''
            }
          }
          this.newArr.push('carrier');
          this.unitData.data.push(data)
        } 
      } else if (element === 'shipper') {
        if(!this.newArr.includes('shipper')){
          console.log('not include')
          let data = {
            shipperData : {
              dot: '',
              mc: ''
            }
          }
          this.newArr.push('shipper');
          this.unitData.data.push(data)
        } 
      } else if (element === 'receiver') {
        if(!this.newArr.includes('receiver')){
          console.log('not include')
          let data = {
            receiverData : {
              dot: '',
              mc: ''
            }
          }
          this.newArr.push('receiver');
          this.unitData.data.push(data)
        } 
      } else if (element === 'customer') {
        if(!this.newArr.includes('customer')){
          console.log('not include')
          let data = {
            customerData : {
              ein: '',
              acc: '',
              dot: '',
              mc: '',
              fast: '',
              fastExp: '',
              csa: false,
              ctpat: false,
              pip: false,
            }
          }
          this.newArr.push('customer');
          this.unitData.data.push(data)
        } 
      } else if (element === 'fc') {
        if(!this.newArr.includes('fc')){
          console.log('not include')
          let data = {
            fcData : {
              acc: '',
              fcRate: '',
              fcUnit: null
            }
          }
          this.newArr.push('fc');
          this.unitData.data.push(data)
        } 
      } else if (element === 'owner_operator') {
        if(!this.newArr.includes('op')){
          console.log('not include')
          let data = {
            opData : {
              csa: false,
              fast: '',
              fastExp: null,
              sin: '',
              payTy: '',
              payrollRate: '',
              payrollRateCurrency: null,
              payrollPercent: '',
              percentType: '',
              loadedMiles: '',
              loadedMilesCurrency: null,
              emptyMiles: '',
              emptyMilesCurrency: null,
              deliveryRate: '',
              deliveryRateCurrency: null
            }
          }
          this.newArr.push('op');
          this.unitData.data.push(data)
        } 
      } else if (element === 'vendor') {
        if(!this.newArr.includes('vendor')){
          console.log('not include')
          let data = {
            vendorData : {
              acc: ''
            }
          }
          this.newArr.push('vendor');
          this.unitData.data.push(data)
        } 
      }
    });
    
   
    console.log('data', this.unitData);
  }

  unitRemove(types){ 
    console.log('remove', types, this.unitData.eTypes);
  }

  brokerType(value: any) {
    this.unitData.data.forEach(elem => {
      console.log('elem', elem);
      if(elem.brokerData) {
        elem.brokerData.type = value;
      }
    });
  }

  manAddress(event, i) {
    if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.customerData.address[i]['userLocation'] = '';
      this.customerData.address[i].countryCode = null;
      this.customerData.address[i].countryName = '';
      this.customerData.address[i].stateCode = null;
      this.customerData.address[i].stateName = '';
      this.customerData.address[i].cityName = null;
      this.customerData.address[i].zipCode = '';
      this.customerData.address[i].address1 = '';
      this.customerData.address[i].address2 = '';
      if(this.customerData.address[i].geoCords != undefined){
        this.customerData.address[i].geoCords.lat = '';
        this.customerData.address[i].geoCords.lng = '';
      }
  }

  addAddress(data) {
    this.searchResults = [];
    data.address.push({
      addressType: null,
      countryName: '',
      stateName: '',
      cityName: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: ''
    });
  }

  removeAddress(index) {
    
    this.unitData.address.splice(index, 1);
  }
  
  carrierWSIB(value) {
    if (value !== true) {
      this.unitData.data.forEach(elem => {
        if(elem.carrierData){
          delete elem.carrierData.wsibAccountNumber;
          delete elem.carrierData.wsibExpiry;
        }
      })
      
    }
  }
}

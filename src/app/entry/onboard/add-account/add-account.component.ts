import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HereMapService } from '../../../services';
import { Location } from '@angular/common';
import { exit } from 'process';
import { Auth } from 'aws-amplify';
declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
// @ViewChild('carrierForm', null) carrierForm: NgForm;
  Asseturl = this.apiService.AssetUrl;
  carrierID: string;
  CCC = '';
  DBAName = '';
  DOT: number;
  EIN: number;
  MC: number;
  SCAC = '';
  CSA = false;
  CTPAT = false;
  PIP = false;
  cargoInsurance = '';
  email = '';
  userName = '';
  carrierName = '';
  // carrierBusinessName = '';
  findingWay = '';
  firstName = '';
  lastName = '';
  liabilityInsurance = '';
  password = '';
  confirmPassword = '';
  phone = '';
  bizCountry = null;
  uploadedLogo = '';
  fleets = {
    curtainSide: 0,
    dryVans: 0,
    flatbed: 0,
    reefers: 0,
    totalFleets: 1,
    trailers: 0,
    trucks: 0,
  };
  addressDetails = [{
    addressType: 'yard',
    countryID: '',
    countryName: '',
    stateID: '',
    stateName: '',
    cityID: '',
    cityName: '',
    zipCode: '',
    address1: '',
    address2: '',
    geoCords: {
      lat: '',
      lng: ''
    },
    manual: false
  }];
  bank = {
    branchName: '',
    accountNumber: '',
    transitNumber: '',
    routingNumber: '',
    institutionNumber: '',
  };
  public searchTerm = new Subject<string>();
  public searchResults: any;
  userLocation: any;
  bankLocation: any;
  statesObject: any = {};
  countriesObject: any = {};
  citiesObject: any = {};
  newAddress = [];
  addressCountries = [];
  deletedAddress = [];
  selectedFiles: FileList;
  selectedFileNames: Map<any, any>;
  uploadedPhotos = [];
  showAddress = false;
  countries = [];
  states = [];
  cities = [];
  errors = {};
  carrierForm;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  yardAddress: boolean;
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  constructor(private apiService: ApiService, private toaster: ToastrService, private location: Location, private HereMap: HereMapService) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.fetchCountries();
    this.searchLocation(); // search location on keyup
    $(document).ready(() => {
      this.carrierForm = $('#carrierForm').validate();
    });
  }
  // Show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }
  /**
   * address
   */
  clearUserLocation(i) {
    this.addressDetails[i][`userLocation`] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.addressDetails[i][`userLocation`] = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  async getStates(id: any, oid = null) {
    if (oid != null) {
      this.addressDetails[oid].countryName = this.countriesObject[id];
    }
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  async getCities(id: any, oid = null) {
    if (oid != null) {
      this.addressDetails[oid].stateName = this.statesObject[id];
    }
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }
  getCityName(i, id: any) {
    const result = this.citiesObject[id];
    this.addressDetails[i].cityName = result;
  }
  addAddress() {
    if (this.addressDetails.length === 3) { // to restrict to add max 3 addresses, can increase in future by changing this value only
      this.toaster.warning('Maximum 3 addresses are allowed.');
    }
    else {
      this.addressDetails.push({
        addressType: '',
        countryID: '',
        countryName: '',
        stateID: '',
        stateName: '',
        cityID: '',
        cityName: '',
        zipCode: '',
        address1: '',
        address2: '',
        geoCords: {
          lat: '',
          lng: ''
        },
        manual: false
      });
    }
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.countries.map(elem => {
          if (elem.countryName === 'Canada' || elem.countryName === 'United States of America') {
            this.addressCountries.push({ countryName: elem.countryName, countryID: elem.countryID });
          }
        });
      });
  }
  async fetchCountriesByName(name: string, i) {
    const result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID, i);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string, i) {
    const result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID, i);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchCitiesByName(name: string) {
    const result = await this.apiService.getData(`cities/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      return result.Items[0].cityID;
    }
    return '';
  }
  remove(obj, i, addressID = null) {
    if (obj === 'address') {
      if (addressID != null) {
        this.deletedAddress.push(addressID)
      }
      this.addressDetails.splice(i, 1);
    }
  }
  fetchAllStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObject = result;
      });
  }

  fetchAllCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObject = result;
      });
  }

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObject = result;
      });
  }
  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
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
      this.searchResults = res;
    });
  }
  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    this.addressDetails[i][`userLocation`] = result.address.label;
    this.addressDetails[i].geoCords.lat = result.position.lat;
    this.addressDetails[i].geoCords.lng = result.position.lng;
    this.addressDetails[i].countryName = result.address.countryName;
    $('div').removeClass('show-search__result');
    this.addressDetails[i].stateName = result.address.state;
    this.addressDetails[i].cityName = result.address.city;
    this.addressDetails[i].countryID = ''; // empty the fields if manual is false (if manual was true IDs were stored)
    this.addressDetails[i].stateID = '';
    this.addressDetails[i].cityID = '';
    this.addressDetails[i].zipCode = result.address.postalCode;

    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  async onSubmit() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    for (let i = 0; i < this.addressDetails.length; i++) {
      const element = this.addressDetails[i];
      if (element.countryID !== '' && element.stateID !== '' && element.cityID !== '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
    ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        if (result.items.length > 0) {
          result = result.items[0];
          console.log('address part', result);
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }
    for(let i=0; i < this.addressDetails.length;i++){
      if(this.addressDetails[i].addressType === 'yard') {
        this.yardAddress = true;
        exit;
      }else{
        this.yardAddress = false;
      }
    }
    if (this.yardAddress) {
      const data = {
        entityType: 'carrier',
        CCC: this.CCC,
        DBAName: this.DBAName,
        DOT: this.DOT,
        EIN: this.EIN,
        MC: this.MC,
        SCAC: this.SCAC,
        cargoInsurance: this.cargoInsurance,
        email: this.email,
        userName: this.userName,
        CTPAT: this.CTPAT,
        CSA: this.CSA,
        PIP: this.PIP,
        carrierName: this.carrierName.trim(),
        findingWay: this.findingWay,
        bizCountry: this.bizCountry,
        firstName: this.firstName,
        lastName: this.lastName,
        liabilityInsurance: this.liabilityInsurance,
        password: this.password,
        confirmPassword: this.confirmPassword,
        addressDetails: this.addressDetails,
        phone: this.phone,
        fleets: {
          curtainSide: this.fleets.curtainSide,
          dryVans: this.fleets.dryVans,
          flatbed: this.fleets.flatbed,
          reefers: this.fleets.reefers,
          totalFleets: this.fleets.totalFleets,
          trailers: this.fleets.trailers,
          trucks: this.fleets.trucks
        },
        bank: this.bank
      };
      console.log('data', data);
      // create form data instance
      const formData = new FormData();
      // append photos if any
      for (let i = 0; i < this.uploadedPhotos.length; i++) {
        formData.append('uploadedPhotos', this.uploadedPhotos[i]);
      }
      // append other fields
      formData.append('data', JSON.stringify(data));
      this.apiService.postData('carriers/add', formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                // val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
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
          this.toaster.success('Carrier created successfully.');
          this.cancel();
        },
      });
    } else{
      this.toaster.warning('Yard address is mandatory');
    }

  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
  }
  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label');
      });
    this.errors = {};
  }
  selectPhoto(event) {
    let files = [...event.target.files];
    this.uploadedPhotos = [];
    this.uploadedPhotos.push(files[0]);
  }

  // FRONT END VALIDATION


}

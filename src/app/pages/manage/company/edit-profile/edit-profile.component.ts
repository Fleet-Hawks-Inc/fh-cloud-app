import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from '../../../../services';
import { Location } from '@angular/common';
import { from, Subject, throwError } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { InvokeHeaderFnService } from 'src/app/services/invoke-header-fn.service';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import * as _ from 'lodash';

declare var $: any;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  companyID = '';
  carrierID = '';
  bankID = '';
  carriers: any = [];
  companyForm;
  Asseturl = this.apiService.AssetUrl;
  logoSrc = '';
  CCC = '';
  DBAName = '';
  DOT = '';
  EIN = '';
  MC = '';
  SCAC = '';
  CSA = false;
  CTPAT = false;
  PIP = false;
  cargoInsurance = '';
  email = '';
  userName = '';
  carrierName = '';
  bizCountry = null;
  // carrierBusinessName = '';
  findingWay = '';
  firstName = '';
  lastName = '';
  liabilityInsurance = '';
  password = '';
  confirmPassword = '';
  phone = '';
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
    countryName: '',
    countryCode: '',
    stateCode: '',
    stateName: '',
    cityName: '',
    zipCode: '',
    address: '',
    geoCords: {
      lat: '',
      lng: ''
    },
    manual: false,
    states: [],
    cities: []
  }];
  banks: any = [{
    branchName: '',
    accountNumber: '',
    transitNumber: '',
    routingNumber: '',
    institutionNumber: '',
  }];
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
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  existingPhotos = [];
  yardAddress: boolean;
  submitDisabled = false;
  constructor(private apiService: ApiService, private toaster: ToastrService,
    private headerFnService: InvokeHeaderFnService,
    private route: ActivatedRoute, private location: Location, private HereMap: HereMapService) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.searchLocation(); // search location on keyup
    this.companyID = this.route.snapshot.params[`carrierID`];
    if (this.companyID) {
      this.fetchCarrier();
    }
    $(document).ready(() => {
      this.companyForm = $('#companyForm').validate();
    });
  }
  headerComponentFunction() {
    this.headerFnService.callHeaderFn();
  }
  fetchCarrier() {
    this.apiService.getData(`carriers/${this.companyID}`)
      .subscribe(async (result: any) => {
        this.carriers = result.Items[0];;
        this.carrierID = this.carriers.carrierID;
        this.CCC = this.carriers.CCC;
        this.DBAName = this.carriers.DBAName;
        this.DOT = this.carriers.DOT;
        this.EIN = this.carriers.EIN;
        this.MC = this.carriers.MC;
        this.SCAC = this.carriers.SCAC;
        this.CSA = this.carriers.CSA;
        this.CTPAT = this.carriers.CTPAT;
        this.PIP = this.carriers.PIP;
        this.cargoInsurance = this.carriers.cargoInsurance;
        this.email = this.carriers.email;
        this.userName = this.carriers.userName;
        this.carrierName = this.carriers.carrierName;
        this.password = this.carriers.password,
          // carrierBusinessName = '';
          this.findingWay = this.carriers.findingWay;
        this.firstName = this.carriers.firstName;
        this.lastName = this.carriers.lastName;
        this.liabilityInsurance = this.carriers.liabilityInsurance;
        this.phone = this.carriers.phone;
        this.bizCountry = this.carriers.bizCountry;
        // uploadedLogo = '';
        this.fleets = {
          curtainSide: this.carriers.fleets.curtainSide,
          dryVans: this.carriers.fleets.dryVans,
          flatbed: this.carriers.fleets.flatbed,
          reefers: this.carriers.fleets.reefers,
          totalFleets: this.carriers.fleets.totalFleets,
          trailers: this.carriers.fleets.trailers,
          trucks: this.carriers.fleets.trucks,
        };
        this.addressDetails = this.carriers.addressDetails;
        if (this.carriers.addressDetails !== undefined) {
          for (let a = 0; a < this.carriers.addressDetails.length; a++) {
            const countryCode = this.carriers.addressDetails[a].countryCode;
            const stateCode = this.carriers.addressDetails[a].stateCode;
            this.fetchStates(countryCode, a);
            this.fetchCities(countryCode, stateCode, a);
          }
        }
        this.banks = this.carriers.banks;
        this.uploadedLogo = this.carriers.uploadedLogo;
        this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
      });
  }
  // UPDATE PART
  /**
    * address
    */
  fetchStates(countryCode: any, index: any) {
    this.addressDetails[index].states = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }
  fetchCities(countryCode: any, stateCode: any, index: any) {
    this.addressDetails[index].cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  clearUserLocation(i) {
    this.addressDetails[i][`userLocation`] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.addressDetails[i][`userLocation`] = '';
      this.addressDetails[i].countryCode = '';
      this.addressDetails[i].stateCode = '';
      this.addressDetails[i].cityName = '';
      this.addressDetails[i].zipCode = '';
      this.addressDetails[i].address = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  getStates(countryCode: any, index: any) {
    this.addressDetails[index].stateCode = '';
    this.addressDetails[index].cityName = '';
    this.addressDetails[index].states = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }
  getCities(stateCode: any, index: any, countryCode: any) {
    this.addressDetails[index].cityName = '';
    this.addressDetails[index].countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.addressDetails[index].stateName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.addressDetails[index].cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  addAddress() {
    if (this.addressDetails.length === 3) { // to restrict to add max 3 addresses, can increase in future by changing this value only
      this.toaster.warning('Maximum 3 addresses are allowed.');
    }
    else {
      this.addressDetails.push({
        addressType: '',
        countryName: '',
        countryCode: '',
        stateCode: '',
        stateName: '',
        cityName: '',
        zipCode: '',
        address: '',
        geoCords: {
          lat: '',
          lng: ''
        },
        manual: false,
        states: [],
        cities: []
      });
    }
  }




  remove(obj, i, addressID = null) {
    if (obj === 'address') {
      this.addressDetails.splice(i, 1);
    }
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
    this.addressDetails[i].countryCode = result.address.countryCode;
    this.addressDetails[i].stateCode = result.address.stateCode;
    this.addressDetails[i].stateName = result.address.state;
    this.addressDetails[i].cityName = result.address.city;
    this.addressDetails[i].zipCode = result.address.postalCode;
    $('div').removeClass('show-search__result');
    this.addressDetails[i].countryCode = ''; // empty the fields if manual is false (if manual was true IDs were stored)
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
  async UpdateCarrier() {
    this.hasError = false;
    this.hasSuccess = false;
    this.submitDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.addressDetails.length; i++) {
      const element = this.addressDetails[i];
      delete element.states;
      delete element.cities;
      if (element.countryCode !== '' && element.stateCode !== '' && element.cityName !== '') {
        let fullAddress = `${element.address} ${element.cityName}
    ${element.stateCode} ${element.countryCode}`;
        let result = await this.HereMap.geoCode(fullAddress);
        if (result.items.length > 0) {
          result = result.items[0];
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }
    for (let i = 0; i < this.addressDetails.length; i++) {
      if (this.addressDetails[i].addressType === 'yard') {
        this.yardAddress = true;
        break;
      } else {
        this.yardAddress = false;
      }
    }
    if (this.yardAddress) {
      const data = {
        carrierID: this.carrierID,
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
        firstName: this.firstName,
        lastName: this.lastName,
        liabilityInsurance: this.liabilityInsurance,
        password: this.password,
        bizCountry: this.bizCountry,
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
        banks: this.banks,
        uploadedLogo: this.uploadedLogo

      };
      if (data.bizCountry === 'CA') {
        data.MC = null;
        data.DOT = null;
      }
      // create form data instance
      const formData = new FormData();

      // append photos if any
      for (let i = 0; i < this.uploadedPhotos.length; i++) {
        formData.append('uploadedPhotos', this.uploadedPhotos[i]);
      }
      // append other fields
      formData.append('data', JSON.stringify(data));

      this.apiService.putData('carriers', formData, true).subscribe({
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
                this.submitDisabled = false;
              },
              error: () => { this.submitDisabled = false; },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.submitDisabled = false;
          this.toaster.success('Carrier updated successfully.');
          this.cancel();
          this.updateUser();
        },
      });
    } else {
      this.toaster.warning('Yard address is mandatory');
    }
  }
  updateUser() {
    let currentLoggedUserName = localStorage.getItem('currentLoggedUserName');
    //  if(currentLoggedUserName == this.userName){
    let currentUser = `${this.firstName} ${this.lastName}`;
    const outputName = currentUser.match(/\b(\w)/g);
    let smallName = outputName.join('');
    localStorage.setItem('currentUserName', currentUser);
    localStorage.setItem('nickName', smallName);
    this.headerComponentFunction();
    //  }
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

  deleteLogo() {
    this.apiService.deleteData(`carriers/uploadDelete/${this.carrierID}/${this.uploadedLogo}`).subscribe((result: any) => {
      this.toaster.success('Image Deleted Successfully');
      this.fetchCarrier();
    });
  }


}

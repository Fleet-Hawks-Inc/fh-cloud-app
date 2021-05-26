import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retryWhen } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { HereMapService } from '../../../services';
import { Location } from '@angular/common';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';

declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
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
  banks = [{
    branchName: '',
    accountNumber: '',
    transitNumber: '',
    routingNumber: '',
    institutionNumber: '',
  }];
  submitDisabled = false;
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
  getStates(countryCode: any, index:any) {
    this.addressDetails[index].stateCode = '';
    this.addressDetails[index].cityName = '';
    this.addressDetails[index].states = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }
   getCities(stateCode: any, index: any, countryCode: any) {
    this.addressDetails[index].cityName = '';
    this.addressDetails[index].countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.addressDetails[index].stateName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.addressDetails[index].cities   = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
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
      if (addressID != null) {
        this.deletedAddress.push(addressID);
      }
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
    for(let i=0; i < this.addressDetails.length;i++){
      if(this.addressDetails[i].addressType === 'yard') {
        this.yardAddress = true;
        break;
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
        banks: this.banks
      };
      if(data.bizCountry === 'CA') {
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
                this.submitDisabled = true;
              },
              error: () => { },
              next: () => {this.submitDisabled = true; },
            });
        },
        next: (res) => {
          this.response = res;
          this.submitDisabled = true;
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



}

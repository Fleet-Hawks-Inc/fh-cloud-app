
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AccountService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retryWhen } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { HereMapService } from '../../../services';
import { Location } from '@angular/common';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import { passwordStrength } from 'check-password-strength'
import {Router} from '@angular/router'
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
  fax = '';
  bizCountry = null;
  uploadedLogo = '';
  referral={
    name:'',
    company:'',
    phone:'',
    email:''
  }
  fleets = {
    curtainSide: 0,
    dryVans: 0,
    flatbed: 0,
    reefers: 0,
    totalFleets: 1,
    trailers: 0,
    trucks: 0,
  };
  reCaptcha: any
  size = "Normal"
  lang = "en"
  theme = "light"

  addressDetails = [{
    addressType: 'yard',
    defaultYard: true,
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
    addressDetails: [{
      addressType: 'branch',
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
      bankStates: [],
      bankCities: []
    }]
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
  yardDefault = false;
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  };
  siteKey = '6LfFJmkbAAAAAAhQjutsoWWGZ_J7-MeFw5Iw6KRo';
  constructor(private apiService: ApiService,
              private toaster: ToastrService,
              private accountService: AccountService,
              private location: Location,
              private HereMap: HereMapService,
              private router: Router) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.getCarrierData();
    this.searchLocation(); // search location on keyup
    $(document).ready(() => {
      // this.carrierForm = $('#carrierForm').validate();
    });
  }

  getCarrierData(){
    this.apiService.getData('carriers/getCarrier').subscribe((res)=>{
      if(res.Items.length > 0) {
        let data = res.Items[0];
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.fax = data.fax;
        this.userName = data.userName;
        this.email = data.email;
        this.findingWay = data.findingWay;
        this.carrierID = data.carrierID;
        this.referral=data.referral
      }
    });
  }
  geocodingSearch(value) {
    this.HereMap.geoCode(value);
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
    this.addressDetails[i].geoCords.lat = '';
    this.addressDetails[i].geoCords.lng = '';
    this.addressDetails[i].countryCode = '';
    this.addressDetails[i].stateCode = '';
    this.addressDetails[i].countryName = '';
    this.addressDetails[i].stateName = '';
    this.addressDetails[i].cityName = '';
    this.addressDetails[i].zipCode = '';
    this.addressDetails[i].address = '';
    $('div').removeClass('show-search__result');
  }
  clearBankLocation(i: any, bankIndex: any) {
    this.banks[bankIndex].addressDetails[i][`userLocation`] = '';
    this.banks[bankIndex].addressDetails[i].geoCords.lat = '';
    this.banks[bankIndex].addressDetails[i].geoCords.lng = '';
    this.banks[bankIndex].addressDetails[i].countryName = '';
    this.banks[bankIndex].addressDetails[i].countryCode = '';
    this.banks[bankIndex].addressDetails[i].stateCode = '';
    this.banks[bankIndex].addressDetails[i].stateName = '';
    this.banks[bankIndex].addressDetails[i].cityName = '';
    this.banks[bankIndex].addressDetails[i].zipCode = '';
    this.banks[bankIndex].addressDetails[i].address = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.addressDetails[i][`userLocation`] = '';
      this.addressDetails[i].geoCords.lat = '';
      this.addressDetails[i].geoCords.lng = '';
      this.addressDetails[i].countryCode = '';
      this.addressDetails[i].stateCode = '';
      this.addressDetails[i].countryName = '';
      this.addressDetails[i].stateName = '';
      this.addressDetails[i].cityName = '';
      this.addressDetails[i].zipCode = '';
      this.addressDetails[i].address = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
      this.addressDetails[i][`userLocation`] = '';
      this.addressDetails[i].geoCords.lat = '';
      this.addressDetails[i].geoCords.lng = '';
      this.addressDetails[i].countryCode = '';
      this.addressDetails[i].stateCode = '';
      this.addressDetails[i].countryName = '';
      this.addressDetails[i].stateName = '';
      this.addressDetails[i].cityName = '';
      this.addressDetails[i].zipCode = '';
      this.addressDetails[i].address = '';
    }
  }
  manBankAddress(event, i, bankIndex) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.banks[bankIndex].addressDetails[i][`userLocation`] = '';
      this.banks[bankIndex].addressDetails[i].geoCords.lat = '';
      this.banks[bankIndex].addressDetails[i].geoCords.lng = '';
      this.banks[bankIndex].addressDetails[i].countryCode = '';
      this.banks[bankIndex].addressDetails[i].stateCode = '';
      this.banks[bankIndex].addressDetails[i].countryName = '';
      this.banks[bankIndex].addressDetails[i].stateName = '';
      this.banks[bankIndex].addressDetails[i].cityName = '';
      this.banks[bankIndex].addressDetails[i].zipCode = '';
      this.banks[bankIndex].addressDetails[i].address = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
      this.banks[bankIndex].addressDetails[i][`userLocation`] = '';
      this.banks[bankIndex].addressDetails[i].geoCords.lat = '';
      this.banks[bankIndex].addressDetails[i].geoCords.lng = '';
      this.banks[bankIndex].addressDetails[i].countryCode = '';
      this.banks[bankIndex].addressDetails[i].stateCode = '';
      this.banks[bankIndex].addressDetails[i].countryName = '';
      this.banks[bankIndex].addressDetails[i].stateName = '';
      this.banks[bankIndex].addressDetails[i].cityName = '';
      this.banks[bankIndex].addressDetails[i].zipCode = '';
      this.banks[bankIndex].addressDetails[i].address = '';
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
  getBankStates(countryCode: any, index: any, bankIndex: any) {
    this.banks[bankIndex].addressDetails[index].stateCode = '';
    this.banks[bankIndex].addressDetails[index].cityName = '';
    this.banks[bankIndex].addressDetails[index].bankStates = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }
  getBankCities(stateCode: any, index: any, countryCode: any, bankIndex: any) {
    this.banks[bankIndex].addressDetails[index].cityName = '';
    this.banks[bankIndex].addressDetails[index].countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.banks[bankIndex].addressDetails[index].stateName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.banks[bankIndex].addressDetails[index].bankCities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  addAddress() {
    if (this.addressDetails.length === 3) { // to restrict to add max 3 addresses, can increase in future by changing this value only
      this.toaster.warning('Maximum 3 addresses are allowed.');
    } else {
      this.addressDetails.push({
        addressType: '',
        defaultYard: false,
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
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $(e.target).closest('div').addClass('show-search__result');
        return e.target.value;
      }),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        return this.HereMap.searchForOnBoard(term);
      }),
      catchError((e) => {
        return throwError(e);
      }),
    ).subscribe(res => {
      this.searchResults = res;
    });
  }

  async userAddress(i, item) {
    this.addressDetails[i][`userLocation`] = item.address;
    let result = await this.getAddressDetail(item.place_id);
    if(result != undefined) {
      this.addressDetails[i].geoCords.lat = result.position.lat;
      this.addressDetails[i].geoCords.lng = result.position.lng;
      this.addressDetails[i].countryName = result.address.CountryFullName;
      this.addressDetails[i].countryCode = result.address.Country;
      this.addressDetails[i].stateCode = result.address.State;
      this.addressDetails[i].stateName = result.address.StateName;
      this.addressDetails[i].cityName = result.address.City;
      this.addressDetails[i].zipCode = result.address.Zip;
      this.addressDetails[i].address = result.address.StreetAddress;
      $('div').removeClass('show-search__result');
    }

  }

  async getAddressDetail(id) {
    let result = await this.apiService
    .getData(`pcMiles/detail/${id}`).toPromise();
    return result;
  }


  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  async bankAddress(i, item, bankIndex: any) {
    this.banks[bankIndex].addressDetails[i][`userLocation`] = item.address;
    const result = await this.getAddressDetail(item.place_id);
    if (result !== undefined) {
      this.banks[bankIndex].addressDetails[i].geoCords.lat = result.position.lat;
      this.banks[bankIndex].addressDetails[i].geoCords.lng = result.position.lng;
      this.banks[bankIndex].addressDetails[i].countryName = result.address.CountryFullName;
      this.banks[bankIndex].addressDetails[i].countryCode = result.address.Country;
      this.banks[bankIndex].addressDetails[i].stateCode = result.address.State;
      this.banks[bankIndex].addressDetails[i].stateName = result.address.StateName;
      this.banks[bankIndex].addressDetails[i].cityName = result.address.City;
      this.banks[bankIndex].addressDetails[i].zipCode = result.address.Zip;
      this.banks[bankIndex].addressDetails[i].address = result.address.StreetAddress;
      $('div').removeClass('show-search__result');
    }
  }
  defaultYardFn(e: any, index: number) {
    if (e === true) {
      this.addressDetails[index].defaultYard = true;
      this.yardDefault = true;
    }
    for (let i = 0; i < this.addressDetails.length; i++) {
      if (i !== index) {
        this.addressDetails[i].defaultYard = false;
      }
    }
    if (e === false) {
      this.addressDetails[index].defaultYard = false;
    }
  }
  setYardDefault(event: any, index: number) {
if (event === 'mailing') {
  this.addressDetails[index].defaultYard = false;
}
  }
  predefinedAccounts() {
    this.accountService.getData('chartAc/predefinedAccounts').subscribe((res: any) => {
    });
  }
  async onAddCarrier() {
    this.hasError = false;
    this.hasSuccess = false;
    this.submitDisabled = true;
    this.hideErrors();
    for (const el of this.addressDetails) {
      delete el.states;
      delete el.cities;
      if (el.countryCode !== '' && el.stateCode !== '' && el.cityName !== '') {
        const fullAddress = `${el.address} ${el.cityName}
    ${el.stateCode} ${el.countryCode}`;
        let result = await this.HereMap.geoCode(fullAddress);
        if (result.items.length > 0) {
          result = result.items[0];
          el.geoCords.lat = result.position.lat;
          el.geoCords.lng = result.position.lng;
        }
      }
    }
    for (const op of this.banks) {
      for( const addressElement of op.addressDetails) {
        delete addressElement.bankStates;
        delete addressElement.bankCities;
        if (addressElement.countryCode !== '' && addressElement.stateCode !== '' && addressElement.cityName !== '') {
          const fullAddress = `${addressElement.address} ${addressElement.cityName}
      ${addressElement.stateCode} ${addressElement.countryCode}`;
          let result = await this.HereMap.geoCode(fullAddress);
          if (result.items.length > 0) {
            result = result.items[0];
            addressElement.geoCords.lat = result.position.lat;
            addressElement.geoCords.lng = result.position.lng;
          }
        }
      }

    }
    const getYardDefault = this.addressDetails.filter((address: any) => {
      return address.defaultYard === true;
    });
    if (getYardDefault.length === 0) {
      this.yardDefault = false;
    } else {
      this.yardDefault = true;
    }
    for (let i = 0; i < this.addressDetails.length; i++) {
      if (this.addressDetails[i].addressType === 'yard') {
        if (this.addressDetails[i].manual) {
          if (this.addressDetails[i].countryCode !== '' &&
            this.addressDetails[i].stateCode !== '' &&
            this.addressDetails[i].cityName !== '' &&
            this.addressDetails[i].zipCode !== '' &&
            this.addressDetails[i].address !== '') {
            this.yardAddress = true;
          }
        } else if (!this.addressDetails[i].manual) {
          if (this.addressDetails[i][`userLocation`] !== '') {
            this.yardAddress = true;
          }
        }
        break;
      } else {
        this.yardAddress = false;
      }
    }
    if (this.yardAddress && this.yardDefault) {
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
        bizCountry: this.bizCountry,
        firstName: this.firstName,
        lastName: this.lastName,
        liabilityInsurance: this.liabilityInsurance,
        password: this.password,
        addressDetails: this.addressDetails,
        phone: this.phone,
        fax: this.fax,
        
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
      if(this.findingWay=="Referral"){
        data["referral"]=this.referral
      }
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
        complete: () => {

         },
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
              next: () => { this.submitDisabled = true; },
            });
        },
        next: (res) => {
          localStorage.setItem("isProfileComplete","true")
          this.predefinedAccounts();
          this.response = res;
          this.submitDisabled = true;
          this.toaster.success('Carrier completed successfully.');
          this.router.navigate(['/Map-Dashboard'])
        },
      });
    } else {
      this.toaster.error('Yard address is mandatory and atleast one yard as default is mandatory');
    }

  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        if (v === 'userName' || v === 'email' || v === 'carrierName') {
          $('[name="' + v + '"]')
            .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
            .addClass('error');
        }
        if (v === 'cognito') {
          this.toaster.error(this.errors[v]);
        }
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
    const files = [...event.target.files];
    this.uploadedPhotos = [];
    this.uploadedPhotos.push(files[0]);
  }
  validatePassword(password) {
    let passwordVerify = passwordStrength(password)
    if (passwordVerify.contains.includes('lowercase')) {
      this.passwordValidation.lowerCase = true;
    } else {
      this.passwordValidation.lowerCase = false;
    }

    if (passwordVerify.contains.includes('uppercase')) {
      this.passwordValidation.upperCase = true;
    } else {
      this.passwordValidation.upperCase = false;
    }
    if (passwordVerify.contains.includes('symbol')) {
      this.passwordValidation.specialCharacters = true;
    } else {
      this.passwordValidation.specialCharacters = false;
    }
    if (passwordVerify.contains.includes('number')) {
      this.passwordValidation.number = true;
    } else {
      this.passwordValidation.number = false;
    }
    if (passwordVerify.length >= 8) {
      this.passwordValidation.length = true;
    } else {
      this.passwordValidation.length = false;
    }
    if (password.includes('.') || password.includes('-')) {
      this.passwordValidation.specialCharacters = true;
    }
  }
}

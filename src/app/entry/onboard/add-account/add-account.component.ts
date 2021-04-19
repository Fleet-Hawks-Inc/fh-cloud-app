import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HereMapService } from '../../../services';
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {  PasswordValidator, ParentErrorStateMatcher} from '../../validators';
declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  // @ViewChild('carrierForm', null) carrierForm: NgForm;
  userDetailsForm: FormGroup;
  matching_passwords_group: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  username: string;
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
  findingWay: string;
  firstName = '';
  lastName = '';
  liabilityInsurance = '';
  password = '';
  confirmPassword = '';
  phone = '';
  bizCountry = null;
  uploadedLogo = '';
  // fleets: {
  //   curtainSide: number;
  //   dryVans: number;
  //   flatbed: number;
  //   reefers: number;
  //   totalFleets: number;
  //   trailers: number;
  //   trucks: number;
  // };
    curtainSide: number;
    dryVans: number;
    flatbed: number;
    reefers: number;
    totalFleets: number;
    trailers: number;
    trucks: number;

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
  // bank = {
  //   branchName: '',
  //   // accountNumber: '',
  //   // transitNumber: '',
  //   // routingNumber: '',
  //   // institutionNumber: '',
  // };
  branchName: string;
  accountNumber: number;
  transitNumber: number;
  routingNumber: number;
  institutionNumber: number;
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
  // front end validation
  errorEIN = false;
  errorMC = false;
  errorDOT = false;
  errorCCC = false;
  errorSCAC = false;
  errorRouting = false;
  errorTransit = false;
  errorInstitution = false;
  errorAccount = false;


  validation_messages = {
    'firstName': [
      { type: 'required', message: 'First name is required' },
      { type: 'pattern', message: 'First name must contain only letters' },
    ],
    'lastName': [
      { type: 'required', message: 'Last name is required' },
      { type: 'pattern', message: 'Last name must contain only letters' },
    ],
    'userName': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 8 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and small letters' },
        ],
        'confirmPassword': [
          { type: 'required', message: 'Confirm password is required' },
          { type: 'areEqual', message: 'Password mismatch' }
        ],
        'password': [
          { type: 'required', message: 'Password is required' },
          { type: 'minlength', message: 'Password must be at least 5 characters long' },
          { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
        ],
        'email': [
          { type: 'required', message: 'Email is required' },
          { type: 'pattern', message: 'Enter a valid email' }
        ],
        'carrierName': [
          { type: 'required', message: 'Carrier name is required' },
          { type: 'pattern', message: 'Carrier name must contain only letters and numbers and no special characters.' },
        ],
        'phone': [
          { type: 'required', message: 'Phone is required' },
         // { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
        ],
        'EIN': [
          { type: 'pattern', message: 'EIN must be 9 characters.' },
        ],
  };
  constructor(private apiService: ApiService,
    private toaster: ToastrService, private location: Location, private HereMap: HereMapService,
    private fb: FormBuilder) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.fetchCountries();
    this.searchLocation(); // search location on keyup
    $(document).ready(() => {
      this.carrierForm = $('#carrierForm').validate();
    });
    this.createForms();
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

    // const data = {
    //   entityType: 'carrier',
    //   CCC: this.CCC,
    //   DBAName: this.DBAName,
    //   DOT: this.DOT,
    //   EIN: this.EIN,
    //   MC: this.MC,
    //   SCAC: this.SCAC,
    //   cargoInsurance: this.cargoInsurance,
    //   email: this.email,
    //   userName: this.userName,
    //   CTPAT: this.CTPAT,
    //   CSA: this.CSA,
    //   PIP: this.PIP,
    //   carrierName: this.carrierName.trim(),
    //   findingWay: this.findingWay,
    //   bizCountry: this.bizCountry,
    //   firstName: this.firstName,
    //   lastName: this.lastName,
    //   liabilityInsurance: this.liabilityInsurance,
    //   password: this.password,
    //   confirmPassword: this.confirmPassword,
    //   addressDetails: this.addressDetails,
    //   phone: this.phone,
    //   fleets: {
    //     curtainSide: this.fleets.curtainSide,
    //     dryVans: this.fleets.dryVans,
    //     flatbed: this.fleets.flatbed,
    //     reefers: this.fleets.reefers,
    //     totalFleets: this.fleets.totalFleets,
    //     trailers: this.fleets.trailers,
    //     trucks: this.fleets.trucks
    //   },
    //   bank: this.bank
    // };
    // create form data instance
    const formData = new FormData();
    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }
    // append other fields
   // formData.append('data', JSON.stringify(data));
    this.apiService.postData('carriers/add', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
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
    this.uploadedPhotos.push(files[0]);
  }

  // FRONT END VALIDATION
  EINValidation(e) {
    const EIN = e.target.value;
    if (EIN.length == 0) {
      this.errorEIN = false;
    } else {
      if (EIN.length != 9) {
        this.errorEIN = true;
      }
      else {
        this.errorEIN = false;
      }
    }

  }
  MCValidation(e) {
    const MC = e.target.value;
    if (MC.length == 0) {
      this.errorMC = false;
    } else {
      if (MC.length != 6) {
        this.errorMC = true;
      }
      else {
        this.errorMC = false;
      }
    }
  }
  DOTValidation(e) {
    const DOT = e.target.value;
    if (DOT.length === 0) {
      this.errorDOT = false;
    } else {
      if (DOT.length !== 8) {
        this.errorDOT = true;
      }
      else {
        this.errorDOT = false;
      }
    }
  }

  CCCValidation(e) {
    const CCC = e.target.value;
    if (CCC.length === 0) {
      this.errorCCC = false;
    } else {
      if (CCC.length !== 4) {
        this.errorCCC = true;
      }
      else {
        this.errorCCC = false;
      }
    }
  }
  SCACValidation(e) {
    const SCAC = e.target.value;
    if (SCAC.length === 0) {
      this.errorSCAC = false;
    } else {
      if (SCAC.length !== 4) {
        this.errorSCAC = true;
      }
      else {
        this.errorSCAC = false;
      }
    }
  }

  routingValidation(e) {
    const routing = e.target.value;
    if (routing.length === 0) {
      this.errorRouting = false;
    } else {
      if (routing.length !== 9) {
        this.errorRouting = true;
      }
      else {
        this.errorRouting = false;
      }
    }
  }
  transitValidation(e) {
    const transit = e.target.value;
    if (transit.length === 0) {
      this.errorTransit = false;
    } else {
      if (transit.length !== 9) {
        this.errorTransit = true;
      }
      else {
        this.errorTransit = false;
      }
    }
  }
  institutionValidation(e) {
    const instiution = e.target.value;
    if (instiution.length === 0) {
      this.errorInstitution = false;
    } else {
      if (instiution.length !== 3) {
        this.errorInstitution = true;
      }
      else {
        this.errorInstitution = false;
      }
    }
  }
  accountValidation(e) {
    const account = e.target.value;
    if (account.length === 0) {
      this.errorAccount = false;
    } else {
      if (account.length > 12 || account.length < 7) {
        this.errorAccount = true;
      }
      else {
        this.errorAccount = false;
      }
    }
  }
  userNameValidationFn(e) {
    const newString = e.target.value;
    this.userName = newString.toLowerCase();
  }

  createForms() {
     // matching passwords validation
    //  this.matching_passwords_group = new FormGroup({
    //   password: new FormControl('', Validators.compose([
    //     Validators.minLength(5),
    //     Validators.required,
    //     Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9//#]+$')
    //   ])),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, (formGroup: FormGroup) => {
    //   return PasswordValidator.areEqual(formGroup);
    // });
    // user details form validations
    this.userDetailsForm = this.fb.group({
    //   firstName: new FormControl('', Validators.compose([
    //     Validators.pattern('^[a-zA-Z]+$'),
    //     Validators.required
    //   ])),
    //   lastName: new FormControl('', Validators.compose([
    //     Validators.pattern('^[a-zA-Z]+$'),
    //     Validators.required
    //   ])),
    //   userName: new FormControl('', Validators.compose([
    //     Validators.maxLength(25),
    //     Validators.minLength(8),
    //     Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$'),
    //     Validators.required
    //    ])),
    //    matching_passwords: this.matching_passwords_group,
    //    email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    //   ])),
    //  findingWay: this.findingWay,
    //  carrierName: new FormControl('', Validators.compose([
    //   Validators.pattern('^[a-zA-Z0-9.\\s]+$'),
    //   Validators.required
    // ])),
    // phone: new FormControl('', Validators.compose([
    //   // Validators.pattern('^[a-zA-Z]+$'),
    //   Validators.required
    // ])),
    // EIN: new FormControl('', Validators.compose([
    //   Validators.pattern('^[0-9]+$'),
    // ])),
  // fleets: {
    //   totalFleets: this.totalFleets,
    //   trucks : this.trucks,
    //   curtainSide: this.curtainSide,
    // dryVans: this.dryVans,
    // flatbed: this.flatbed,
    // reefers: this.reefers,
    // trailers: this.trailers,
    // DBAName: this.DBAName,
    // bizCountry: this.bizCountry,
    // liabilityInsurance: this.liabilityInsurance,
    // cargoInsurance: this.cargoInsurance,
    // CCC: this.CCC,
    // SCAC: this.SCAC,
    // MC: this.MC,
    // DOT: this.DOT,
    // CSA: this.CSA,
    // CTPAT: this.CTPAT,
    // PIP: this.PIP,
    //   branchName: this.branchName,
    //   accountNumber: this.accountNumber,
    //   routingNumber: this.routingNumber,
    //   transitNumber: this.transitNumber,
    //   institutionNumber: this.institutionNumber,
      // uploadedPhotos: this.uploadedPhotos
      addressDetails: new FormArray([])
    });
  }
  onSubmitUserDetails(value) {
    console.log(value);
  }

}

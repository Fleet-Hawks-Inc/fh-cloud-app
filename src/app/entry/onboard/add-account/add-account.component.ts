import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { from, Subject, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AwsUploadService } from '../../../services';
import { NgForm } from '@angular/forms';
import { HereMapService } from '../../../services';
declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  @ViewChild('carrierForm', null) carrierForm: NgForm;
  Asseturl = this.apiService.AssetUrl;
  carrierID: string;
  activeTab = 1;

  CCC = '';
  DBAName = '';
  DOT = '';
  EIN = '';
  MC = '';
  SCAC = '';
  cargoInsurance = '';
  email = '';
  carrierName = '';
  carrierBusinessName = '';
  findingWay = '';
  firstName = '';
  lastName = '';
  liabilityInsurance = '';
  password = '';
  confirmPassword = '';
  phone = '';
  // uploadedLogo = '';
  fleets = {
    curtainSide: 0,
    dryVans: 0,
    flatbed: 0,
    reefers: 0,
    totalFleets: 0,
    trailers: 0,
    trucks: 0,
  };
  addressDetails = [{
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
  }];
  bank = {
    branchName: '',
    accountNumber: '',
    routingNumber: '',
    institutionalNumber: '',
    addressDetails: [{
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
    }]
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
  form;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  errorClass: boolean = false;// to show error when password and confirm password don't match
  Error = '';
  Success = '';
  constructor(private apiService: ApiService, private toaster: ToastrService, private awsUS: AwsUploadService, private HereMap: HereMapService,) {
    this.selectedFileNames = new Map<any, any>();
  }

  ngOnInit() {
    this.fetchCountries();
    this.fetchBankCountries();
    this.searchLocation(); // search location on keyup
    this.searchBankLocation(); // search location on keyup
    $(document).ready(() => {
      this.form = $('#carrierForm').validate();
    });
  }
  /**
   * address
   */
  clearUserLocation(i) {
    this.addressDetails[i]['userLocation'] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.addressDetails[i]['userLocation'] = '';
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
    let result = this.citiesObject[id];
    this.addressDetails[i].cityName = result;
  }
  addAddress() {
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
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
        this.countries.map(elem => {
          if (elem.countryName == 'Canada' || elem.countryName == 'United States of America') {
            this.addressCountries.push({ countryName: elem.countryName, countryID: elem.countryID })
          }
        })

      });
  }
  async fetchCountriesByName(name: string, i) {
    let result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID, i);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string, i) {
    let result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID, i);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchCitiesByName(name: string) {
    let result = await this.apiService.getData(`cities/get/${name}`)
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
    });
  }
  async userAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    this.addressDetails[i]['userLocation'] = result.address.label;
    this.addressDetails[i].geoCords.lat = result.position.lat;
    this.addressDetails[i].geoCords.lng = result.position.lng;
    this.addressDetails[i].countryName = result.address.countryName;
    $('div').removeClass('show-search__result');
    this.addressDetails[i].stateName = result.address.state;
    this.addressDetails[i].cityName = result.address.city;
    this.addressDetails[i].countryID = '';// empty the fields if manual is false (if manual was true IDs were stored)
    this.addressDetails[i].stateID = '';
    this.addressDetails[i].cityID = '';
    this.addressDetails[i].zipCode = '';

    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
  }
  /**
   * bank address
   */
  clearBankLocation(i) {
    this.bank.addressDetails[i]['userLocation'] = '';
    $('div').removeClass('show-search__result');
  }
  public searchBankTerm = new Subject<string>();
  public searchBankResults: any;
  userLocationBank: any;
  statesObjectBank: any = {};
  countriesObjectBank: any = {};
  citiesObjectBank: any = {};
  newAddressBank = [];
  addressCountriesBank = [];
  deletedAddressBank = [];
  selectedFilesBank: FileList;
  selectedFileNamesBank: Map<any, any>;
  uploadedDocsBank = [];
  showAddressBank = false;
  countriesBank = [];
  statesBank = [];
  citiesBank = [];
  addBankAddress() {
    this.bank.addressDetails.push({
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
  manBankAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.bank.addressDetails[i]['userLocation'] = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  fetchBankCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countriesBank = result.Items;
        this.countriesBank.map(elem => {
          if (elem.countryName == 'Canada' || elem.countryName == 'United States of America') {
            this.addressCountriesBank.push({ countryName: elem.countryName, countryID: elem.countryID });
          }
        })
      });
  }
  async getBankStates(id: any, oid = null) {
    if (oid != null) {
      this.bank.addressDetails[oid].countryName = this.countriesObjectBank[id];
    }
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.statesBank = result.Items;
      });
  }

  async getBankCities(id: any, oid = null) {
    if (oid != null) {
      this.bank.addressDetails[oid].stateName = this.statesObjectBank[id];
    }
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.citiesBank = result.Items;
      });
  }
  async fetchBankCountriesByName(name: string, i) {
    let result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID, i);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchBankStatesByName(name: string, i) {
    let result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID, i);
      return result.Items[0].stateID;
    }
    return '';
  }

  async fetchBankCitiesByName(name: string) {
    let result = await this.apiService.getData(`cities/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      return result.Items[0].cityID;
    }
    return '';
  }
  fetchAllBankStatesIDs() {
    this.apiService.getData('states/get/list')
      .subscribe((result: any) => {
        this.statesObjectBank = result;
      });
  }
  fetchAllBankCountriesIDs() {
    this.apiService.getData('countries/get/list')
      .subscribe((result: any) => {
        this.countriesObjectBank = result;
      });
  }
  fetchAllBankCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObjectBank = result;
      });
  }
  getBankCityName(i, id: any) {
    let result = this.citiesObject[id];
    this.bank.addressDetails[i].cityName = result;
  }
  public searchBankLocation() {
    let target;
    this.searchBankTerm.pipe(
      map((e: any) => {
        $('.map-search__resultsBank').hide();
        $(e.target).closest('div').addClass('show-search__resultBank');
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
      this.searchBankResults = res;
    });
  }
  async bankAddress(i, item) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    this.bank.addressDetails[i]['bankLocation'] = result.address.label;
    this.bank.addressDetails[i].geoCords.lat = result.position.lat;
    this.bank.addressDetails[i].geoCords.lng = result.position.lng;
    this.bank.addressDetails[i].countryName = result.address.countryName;
    $('div').removeClass('show-search__resultBank');
    this.bank.addressDetails[i].stateName = result.address.state;
    this.bank.addressDetails[i].cityName = result.address.city;
    this.bank.addressDetails[i].countryID = '';
    this.bank.addressDetails[i].stateID = '';
    this.bank.addressDetails[i].cityID = '';
    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
  }
  removeBankAddress(obj, i, addressID = null) {
    if (obj === 'address') {
      if (addressID != null) {
        this.deletedAddressBank.push(addressID);
      }
      this.bank.addressDetails.splice(i, 1);
    }
  }
  async onSubmit() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    if(this.password === this.confirmPassword && this.password != ''){
    for (let i = 0; i < this.addressDetails.length; i++) {
      const element = this.addressDetails[i];
      if (element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
    ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        if (result.items.length > 0) {
          result = result.items[0];
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }
    for (let i = 0; i < this.bank.addressDetails.length; i++) {
      const element = this.bank.addressDetails[i];
      if (element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObjectBank[element.cityID]}
    ${this.statesObjectBank[element.stateID]} ${this.countriesObjectBank[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        if (result.items.length > 0) {
          result = result.items[0];
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }

    const data = {
      CCC: this.CCC,
      DBAName: this.DBAName,
      DOT: this.DOT,
      EIN: this.EIN,
      MC: this.MC,
      SCAC: this.SCAC,
      cargoInsurance: this.cargoInsurance,
      email: this.email,
      carrierName: this.carrierName,
      findingWay: this.findingWay,
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
      bank: this.bank
    };
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }
    //append other fields
    formData.append('data', JSON.stringify(data));
    this.apiService.postData('carriers', formData, true).subscribe({
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
        this.toaster.success('Account Added successfully');
      },
    });
  }else{
    this.errorClass = true;
    this.activeTab = 1;
  }
  }
  throwErrors() {
    console.log(this.errors);
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
    // this.vehicleForm.showErrors(this.errors);
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
  next() {
    this.activeTab++;
    console.log('active tab', this.activeTab);
  }

  previous() {
    this.activeTab--;
    console.log('active tab', this.activeTab);
  }

  changeTab(value) {
    this.activeTab = value;
    console.log('active tab', this.activeTab);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../../../services';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import {Auth} from 'aws-amplify';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
declare var $: any;
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  Asseturl = this.apiService.AssetUrl;
  public contactID;
  title = 'Add User';
  isCarrierID = '';
  currentUser: any = '';
  carrierID: '';
  userForm;
  userData = {
    companyName: this.currentUser,
    dbaName: '',
    firstName: '',
    lastName: '',
    employeeID: '',
    dateOfBirth: '',
    workPhone: '',
    workEmail: '',
    entityType: 'employee',
    loginEnabled: false,
    paymentDetails: {
      payrollType: '',
      payrollRate: '',
      payrollRateUnit: '',
      payPeriod: '',
      SIN: '',
      WCB: '',
      healthCare: ''
    },
    address: [{
      addressType: '',
      countryCode: '',
      countryName: '',
      stateCode: '',
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
      states: [],
      cities: []
    }],
    userAccount: {
      contractStartDate: '',
      contractEndDate: '',
      department: '',
      designation: ''
    },
    userData : {
      username: '',
      userType: '',
      password: '',
      confirmPassword: ''
    }
  };
  loginDiv = false;
  fieldvisibility = 'false';
  uploadedPhotos: any  = [];
  errors = {};
  userDisabled = false;
  public searchTerm = new Subject<string>();
  public searchResults: any;
  userLocation: any;
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  totalRecords = 20;
  pageLength = 10;
  lastEvaluatedKey = '';
  userList: any = [];
  userNext = false;
  userPrev = true;
  userDraw = 0;
  start: any = '';
  end: any = '';
  userPrevEvauatedKeys = [''];
  userStartPoint = 1;
  userEndPoint = this.pageLength;
  ngOnInit() {
    this.getCurrentuser();
    this.searchLocation();
  }
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private HereMap: HereMapService,
    private location: Location,
  )
{ }
  getCurrentuser = async () => {
    this.isCarrierID = localStorage.getItem('carrierID');
    if(this.isCarrierID === undefined || this.isCarrierID === null) {
      let usr = (await Auth.currentSession()).getIdToken().payload;
      this.isCarrierID = usr.carrierID;
    }
  }
  // ADDRESS Section
  addAddress() {
    this.userData.address.push({
      addressType: '',
      countryCode: '',
      countryName: '',
      stateCode: '',
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
      states: [],
      cities: []
    });
  }
  removeAddress(index: any) {
      this.userData.address.splice(index, 1);
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
    this.userData.address[i][`userLocation`] = result.address.label;
    this.userData.address[i].geoCords.lat = result.position.lat;
    this.userData.address[i].geoCords.lng = result.position.lng;
    this.userData.address[i].countryName = result.address.countryName;
    this.userData.address[i].countryCode = result.address.countryCode;
    this.userData.address[i].stateCode = result.address.stateCode;
    this.userData.address[i].stateName = result.address.state;
    this.userData.address[i].cityName = result.address.city;
    this.userData.address[i].zipCode = result.address.postalCode;
    $('div').removeClass('show-search__result');
    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
  }
  getStates(countryCode: any, index:any) {
    this.userData.address[index].stateCode = '';
    this.userData.address[index].cityName = '';
    this.userData.address[index].states = CountryStateCity.GetStatesByCountryCode([countryCode]);
  }
   getCities(stateCode: any, index: any, countryCode: any) {
    this.userData.address[index].cityName = '';
    this.userData.address[index].countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.userData.address[index].stateName = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.userData.address[index].cities   = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  clearUserLocation(i) {
    this.userData.address[i][`userLocation`] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.userData.address[i][`userLocation`] = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  selectPhoto(event) {
    let files = [...event.target.files];
    this.uploadedPhotos = [];
    this.uploadedPhotos.push(files[0]);
    console.log('this.uploadedPhotos',this.uploadedPhotos);
  }
 async addUser() {
    this.hasError = false;
    this.hasSuccess = false;
    this.userDisabled = true;
    this.hideErrors();
    // this.spinner.show();
    for (let i = 0; i < this.userData.address.length; i++) {
      const element = this.userData.address[i];
      delete element.states;
      delete element.cities;
      if (element.countryName !== '' && element.stateName !== '' && element.cityName !== '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);
        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }
console.log('userdata', this.userData);
    // create form data instance
    const formData = new FormData();

    // append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append other fields
    formData.append('data', JSON.stringify(this.userData));
    // this.lastEvaluatedKeyStaff = '';

    this.apiService.postData('contacts', formData, true).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
              //  val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.throwErrors();
                this.userDisabled = false;
              },
              error: () => {
                this.userDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
         // this.spinner.hide();
          this.response = res;
          this.userDisabled = false;
          this.hasSuccess = true;
          this.location.back();
          this.toastr.success('User Added Successfully');
        }
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



}

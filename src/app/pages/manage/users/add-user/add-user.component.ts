import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../../../services';
import { from, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HereMapService } from '../../../../services';
import { Auth } from 'aws-amplify';

import { ActivatedRoute } from '@angular/router';
import { passwordStrength } from 'check-password-strength'
import { HttpClient } from '@angular/common/http'
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
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
  suggestedUsers = [];
  searchUserName = '';
  userData = {
    cName: '',
    dba: '',
    firstName: '',
    lastName: '',
    employeeID: '',
    dateOfBirth: null,
    workPhone: '',
    workEmail: '',
    eTypes: ['employee'],
    profileImg: '',
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
    adrs: [{
      aType: null,
      cCode: null,
      cName: '',
      sCode: null,
      sName: null,
      ctyName: null,
      zip: '',
      add1: '',
      add2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      isSuggest: false,
      userLoc: '',
      manual: false,
      houseNo: '',
      street: '',
      states: [],
      cities: []
    }],
    userAccount: {
      contractStartDate: null,
      contractEndDate: null,
      department: '',
      designation: ''
    },
    currentStatus: 'active',
    userLoginData: {
      userName: '',
      userRoles: '',
      password: '',
      confirmPassword: ''
    }
  };
  submitDisabled = false;
  public profilePath: any = '';
  public detailImgPath: any = 'assets/img/driver/driver.png';
  public defaultProfilePath: any = '';
  imageText = 'Add Picture';
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  loginDiv = false;
  fieldvisibility = 'false';
  uploadedPhotos: any = [];
  errors = {};
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
  isEdit = false;
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  };
  enableUserLogin = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  userRoles: any = [];

  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private HereMap: HereMapService,
    private location: Location,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private countryStateCity: CountryStateCityService
  ) { }


  ngOnInit() {
    this.contactID = this.route.snapshot.params[`contactID`];
    if (this.contactID) {
      this.title = 'Edit User';
     // this.fetchUserByID();
      this.isEdit = true;
    } else {
      this.title = 'Add User';
    }
    this.fetchUserRoles();
    this.getCurrentuser();
    this.searchLocation();
  }

  fetchUserRoles() {
    this.httpClient.get('assets/jsonFiles/user/userRoles.json').subscribe((data: any) => {
      this.userRoles = data;
    }
    );

  }
  getCurrentuser = async () => {
    this.isCarrierID = localStorage.getItem('carrierID');
    if (this.isCarrierID === undefined || this.isCarrierID === null) {
      let usr = (await Auth.currentSession()).getIdToken().payload;
      this.isCarrierID = usr.carrierID;
    }
  }
  // ADDRESS Section
  addAddress() {
    this.userData.adrs.push({
      aType: null,
      cCode: null,
      cName: null,
      sCode: null,
      sName: '',
      ctyName: '',
      zip: '',
      add1: '',
      add2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLoc: '',
      manual: false,
      houseNo: '',
      street: '',
      isSuggest: false,
      states: [],
      cities: []
    });
  }
  removeAddress(index: any) {
    this.userData.adrs.splice(index, 1);
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
  async getAddressDetail(id) {
    let result = await this.apiService
      .getData(`pcMiles/detail/${id}`).toPromise();
    return result;
  }
  async userAddress(i, item) {
    let result = await this.getAddressDetail(item.place_id);
    result = result.items[0];
    this.userData.adrs[i].geoCords.lat = result.position.lat;
    this.userData.adrs[i].geoCords.lng = result.position.lng;
    this.userData.adrs[i].cName = result.address.CountryFullName;
    this.userData.adrs[i].sName = result.address.StateName;
    this.userData.adrs[i].ctyName = result.address.City;

    this.userData.adrs[i].cCode = result.address.Country;
    this.userData.adrs[i].sCode = result.address.State;
    this.userData.adrs[i].zip = result.address.Zip;
    this.userData.adrs[i].street = result.address.StreetAddress;
    this.userData.adrs[i].isSuggest = true;
    $('div').removeClass('show-search__result');
    if (result.adrs.houseNo === undefined) {
      result.adrs.houseNo = '';
    }
    if (result.adrs.street === undefined) {
      result.adrs.street = '';
    }
  }
  async getStates(countryCode: any, index: any) {
    this.userData.adrs[index].sCode = '';
    this.userData.adrs[index].cName = '';
    this.userData.adrs[index].states = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
  }
  async getCities(stateCode: any, index: any, countryCode: any) {
    this.userData.adrs[index].cName = '';
    this.userData.adrs[index].cName = await this.countryStateCity.GetSpecificCountryNameByCode(countryCode);
    this.userData.adrs[index].sName = await this.countryStateCity.GetStateNameFromCode(stateCode, countryCode);
    this.userData.adrs[index].cities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  async fetchStates(countryCode: any, index: any) {
    this.userData.adrs[index].states = await this.countryStateCity.GetStatesByCountryCode([countryCode]);
  }
  async fetchCities(countryCode: any, stateCode: any, index: any) {
    this.userData.adrs[index].cities = await this.countryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
  }
  clearUserLocation(i) {
    this.userData.adrs[i][`userLocation`] = '';
    $('div').removeClass('show-search__result');
  }
  manAddress(event, i) {
    if (event.target.checked) {
      $(event.target).closest('.address-item').addClass('open');
      this.userData.adrs[i][`userLocation`] = '';
      this.userData.adrs[i].cCode = '';
      this.userData.adrs[i].sCode = '';
      this.userData.adrs[i].cName = '';
      this.userData.adrs[i].sName = '';
      this.userData.adrs[i].ctyName = '';
      this.userData.adrs[i].zip = '';
      this.userData.adrs[i].add1 = '';
      this.userData.adrs[i].add2 = '';
    } else {
      $(event.target).closest('.address-item').removeClass('open');
      this.userData.adrs[i][`userLocation`] = '';
      this.userData.adrs[i].cCode = '';
      this.userData.adrs[i].sCode = '';
      this.userData.adrs[i].cName = '';
      this.userData.adrs[i].sName = '';
      this.userData.adrs[i].ctyName = '';
      this.userData.adrs[i].zip = '';
      this.userData.adrs[i].add1 = '';
      this.userData.adrs[i].add2 = '';
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  // Show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }
  selectPhoto(event) {
    let files = [...event.target.files];
    this.uploadedPhotos = [];
    this.uploadedPhotos.push(files[0]);
  }
  async newGeoCode(data: any) {
    let result = await this.apiService
      .getData(`pcMiles/geocoding/${encodeURIComponent(JSON.stringify(data))}`)
      .toPromise();

    if (result.items !== undefined && result.items.length > 0) {
      return result.items[0].position;
    }
  }
  async onAddUser() {

    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    // this.spinner.show();
    for (let i = 0; i < this.userData.adrs.length; i++) {
      const element = this.userData.adrs[i];
      delete element.states;
      delete element.cities;

      if (element.manual === true) {
        let data = {
          add1: element.add1,
          add2: element.add2,
          ctyName: element.ctyName,
          sName: element.sName,
          cName: element.cName,
          zip: element.zip,
        };

        $('#addErr' + i).css('display', 'none');
        let result = await this.newGeoCode(data);

        if (result == null) {
          $('#addErr' + i).css('display', 'block');
          return false;
        }
        if (result !== undefined || result != null) {
          element.geoCords = result;
        }
      } else {
        $('#addErr' + i).css('display', 'none');
        if (element.isSuggest !== true && element.userLoc !== '') {
          $('#addErr' + i).css('display', 'block');
          return;
        }
      }
    }
    // for (let i = 0; i < this.userData.adrs.length; i++) {
    //   const element = this.userData.adrs[i];
    //   delete element.states;
    //   delete element.cities;
    //   if (element.cName !== '' && element.sName !== '' && element.ctyName !== '') {
    //     const fullAddress = `${element.add1} ${element.add2} ${element.cName}
    //     ${element.sName} ${element.ctyName}`;
    //     let result = await this.HereMap.geoCode(fullAddress);
    //     result = result.items[0];
    //     element.geoCords.lat = result.position.lat;
    //     element.geoCords.lng = result.position.lng;
    //   }
    // }
    console.log('userdata', this.userData);
    this.userData.userLoginData.userName = this.userData.userLoginData.userName.toLowerCase();
    // create form data instance
    const formData = new FormData();

    // append photos if any
    for (let i = 0; i < this.uploadedPhotos.length; i++) {
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    // append other fields
    formData.append('data', JSON.stringify(this.userData));
    this.submitDisabled = true;
    // this.lastEvaluatedKeyStaff = '';
    this.apiService.postData('contacts/user/add', formData, true).
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
                this.submitDisabled = false;

              },
              error: () => {
                this.submitDisabled = false;

              },
              next: () => { },
            });
        },
        next: (res) => {
          // this.spinner.hide();
          this.response = res;
          this.submitDisabled = false;
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

  // fetchUserByID() {
  //   this.apiService.getData('contacts/detail/' + this.contactID).subscribe(async (result: any) => {
  //     result = result.Items[0];
  //     this.userData = {
  //       cName: result.cName,
  //       dba: result.dba,
  //       firstName: result.firstName,
  //       lastName: result.lastName,
  //       employeeID: result.employeeID,
  //       dateOfBirth: result.dateOfBirth,
  //       workPhone: result.workPhone,
  //       workEmail: result.workEmail,
  //       entityType: 'employee',
  //       loginEnabled: result.loginEnabled,
  //       profileImg: result.profileImg,
  //       currentStatus: result.currentStatus,
  //       paymentDetails: {
  //         payrollType: result.paymentDetails.payrollType,
  //         payrollRate: result.paymentDetails.payrollRate,
  //         payrollRateUnit: result.paymentDetails.payrollRateUnit,
  //         payPeriod: result.paymentDetails.payPeriod,
  //         SIN: result.paymentDetails.SIN,
  //         WCB: result.paymentDetails.WCB,
  //         healthCare: result.paymentDetails.healthCare,
  //       },
  //       address: result.address,
  //       userAccount: {
  //         contractStartDate: result.userAccount.contractStartDate,
  //         contractEndDate: result.userAccount.contractEndDate,
  //         department: result.userAccount.department,
  //         designation: result.userAccount.designation,
  //       },
  //       userLoginData: {
  //         userName: result.userLoginData.userName,
  //         userRoles: result.userLoginData.roles,
  //         password: '',
  //         confirmPassword: ''
  //       }
  //     };
  //     if (this.userData.address !== undefined) {
  //       for (let a = 0; a < this.userData.address.length; a++) {
  //         const countryCode = this.userData.address[a].countryCode;
  //         const stateCode = this.userData.address[a].stateCode;
  //         await this.fetchStates(countryCode, a);
  //         await this.fetchCities(countryCode, stateCode, a);
  //       }
  //     }
  //     if (this.userData.loginEnabled === true) {
  //       this.enableUserLogin = true;
  //     } else {
  //       this.enableUserLogin = false;
  //     }
  //     this.userData[`timeCreated`] = result.timeCreated;
  //     this.userData[`createdDate`] = result.createdDate;
  //     this.userData[`createdTime`] = result.createdTime;
  //     // to show profile image
  //     if (result.profileImg !== '' && result.profileImg !== undefined) {
  //       this.profilePath = `${this.Asseturl}/${result.carrierID}/${result.profileImg}`;
  //       this.imageText = 'Update Picture';
  //     }
  //   });
  // }
  scrollError() {
    let errorList;
    setTimeout(() => {
      errorList = document.getElementsByClassName('error').length;
      if (errorList > 0) {
        let topPosition: any = $('.error').parent('div').offset().top;
        window.scrollTo({ top: topPosition - 150, left: 0, behavior: 'smooth' });
      }
    }, 1500);
  }
  // async onUpdateUser() {
  //   this.hasError = false;
  //   this.hasSuccess = false;
  //   this.submitDisabled = true;
  //   this.hideErrors();
  //   // this.spinner.show();
  //   this.userData[`contactID`] = this.contactID;
  //   if (this.userData.loginEnabled === false) {
  //     this.userData.userLoginData.userName = '';
  //   }
  //   for (let i = 0; i < this.userData.address.length; i++) {
  //     const element = this.userData.address[i];
  //     delete element.states;
  //     delete element.cities;
  //     if (element.countryName !== '' && element.stateName !== '' && element.cityName !== '') {
  //       const fullAddress = `${element.address1} ${element.address2} ${element.cityName}
  //       ${element.stateName} ${element.countryName}`;
  //       let result = await this.HereMap.geoCode(fullAddress);
  //       result = result.items[0];
  //       element.geoCords.lat = result.position.lat;
  //       element.geoCords.lng = result.position.lng;
  //     }
  //   }
  //   // create form data instance
  //   const formData = new FormData();

  //   // append photos if any
  //   for (let i = 0; i < this.uploadedPhotos.length; i++) {
  //     formData.append('uploadedPhotos', this.uploadedPhotos[i]);
  //   }
  //   // append other fields
  //   formData.append('data', JSON.stringify(this.userData));
  //   // this.lastEvaluatedKeyStaff = '';

  //   this.apiService.putData('contacts', formData, true).
  //     subscribe({
  //       complete: () => { },
  //       error: (err: any) => {
  //         from(err.error)
  //           .pipe(
  //             map((val: any) => {
  //               //  val.message = val.message.replace(/".*"/, 'This Field');
  //               this.errors[val.context.key] = val.message;
  //             })
  //           )
  //           .subscribe({
  //             complete: () => {
  //               this.throwErrors();
  //               this.submitDisabled = false;
  //             },
  //             error: () => {
  //               this.submitDisabled = false;
  //             },
  //             next: () => { },
  //           });
  //       },
  //       next: (res) => {
  //         // this.spinner.hide();
  //         this.response = res;
  //         this.submitDisabled = false;
  //         this.hasSuccess = true;
  //         this.location.back();
  //         this.toastr.success('User is updated successfully');
  //       }
  //     });
  // }
  validatePassword(password) {
    let passwordVerify = passwordStrength(password);
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

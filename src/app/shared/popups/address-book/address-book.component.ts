import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HereMapService, ListService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import {Auth} from 'aws-amplify';
import  Constants  from '../../../pages/fleet/constants';
import { environment } from 'src/environments/environment';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import * as _ from 'lodash';

declare var $: any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  @ViewChild("content", {static: false}) modalContent: TemplateRef<any>;
  Asseturl = this.apiService.AssetUrl;
  customers = [];
  brokers = [];
  vendors = [];
  carriers = [];
  shippers = [];
  receivers = [];
  staffs = [];
  fcCompanies = [];
  allData = [];
  form;
  countries;
  states;
  cities;
  public profilePath: any = 'assets/img/driver/driver.png';
  public detailImgPath: any = 'assets/img/driver/driver.png';
  public defaultProfilePath: any = 'assets/img/driver/driver.png';
  imageText = 'Add Picture';
  userLocation;
  manualAddress: boolean;
  manualAddress1: boolean;
  wsib: false;
  updateButton: boolean = false;
  addresses = [];
  // Customer Object
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
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

  // Broker Object
  brokerData = {
    companyName: '',
    dbaName: '',
    firstName: '',
    lastName: '',
    ein: '',
    mc: '',
    dot: '',
    workEmail: '',
    accountNumber: '',
    workPhone: '',
    entityType: 'broker',
    brokerType: 'company',
    address: [{
      addressType: '',
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
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      designation: '',
      phone: '',
      email: '',
      fax: '',
    }]
  };

  // ownerOperator Object
  ownerData = {
    companyName: '',
    dbaName: '',
    // firstName: '',
    // lastName: '',
    workPhone: '',
    workEmail: '',
    csa: false,
    paymentDetails: {
      fast: '',
      fastExpiry: '',
      payrollType: '',
      sin: '',
      payrollRate: '',
      payrollRateCurrency: '',
      payrollPercent: '',
      percentType: '',
      loadedMiles: '',
      loadedMilesCurrency: '',
      emptyMiles: '',
      emptyMilesCurrency: '',
      deliveryRate: '',
      deliveryRateCurrency: ''
    },
    entityType: 'ownerOperator',
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      designation: '',
      phone: '',
      email: '',
      fax: '',
    }]
  };

  // Vendor Object
  vendorData = {
    companyName: '',
    dbaName: '',
    accountNumber: '',
    // firstName: '',
    // lastName: '',
    workEmail: '',
    workPhone: '',
    preferedVendor: false,
    entityType: 'vendor',
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
  };

  // Carrier Object
  carrierData = {
    companyName: '',
    dbaName: '',
    // firstName: '',
    // lastName: '',
    workPhone: '',
    workEmail: '',
    csa: false,
    ctpat: false,
    pip: false,
    entityType: 'carrier',
    paymentDetails: {
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
      payrollType: '',
      payrollRate: '',
      payrollRateCurrency: '',
      payrollPercent: '',
      percentType: '',
      loadedMiles: '',
      loadedMilesCurrency: '',
      emptyMiles: '',
      emptyMilesCurrency: '',
      deliveryRate: '',
      deliveryRateCurrency: '',
      applyTax: false,
      wsib: false,
      wsibAccountNumber: '',
      wsibExpiry: ''
    },
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      designation: '',
      phone: '',
      email: '',
      fax: ''
    }]
  };

  // Shipper Object
  shipperData = {
    companyName: '',
    dbaName: '',
    // firstName: '',
    // lastName: '',
    mc: '',
    dot: '',
    workPhone: '',
    workEmail:'',
    entityType: 'consignor',
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      designation: '',
      phone: '',
      email: '',
      fax: ''
    }]
  };

  // Consignee Object
  consigneeData = {
    companyName: '',
    dbaName: '',
    // firstName: '',
    // lastName: '',
    mc: '',
    dot: '',
    workPhone: '',
    workEmail: '',
    entityType: 'consignee',
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    additionalContact: [{
      fullName: '',
      firstName: '',
      lastName: '',
      designation: '',
      phone: '',
      email: '',
      fax: ''
    }]
  };

  // fcCompany Object
  fcCompanyData = {
    companyName: '',
    dbaName: '',
    isDefault: false,
    // firstName: '',
    // lastName: '',
    workPhone: '',
    workEmail: '',
    entityType: 'factoringCompany',
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
      states: [],
      cities: []
    }],
    fcDetails: {
      accountNumber: '',
      factoringRate: '',
      factoringUnit: '',
    }
  };

   // Staff Object
   staffData = {
    companyName: '',
    dbaName: '',
    // firstName: '',
    // lastName: '',
    employeeID: '',
    dateOfBirth: '',
    workPhone: '',
    workEmail: '',
    entityType: 'staff',
    paymentDetails: {
      payrollType: '',
      payrollRate: '',
      payrollRateUnit: '',
      payPeriod: '',
      SIN: '',
      WCB: '',
      healthCare: ''
    },
    loginEnabled: false,
    address: [{
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
      userLocation: '',
      manual: false,
      countryCode: '',
      stateCode: '',
      houseNumber: '',
      street: '',
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
    },
  };

  userDetailData: any;
  userDetailTitle: string;

  public searchTerm = new Subject<string>();
  public searchResults: any;

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  private destroy$ = new Subject();
  errors = {};
  newAddress = [];
  showDriverModal: boolean = false;
  uploadedPhotos = [];
  ownerOperatorss = [];
  custCurrentTab = 1;
  statesObject = [];
  countriesObject = [];
  citiesObject = [];
  pageLength = 10;
  lastEvaluatedKeyCustomer = '';
  lastEvaluatedKeyBroker = '';
  lastEvaluatedKeyVendor = '';
  lastEvaluatedKeyCarrier = '';
  lastEvaluatedKeyOperator = '';
  lastEvaluatedKeyShipper = '';
  lastEvaluatedKeyConsignee = '';
  lastEvaluatedKeyStaff = '';
  lastEvaluatedKeyCompany = '';
  totalRecordsCustomer = 10;
  totalRecordsBroker = 10;
  totalRecordsVendor = 10;
  totalRecordsCarrier = 10;
  totalRecordsOperator = 10;
  totalRecordsShipper = 10;
  totalRecordsConsignee = 10;
  totalRecordsStaff = 10;
  totalRecordsCompany = 10;
  activeDiv = 'brokerTable';
  modalTitle = 'Add ';
  filterVal = {
    customerName : '',
    customerID: '',
    brokerID: '',
    brokerName: '',
    vendorID: '',
    vendorName: '',
    carrierID: '',
    carrierName: '',
    operatorID: '',
    operatorName: '',
    shipperID: '',
    shipperName: '',
    consigneeID: '',
    consigneeName: '',
    staffID: '',
    staffName: '',
    companyID: '',
    fcompanyName: '',

    shipperCompanyName: '',
    brokerCompanyName: '',
    carrierCompanyName: '',
    receiverCompanyName: '',
    customerCompanyName: '',
    staffCompanyName: '',
    factoringCompanyName: '',
    operatorCompanyName: '',
    vendorCompanyName: '',
  }

  //suggestions
  suggestedCustomers = [];
  suggestedBrokers = [];
  suggestedVendors = [];
  suggestedCarriers = [];
  suggestedOperators = [];
  suggestedShipper = [];
  suggestedConsignees = [];
  suggestedStaffs = [];
  suggestedCompany = [];

  //delete address arr's
  deleteCustomerAddr = [];
  deleteBrokerAddr = [];
  deleteVendorAddr = [];
  deleteCarrierAddr = [];
  deleteOperatorAddr = [];
  deleteShipperAddr = [];
  deleteConsigneeAddr = [];
  deleteStaffAddr = [];
  deleteCompanyAddr = [];
  loginDiv = false;

  errorClass = false;
  errorClassMsg = 'Password and Confirm Password must match and can not be empty.';
  fieldvisibility = 'false';
  newStaffUser = 'false';

  // manual pagination
  customerNext = false;
  customerPrev = true;
  customerDraw = 0;
  customerPrevEvauatedKeys = [''];
  custtStartPoint = 1;
  custtEndPoint = this.pageLength;
  brokerNext = false;
  brokerPrev = true;
  brokerDraw = 0;
  brokerPrevEvauatedKeys = [''];
  brokerStartPoint = 1;
  brokerEndPoint = this.pageLength;
  vendorNext = false;
  vendorPrev = true;
  vendorDraw = 0;
  vendorPrevEvauatedKeys = [''];
  vendorStartPoint = 1;
  vendorEndPoint = this.pageLength;
  carrierNext = false;
  carrierPrev = true;
  carrierDraw = 0;
  carrierPrevEvauatedKeys = [''];
  carrierStartPoint = 1;
  carrierEndPoint = this.pageLength;
  ownerOperatorNext = false;
  ownerOperatorPrev = true;
  ownerOperatorDraw = 0;
  ownerOperatorPrevEvauatedKeys = [''];
  ownerOperatorStartPoint = 1;
  ownerOperatorEndPoint = this.pageLength;
  shipperNext = false;
  shipperPrev = true;
  shipperDraw = 0;
  shipperPrevEvauatedKeys = [''];
  shipperStartPoint = 1;
  shipperEndPoint = this.pageLength;
  consigneeNext = false;
  consigneePrev = true;
  consigneeDraw = 0;
  consigneePrevEvauatedKeys = [''];
  consigneeStartPoint = 1;
  consigneeEndPoint = this.pageLength;
  staffNext = false;
  staffPrev = true;
  staffDraw = 0;
  staffPrevEvauatedKeys = [''];
  staffStartPoint = 1;
  staffEndPoint = this.pageLength;
  companyNext = false;
  companyPrev = true;
  companyDraw = 0;
  companyPrevEvauatedKeys = [''];
  companyStartPoint = 1;
  companyEndPoint = this.pageLength;

  suggestedShipperCompanies = [];
  suggestedBrokerCompanies = [];
  suggestedCarrierCompanies = [];
  suggestedConsigneeCompanies = [];
  suggestedCustomerCompanies = [];
  suggestedStaffCompanies = [];
  suggestedFactoringCompanies = [];
  suggestedOperatorCompanies = [];
  suggestedVendorCompanies = [];
  currentUser:any = '';
  isCarrierID:any = '';

  dataMessageBroker: string = Constants.FETCHING_DATA;
  dataMessageCarrier: string = Constants.FETCHING_DATA;
  dataMessageConsignee: string = Constants.FETCHING_DATA;
  dataMessageConsignor: string = Constants.FETCHING_DATA;
  dataMessageCustomer: string = Constants.FETCHING_DATA;
  dataMessageEmployee: string = Constants.FETCHING_DATA;
  dataMessageFactoring: string = Constants.FETCHING_DATA;
  dataMessageOwner: string = Constants.FETCHING_DATA;
  dataMessageVendor: string = Constants.FETCHING_DATA;

  brokerDisabled = false;
  carrierDisabled = false;
  consigneeDisabled = false;
  consignorDisabled = false;
  customerDisabled = false;
  employeeDisabled = false;
  companyDisabled = false;
  operatorDisabled = false;
  vendorDisabled = false;
  detailTab = '';

  constructor(
            private apiService: ApiService,
            private toastr: ToastrService,
            private modalService: NgbModal,
            private HereMap: HereMapService,
            private spinner: NgxSpinnerService,
            private listService: ListService,
          )
  { }

  ngOnInit() {
    this.getCurrentuser();
    this.fetchCountries();
    this.fetchBrokersCount();
    this.searchLocation();
    $(document).ready(() => {
      //this.form = $('#customerForm, #brokerForm, #vendorForm, #carrierForm, #consigneeForm').validate();
    });
  }

  geocodingSearch(value) {
    this.HereMap.geoCode(value);
  }

  removeUserLocation(data) {
    data.forEach(element => {
        delete element.userLocation;
    });
  }

  openDetail(targetModal, data, type) {
    this.userDetailData = {};
    if(data.profileImg != '' && data.profileImg != undefined && data.profileImg != null) {
      this.detailImgPath = `${this.Asseturl}/${data.carrierID}/${data.profileImg}`;
    } else {
      this.detailImgPath = this.defaultProfilePath;
    }
    $('.modal').modal('hide');
    this.userDetailTitle = data.firstName;
    this.modalService.open(targetModal);
    this.userDetailData = data;
    this.detailTab = type;
  }

  async userAddress(data: any, i: number, item: any) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];

    data.address[i].userLocation = result.address.label;
    data.address[i].geoCords.lat = result.position.lat;
    data.address[i].geoCords.lng = result.position.lng;
    data.address[i].countryName = result.address.countryName;
    data.address[i].stateName = result.address.state;
    data.address[i].cityName = result.address.city;

    data.address[i].countryCode = result.address.countryCode;
    data.address[i].stateCode = result.address.stateCode;
    data.address[i].zipCode = result.address.postalCode;
    if (result.address.houseNumber != undefined) {
      data.address[i].houseNumber = result.address.houseNumber;
    } else {}
    if (result.address.street != undefined) {
      data.address[i].street = result.address.street;
    }

    $('div').removeClass('show-search__result');
  }

  async fetchCountriesByName(name: string) {
    let result = await this.apiService.getData(`countries/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getStates(result.Items[0].countryID);
      return result.Items[0].countryID;
    }
    return '';
  }

  async fetchStatesByName(name: string) {
    let result = await this.apiService.getData(`states/get/${name}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.getCities(result.Items[0].stateID);
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

  addAddress(data) {
    this.searchResults = [];
    data.address.push({
      addressType: '',
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

  // Add Customer
  async addCustomer() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
    this.spinner.show();
    this.customerDisabled = true;

    for (let i = 0; i < this.customerData.address.length; i++) {
      const element = this.customerData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }

    for (let j = 0; j < this.customerData.additionalContact.length; j++) {
      const element = this.customerData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }
    this.lastEvaluatedKeyCustomer = '';
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.customerData));

    this.apiService.postData('contacts', formData, true).
      subscribe({
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
                this.spinner.hide();
                //this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
                this.customerDisabled = false;
              },
              error: () => {
                this.customerDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.customerDisabled = false;
          this.listService.fetchCustomers();
          this.dataMessageCustomer = Constants.FETCHING_DATA;
          $('#addCustomerModal').modal('hide');
          this.showMainModal();
          this.customers = [];
          this.fetchCustomersCount();
          this.activeDiv = 'customerTable';
          this.spinner.hide();
          this.toastr.success('Customer Added Successfully');
        }
      });
  }

  removeAddressFields(arr) {
    delete arr['carrierID'];
    delete arr['timeModified'];
    delete arr['userType'];
    delete arr['userTypeTitle'];
    arr.address.forEach(element => {
      delete element['email'];
      delete element['entityID'];
      delete element['entityType'];
      delete element['name'];
      delete element['phone'];
    });
  }

  async updateCustomer() {
    this.hasError = false;
    this.hasSuccess = false;
    this.customerDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.customerData.address.length; i++) {
      const element = this.customerData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }

    for (let j = 0; j < this.customerData.additionalContact.length; j++) {
      const element = this.customerData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.customerData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.customerDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.customerDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.hasSuccess = true;
        this.customerDisabled = false;
        $('#addCustomerModal').modal('hide');
        this.customerDraw = 0;
        this.lastEvaluatedKeyCustomer = '';
        this.dataMessageCustomer = Constants.FETCHING_DATA;
        this.listService.fetchCustomers();
        this.showMainModal();
        this.activeDiv = 'customerTable';
        this.fetchCustomersCount();
        this.toastr.success('Customer updated successfully');
      },
    });
  }

  // Add Broker
  async addBroker() {
    this.hasError = false;
    this.hasSuccess = false;
    this.brokerDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.brokerData.address.length; i++) {
      const element = this.brokerData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.brokerData.additionalContact.length; j++) {
      const element = this.brokerData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.brokerData));

    this.lastEvaluatedKeyBroker = '';
    this.apiService.postData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.brokerDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.brokerDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.brokerDisabled = false;
        this.dataMessageBroker = Constants.FETCHING_DATA;
        $('#addBrokerModal').modal('hide');
        this.listService.fetchCustomers();
        this.fetchBrokersCount();
        this.showMainModal();
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.toastr.success('Broker Added Successfully');
      }
    });
  }

  // Add Broker
  async addOwnerOperator() {
    this.hasError = false;
    this.hasSuccess = false;
    this.operatorDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.ownerData.address.length; i++) {
      const element = this.ownerData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.ownerData.additionalContact.length; j++) {
      const element = this.ownerData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }
    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.ownerData));
    this.lastEvaluatedKeyOperator = '';

    this.apiService.postData('contacts', formData, true).
    subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              //this.throwErrors();
              this.hasError = true;
              this.operatorDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.operatorDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.operatorDisabled = false;
        this.dataMessageOwner = Constants.FETCHING_DATA;
        $('#addOwnerOperatorModal').modal('hide');
        this.listService.fetchCustomers();
        this.fetchOwnerOperatorsCount();
        this.showMainModal();
        this.listService.fetchOwnerOperators();
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.toastr.success('Owner Operator Added Successfully');
      }
    });
  }

  async updateOwnerOperator() {
    this.hasError = false;
    this.hasSuccess = false;
    this.operatorDisabled = true;
    this.hideErrors();
    this.removeAddressFields(this.ownerData);

    for (let i = 0; i < this.ownerData.address.length; i++) {
      const element = this.ownerData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.ownerData.additionalContact.length; j++) {
      const element = this.ownerData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.ownerData));

    this.apiService.putData('contacts', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              //this.throwErrors();
              this.hasError = true;
              this.operatorDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.operatorDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.hasSuccess = true;
        this.operatorDisabled = false;
        this.listService.fetchCustomers();
        $('#addOwnerOperatorModal').modal('hide');
        this.ownerOperatorDraw = 0;
        this.lastEvaluatedKeyOperator = '';
        this.dataMessageOwner = Constants.FETCHING_DATA;
        this.fetchOwnerOperatorsCount();
        this.showMainModal();
        this.listService.fetchOwnerOperators();
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.toastr.success('Owner operator updated successfully');
      },
    });
  }

  async updateBroker() {
    this.hasError = false;
    this.hasSuccess = false;
    this.brokerDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.brokerData.address.length; i++) {
      const element = this.brokerData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.brokerData.additionalContact.length; j++) {
      const element = this.brokerData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.brokerData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.brokerDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.brokerDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.brokerDisabled = false;

        $('#addBrokerModal').modal('hide');
        this.brokerDraw = 0;
        this.lastEvaluatedKeyBroker = '';
        this.dataMessageBroker = Constants.FETCHING_DATA;
        this.listService.fetchCustomers();
        this.showMainModal();
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.fetchBrokersCount();
        this.toastr.success('Broker updated successfully');
      },
    });
  }

  // Add Vendor
  async addVendor() {
    this.hasError = false;
    this.hasSuccess = false;
    this.vendorDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.vendorData.address.length; i++) {
      const element = this.vendorData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.vendorData));
    this.lastEvaluatedKeyVendor = '';

    this.apiService.postData('contacts', formData, true).
      subscribe({
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
                //this.throwErrors();
                this.hasError = true;
                this.vendorDisabled = false;
                this.Error = 'Please see the errors';
              },
              error: () => {
                this.vendorDisabled = false;
              },
              next: () => { },
            });
        },
        next: (res) => {
          this.vendorDisabled = false;
          this.response = res;
          this.hasSuccess = true;
          this.dataMessageVendor = Constants.FETCHING_DATA;
          $('#addVendorModal').modal('hide');
          this.toastr.success('Vendor Added Successfully');
          this.listService.fetchVendors();
          this.fetchVendorsCount();
          this.showMainModal();
          this.vendors = [];
          this.activeDiv = 'vendorTable';
        }
      });
  }

  async updateVendor() {
    this.hasError = false;
    this.hasSuccess = false;
    this.vendorDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.vendorData.address.length; i++) {
      const element = this.vendorData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.vendorData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.vendorDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.vendorDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.vendorDisabled = false;
        $('#addVendorModal').modal('hide');
        this.vendorDraw = 0;
        this.lastEvaluatedKeyVendor = '';
        this.dataMessageVendor = Constants.FETCHING_DATA;

        this.showMainModal();
        this.vendors = [];
        this.fetchVendorsCount();
        this.activeDiv = 'vendorTable';
        this.toastr.success('Vendor updated successfully');
      },
    });
  }

  // Add Carrier
  async addCarrier() {
    this.hasError = false;
    this.hasSuccess = false;
    this.carrierDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.carrierData.address.length; i++) {
      const element = this.carrierData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.carrierData.additionalContact.length; j++) {
      const element = this.carrierData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.carrierData));
    this.lastEvaluatedKeyCarrier = '';

    this.apiService.postData('contacts', formData, true).
      subscribe({
        complete: () => { },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.label] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                //this.throwErrors();
                this.hasError = true;
                this.carrierDisabled = false;
                this.Error = 'Please see the errors';
              },
              error: () => {
                this.carrierDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.carrierDisabled = false;
          this.dataMessageCarrier = Constants.FETCHING_DATA;
          $('#addCarrierModal').modal('hide');
          this.listService.fetchCustomers();
          this.fetchCarriersCount();
          this.showMainModal();
          this.carriers = [];
          this.activeDiv = 'carrierTable';
          this.toastr.success('Carrier Added Successfully');
        }
      });
  }

  async updateCarrier() {
    this.hasError = false;
    this.hasSuccess = false;
    this.carrierDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.carrierData.address.length; i++) {
      const element = this.carrierData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.carrierData.additionalContact.length; j++) {
      const element = this.carrierData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.carrierData));

    this.apiService.putData('contacts', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              //this.throwErrors();
              this.hasError = true;
              this.carrierDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.carrierDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.listService.fetchCustomers();
        this.carrierDisabled = false;
        $('#addCarrierModal').modal('hide');
        this.carrierDraw = 0;
        this.lastEvaluatedKeyCarrier = '';
        this.dataMessageCarrier = Constants.FETCHING_DATA;

        this.showMainModal();
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        this.fetchCarriersCount();
        this.toastr.success('Carrier updated successfully');
      },
    });
  }


  // Add Shipper
  async addShipper() {
    this.hasError = false;
    this.hasSuccess = false;
    this.consignorDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.shipperData.address.length; i++) {
      const element = this.shipperData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }

    for (let j = 0; j < this.shipperData.additionalContact.length; j++) {
      const element = this.shipperData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.shipperData));
    this.lastEvaluatedKeyShipper = '';

    this.apiService.postData('contacts', formData, true).
      subscribe({
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
                //this.throwErrors();
                this.hasError = true;
                this.consignorDisabled = false;
                this.Error = 'Please see the errors';
              },
              error: () => {
                this.consignorDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.consignorDisabled = false;
          this.dataMessageConsignor = Constants.FETCHING_DATA;
          $('#addShipperModal').modal('hide');
          this.listService.fetchCustomers();
          this.listService.fetchShippers();
          this.fetchShippersCount();
          this.showMainModal();
          this.shippers = [];
          this.activeDiv = 'shipperTable';
          this.toastr.success('Consignor Added Successfully');
        }
      });
  }

  async updateShipper() {
    this.hasError = false;
    this.hasSuccess = false;
    this.consignorDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.shipperData.address.length; i++) {
      const element = this.shipperData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.shipperData.additionalContact.length; j++) {
      const element = this.shipperData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.shipperData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.consignorDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.consignorDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.consignorDisabled = false;
        $('#addShipperModal').modal('hide');
        this.shipperDraw = 0;
        this.lastEvaluatedKeyShipper = '';
        this.dataMessageConsignor = Constants.FETCHING_DATA;

        this.shippers = [];
        this.showMainModal();
        this.listService.fetchCustomers();
        this.fetchShippersCount();
        this.activeDiv = 'shipperTable';
        this.toastr.success('Consignor updated successfully');
      },
    });
  }


  // Add Consignee
  async addConsignee() {
    this.hasError = false;
    this.hasSuccess = false;
    this.consigneeDisabled = true;
    this.hideErrors();

    for (let i = 0; i < this.consigneeData.address.length; i++) {
      const element = this.consigneeData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }

    for (let j = 0; j < this.consigneeData.additionalContact.length; j++) {
      const element = this.consigneeData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.consigneeData));
    this.lastEvaluatedKeyConsignee = '';

    this.apiService.postData('contacts', formData, true).
      subscribe({
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
                //this.throwErrors();
                this.hasError = true;
                this.consigneeDisabled = false;
                this.Error = 'Please see the errors';
              },
              error: () => {
                this.consigneeDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.consigneeDisabled = false;
          this.hasSuccess = true;
          this.dataMessageConsignee = Constants.FETCHING_DATA;
          $('#addConsigneeModal').modal('hide');
          this.listService.fetchReceivers();
          this.listService.fetchCustomers();
          this.showMainModal();
          this.receivers = [];
          this.activeDiv = 'consigneeTable';
          this.fetchConsigneeCount();
          this.toastr.success('Consignee Added Successfully');
        }
      });
  }

  async updateConsignee() {
    this.hasError = false;
    this.hasSuccess = false;
    this.consigneeDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.consigneeData.address.length; i++) {
      const element = this.consigneeData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    for (let j = 0; j < this.consigneeData.additionalContact.length; j++) {
      const element = this.consigneeData.additionalContact[j];
      element.fullName = element.firstName + ' '+ element.lastName;
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.consigneeData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.consigneeDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.consigneeDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.consigneeDisabled = false;
        this.listService.fetchCustomers();

        $('#addConsigneeModal').modal('hide');
        this.consigneeDraw = 0;
        this.lastEvaluatedKeyConsignee = '';
        this.dataMessageConsignee = Constants.FETCHING_DATA;

        this.receivers = [];
        this.showMainModal();
        this.fetchConsigneeCount();
        this.activeDiv = 'consigneeTable';
        this.toastr.success('Consignee updated successfully');
      },
    });
  }

  // Add FC Company
  async addFCompany() {
    this.hasError = false;
    this.hasSuccess = false;
    this.companyDisabled = true;
    this.hideErrors();
    for (let i = 0; i < this.fcCompanyData.address.length; i++) {
      const element = this.fcCompanyData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.fcCompanyData));
    this.lastEvaluatedKeyCompany = '';

    this.apiService.postData('contacts', formData, true).
      subscribe({
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
                //this.throwErrors();
                this.hasError = true;
                this.companyDisabled = false;
                this.Error = 'Please see the errors';
              },
              error: () => {
                this.companyDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.companyDisabled = false;
          this.dataMessageFactoring = Constants.FETCHING_DATA;
          this.listService.fetchCustomers();
          $('#addFCModal').modal('hide');
          this.fetchFcCompaniesCount();
          this.showMainModal();
          this.brokers = [];
          this.activeDiv = 'brokerTable';
          this.toastr.success('Company Added Successfully');
        }
      });
  }

  async updateFCompany() {
    this.hasError = false;
    this.hasSuccess = false;
    this.companyDisabled = true;
    this.hideErrors();
    // this.removeAddressFields(this.fcCompanyData);
    for (let i = 0; i < this.fcCompanyData.address.length; i++) {
      const element = this.fcCompanyData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.fcCompanyData));

    this.apiService.putData('contacts', formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.companyDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.companyDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.companyDisabled = false;
        this.listService.fetchCustomers();
        $('#addFCModal').modal('hide');
        this.companyDraw = 0;
        this.lastEvaluatedKeyCompany = '';
        this.dataMessageFactoring = Constants.FETCHING_DATA;

        this.showMainModal();
        this.fcCompanies = [];
        this.fetchFcCompaniesCount();
        // this.initDataTableCompany();
        this.activeDiv = 'companyTable';
        this.toastr.success('Company updated successfully');
      },
    });
  }

  // Add addStaff
  async addStaff() {
    this.hasError = false;
    this.hasSuccess = false;
    this.employeeDisabled = true;
    this.hideErrors();
    // this.spinner.show();
    for (let i = 0; i < this.staffData.address.length; i++) {
      const element = this.staffData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.staffData));
    this.lastEvaluatedKeyStaff = '';

    this.apiService.postData('contacts?newUser='+this.newStaffUser, formData, true).
      subscribe({
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
                //this.throwErrors();
                this.spinner.hide();
                this.hasError = true;
                this.employeeDisabled = false;
                this.Error = 'Please see the errors';
              },
              error: () => {
                this.employeeDisabled = false;
               },
              next: () => { },
            });
        },
        next: (res) => {
          this.spinner.hide();
          this.response = res;
          this.employeeDisabled = false;
          this.hasSuccess = true;
          if(this.staffData.loginEnabled){
            this.saveUserData();
          }
          this.dataMessageEmployee = Constants.FETCHING_DATA;
          $('#addStaffModal').modal('hide');
          this.staffs = [];
          this.fetchStaffsCount();
          this.showMainModal();
          this.initDataTableStaff();
          this.activeDiv = 'staffTable';
          this.toastr.success('Employee Added Successfully');
        }
      });
  }

  async updateStaff() {
    this.hasError = false;
    this.hasSuccess = false;
    this.employeeDisabled = true;
    this.hideErrors();
    // this.removeAddressFields(this.staffData);
    for (let i = 0; i < this.staffData.address.length; i++) {
      const element = this.staffData.address[i];
      delete element.states;
      delete element.cities;
      if(element.countryName != '' && element.stateName != '' && element.cityName != '') {
        let fullAddress = `${element.address1} ${element.address2} ${element.cityName}
        ${element.stateName} ${element.countryName}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;

      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.staffData));

    this.apiService.putData('contacts?newUser='+this.newStaffUser, formData, true).subscribe({
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
              //this.throwErrors();
              this.hasError = true;
              this.employeeDisabled = false;
              this.Error = 'Please see the errors';
            },
            error: () => {
              this.employeeDisabled = false;
             },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.employeeDisabled = false;
        //delete address
        for (let i = 0; i < this.deleteStaffAddr.length; i++) {
          const element = this.deleteStaffAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addStaffModal').modal('hide');
        this.staffDraw = 0;
        this.lastEvaluatedKeyStaff = '';
        this.dataMessageEmployee = Constants.FETCHING_DATA;

        this.staffs = [];
        this.fetchStaffsCount();
        this.showMainModal();
        this.initDataTableStaff();
        this.activeDiv = 'staffTable';
        this.toastr.success('Employee updated successfully');
      },
    });
  }

  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        if(v == 'CognitoPassword') {
          this.errorClass = true;
          this.errorClassMsg = this.errors[v];
        } else {
          $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
        }
      });

    this.spinner.hide();
  }

  hideErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .removeClass('error')
          .next()
          .remove('label')
      });
    this.errors = {};
  }

  /*
   * Get all countries from api
   */
  fetchCountries() {
    this.countries = CountryStateCity.GetAllCountries();
  }

  getStates(countryCode, type='', index='') {
    let states = CountryStateCity.GetStatesByCountryCode([countryCode]);
    
    let countryName = CountryStateCity.GetSpecificCountryNameByCode(countryCode);
    if(type == 'vendor') {
      this.vendorData.address[index].countryName = countryName;
      this.vendorData.address[index].states = states;
    } else if(type == 'customer') {
      this.customerData.address[index].countryName = countryName;
      this.customerData.address[index].states = states;
    } else if(type == 'broker') {
      this.brokerData.address[index].countryName = countryName;
      this.brokerData.address[index].states = states;
    } else if(type == 'carrier') {
      this.carrierData.address[index].countryName = countryName;
      this.carrierData.address[index].states = states;
    } else if(type == 'operator') {
      this.ownerData.address[index].countryName = countryName;
      this.ownerData.address[index].states = states;
    } else if(type == 'shipper') {
      this.shipperData.address[index].countryName = countryName;
      this.shipperData.address[index].states = states;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].countryName = countryName;
      this.consigneeData.address[index].states = states;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].countryName = countryName;
      this.fcCompanyData.address[index].states = states;
    } else if(type == 'staff') {
      this.staffData.address[index].countryName = countryName;
      this.staffData.address[index].states = states;
    }
  }

  getCities(stateCode, type='', index='') {
    let countryCode = '';
    if(type == 'vendor') {
      countryCode = this.vendorData.address[index].countryCode;
    } else if(type == 'customer') {
      countryCode = this.customerData.address[index].countryCode;
    } else if(type == 'broker') {
      countryCode = this.brokerData.address[index].countryCode;
    } else if(type == 'carrier') {
      countryCode = this.carrierData.address[index].countryCode;
    } else if(type == 'operator') {
      countryCode = this.ownerData.address[index].countryCode;
    } else if(type == 'shipper') {
      countryCode = this.shipperData.address[index].countryCode;
    } else if(type == 'consignee') {
      countryCode = this.consigneeData.address[index].countryCode;
    } else if(type == 'company') {
      countryCode = this.fcCompanyData.address[index].countryCode;
    } else if(type == 'staff') {
      countryCode = this.staffData.address[index].countryCode;
    }

    let stateResult = CountryStateCity.GetStateNameFromCode(stateCode, countryCode);
    let cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);

    if(type == 'vendor') {
      this.vendorData.address[index].stateName = stateResult;
      this.vendorData.address[index].cities = cities;
    } else if(type == 'customer') {
      this.customerData.address[index].stateName = stateResult;
      this.customerData.address[index].cities = cities;
    } else if(type == 'broker') {
      this.brokerData.address[index].stateName = stateResult;
      this.brokerData.address[index].cities = cities;
    } else if(type == 'carrier') {
      this.carrierData.address[index].stateName = stateResult;
      this.carrierData.address[index].cities = cities;
    } else if(type == 'operator') {
      this.ownerData.address[index].stateName = stateResult;
      this.ownerData.address[index].cities = cities;
    } else if(type == 'shipper') {
      this.shipperData.address[index].stateName = stateResult;
      this.shipperData.address[index].cities = cities;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].stateName = stateResult;
      this.consigneeData.address[index].cities = cities;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].stateName = stateResult;
      this.fcCompanyData.address[index].cities = cities;
    } else if(type == 'staff') {
      this.staffData.address[index].stateName = stateResult;
      this.staffData.address[index].cities = cities;
    }
  }

  uploadDriverImg(event): void {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.profilePath = reader.result;
      reader.readAsDataURL(file);

      this.uploadedPhotos.push(file)
      if(this.uploadedPhotos.length > 0) {
        this.imageText = 'Change Photo';
      }
    }
  }

  fetchAddress() {
    return this.apiService.getData('addresses');
  }

  fetchCustomersCount() {
    this.apiService.getData('contacts/get/count/customer?searchValue='+this.filterVal.customerID.toLowerCase()+'&companyName='+this.filterVal.customerCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsCustomer = result.Count;

        this.initDataTable();
      },
    });
  }

  fetchOwnerOperatorsCount() {
    this.apiService.getData('contacts/get/count/ownerOperator?searchValue='+this.filterVal.operatorID.toLowerCase()+'&companyName='+this.filterVal.operatorCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsOperator = result.Count;

        this.initDataTableOperator();
      },
    });
  }

  fetchBrokersCount() {
    this.apiService.getData('contacts/get/count/broker?searchValue='+this.filterVal.brokerID.toLowerCase()+'&companyName='+this.filterVal.brokerCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsBroker = result.Count;

        this.initDataTableBroker();
      },
    });
  }

  fetchVendorsCount() {
    this.apiService.getData('contacts/get/count/vendor?searchValue='+this.filterVal.vendorID.toLowerCase()+'&companyName='+this.filterVal.vendorCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsVendor = result.Count;

        this.initDataTableVendor();
      },
    });
  }

  fetchCarriersCount() {
    this.apiService.getData('contacts/get/count/carrier?searchValue='+this.filterVal.carrierID.toLowerCase()+'&companyName='+this.filterVal.carrierCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsCarrier = result.Count;

        this.initDataTableCarrier();
      },
    });
  }

  fetchShippersCount() {
    this.apiService.getData('contacts/get/count/consignor?searchValue='+this.filterVal.shipperID.toLowerCase()+'&companyName='+this.filterVal.shipperCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsShipper = result.Count;
        this.initDataTableShipper();
      },
    });
  }

  fetchConsigneeCount() {
    this.apiService.getData('contacts/get/count/consignee?searchValue='+this.filterVal.consigneeID.toLowerCase()+'&companyName='+this.filterVal.receiverCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsConsignee = result.Count;
        this.initDataTableConsignee();
      },
    });
  }

  fetchStaffsCount() {
    this.apiService.getData('contacts/get/count/employee?searchValue='+this.filterVal.staffID.toLowerCase()+'&companyName='+this.filterVal.staffCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsStaff = result.Count;
      },
    });
  }

  fetchFcCompaniesCount() {
    this.apiService.getData('contacts/get/count/factoringCompany?searchValue='+this.filterVal.companyID.toLowerCase()+'&companyName='+this.filterVal.factoringCompanyName.toLowerCase()).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsCompany = result.Count;
        this.initDataTableCompany();
      },
    });
  }

  carrierWSIB(value) {
    if (value !== true) {
      delete this.carrierData['paymentDetails']['wsibAccountNumber'];
      delete this.carrierData['paymentDetails']['wsibExpiry'];
    }
  }

  // assignAddressToUpdate(entityAddresses: any) {
  //   this.newAddress = [];
  //   for (let i = 0; i < entityAddresses.length; i++) {
  //     this.newAddress.push({
  //       addressID: entityAddresses[i].addressID,
  //       addressType: entityAddresses[i].addressType,
  //       countryID: entityAddresses[i].countryID,
  //       countryName: entityAddresses[i].countryName,
  //       stateID: entityAddresses[i].stateID,
  //       stateName: entityAddresses[i].stateName,
  //       cityID: entityAddresses[i].cityID,
  //       cityName: entityAddresses[i].cityName,
  //       zipCode: entityAddresses[i].zipCode,
  //       address1: entityAddresses[i].address1,
  //       address2: entityAddresses[i].address2,
  //       userLocation: entityAddresses[i].userLocation,
  //       manual: (entityAddresses[i].manual == undefined) ? false : entityAddresses[i].manual,
  //       geoCords:{
  //         lat: (entityAddresses[i].geoCords != undefined) ? entityAddresses[i].geoCords.lat : '',
  //         lng: (entityAddresses[i].geoCords != undefined) ? entityAddresses[i].geoCords.lng : ''
  //       },
  //       houseNumber: entityAddresses[i].houseNumber,
  //       street: entityAddresses[i].street
  //     })

  //     this.getEditStates(entityAddresses[i].countryID);
  //     this.getEditCities(entityAddresses[i].stateID);
  //   }

  //   return this.newAddress;
  // }

  async deactivateCustomer(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      await this.apiService
      .getData(`contacts/delete/customer/${userID}`)
      .subscribe(async(result: any) => {
        this.customerDraw = 0;
        this.lastEvaluatedKeyCustomer = '';
        this.dataMessageCustomer = Constants.FETCHING_DATA;
        this.customers = [];
        this.fetchCustomersCount();
        // this.initDataTable();
        this.toastr.success('Customer deleted successfully');
      });
    }
  }

  deactivateBroker(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService.getData(`contacts/delete/broker/${userID}`)
      .subscribe((result: any) => {
        this.brokerDraw = 0;
        this.lastEvaluatedKeyBroker = '';
        this.dataMessageBroker = Constants.FETCHING_DATA;
        this.brokers = [];
        this.fetchBrokersCount();
        // this.initDataTableBroker();
        this.toastr.success('Broker deleted successfully');
      });
    }
  }

  deactivateVendor(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/vendor/${userID}`)
      .subscribe((result: any) => {
        this.vendorDraw = 0;
        this.lastEvaluatedKeyVendor = '';
        this.dataMessageVendor = Constants.FETCHING_DATA;
        this.vendors = [];
        this.fetchVendorsCount();
        // this.initDataTableVendor();
        this.toastr.success('Vendor deleted successfully');
      });
    }
  }

  deactivateShipper(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/consignor/${userID}`)
      .subscribe((result: any) => {
        this.shipperDraw = 0;
        this.lastEvaluatedKeyShipper = '';
        this.dataMessageConsignor = Constants.FETCHING_DATA;
        this.shippers = [];
        this.fetchShippersCount();
        // this.initDataTableShipper();
        this.toastr.success('Consignor deleted successfully');
      });
    }
  }
  deactivateReceiver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/consignee/${userID}`)
      .subscribe((result: any) => {
        this.consigneeDraw = 0;
        this.lastEvaluatedKeyConsignee = '';
        this.dataMessageConsignee = Constants.FETCHING_DATA;
        this.receivers = [];
        this.fetchConsigneeCount();
        // this.initDataTableConsignee();
        this.toastr.success('Consignee deleted successfully');
      });
    }
  }

  deactivateStaff(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/employee/${userID}`)
      .subscribe((result: any) => {
        this.staffDraw = 0;
        this.lastEvaluatedKeyStaff = '';
        this.dataMessageEmployee = Constants.FETCHING_DATA;
        this.staffs = [];
        this.fetchStaffsCount();
        this.initDataTableStaff();
        this.toastr.success('Employee deleted successfully');
      });
    }
  }

  deactivateCompany(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/factoringCompany/${userID}`)
      .subscribe((result: any) => {
        this.companyDraw = 0;
        this.lastEvaluatedKeyCompany = '';
        this.dataMessageFactoring = Constants.FETCHING_DATA;
        this.fcCompanies = [];
        this.fetchFcCompaniesCount();
        // this.initDataTableCompany();
        this.toastr.success('Company deleted successfully');
      });
    }
  }

  deactivateOperator(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/ownerOperator/${userID}`)
      .subscribe((result: any) => {
        this.ownerOperatorDraw = 0;
        this.lastEvaluatedKeyOperator = '';
        this.dataMessageOwner = Constants.FETCHING_DATA;
        this.ownerOperatorss = [];
        this.fetchOwnerOperatorsCount();
        // this.initDataTableOperator();
        this.toastr.success('Operator deleted successfully');
      });
    }
  }

  deactivateCarrier(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`contacts/delete/carrrier/${userID}`)
      .subscribe((result: any) => {
        this.carrierDraw = 0;
        this.lastEvaluatedKeyCarrier = '';
        this.dataMessageCarrier = Constants.FETCHING_DATA;
        this.carriers = [];
        this.fetchCarriersCount();
        // this.initDataTableCarrier();
        this.toastr.success('Carrier deleted successfully');
      });
    }
  }

  editUser(type: string, item: any) {
    //if timeCreated is an object then replace it with number
    if(typeof item.timeCreated === 'object' && item.timeCreated !== null) {
      item.timeCreated = new Date().getTime();
    }
    if(typeof item.timeModified === 'object' && item.timeModified !== null) {
      item.timeModified = new Date().getTime();
    }
    this.modalTitle = 'Edit ';
    this.updateButton = true;
    this.hasError = false;
    this.hasSuccess = false;
    $('.modal').modal('hide');
    this.clearModalData();

    //to show profile image
    if(item.profileImg != '' && item.profileImg != undefined) {
      this.profilePath = `${this.Asseturl}/${item.carrierID}/${item.profileImg}`;;
      this.imageText = 'Update Picture';
    } else {
      this.profilePath = this.defaultProfilePath;
      this.imageText = 'Add Picture';
    }

    if(type === 'customer') {
      $('#addCustomerModal').modal('show');

    } else if(type === 'broker') {
      $('#addBrokerModal').modal('show');

    } else if(type === 'vendor') {
      $('#addVendorModal').modal('show');

    } else if(type === 'consignor') {
      $('#addShipperModal').modal('show');

    } else if(type === 'consignee') {
      $('#addConsigneeModal').modal('show');

    } else if(type === 'staff') {
      $('#addStaffModal').modal('show');

    } else if(type === 'factoringCompany') {
      $('#addFCModal').modal('show');

    } else if(type === 'ownerOperator') {
      $('#addOwnerOperatorModal').modal('show');

    } else if(type === 'carrier') {
      $('#addCarrierModal').modal('show');
    }
    this.getEditRecord(item.contactID, type);
  }

  nextStep() {
    this.custCurrentTab++;
  }
  prevStep() {
    this.custCurrentTab--;
  }
  tabChange(value) {
    this.custCurrentTab = value;
  }

  resetModal(type){
    this.modalTitle = 'Add ';
    this.hasError = false;
    this.hasSuccess = false;
    this.loginDiv = false;
    this.fieldvisibility = 'false';
    this.newStaffUser = 'false';
    if(type == 'driver') {
      this.showDriverModal = true;
    } else {
      this.updateButton = false;
    }
    this.custCurrentTab = 1;
    this.clearModalData()

    this.searchResults = [];
  }

  setActiveDiv(type){
    if(type == 'broker') {
      this.fetchBrokersCount();
    } else if(type == 'carrier') {
      this.fetchCarriersCount();
    } else if(type == 'consignee') {
      this.fetchConsigneeCount();
    } else if(type == 'customer') {
      this.fetchCustomersCount();
    } else if(type == 'company') {
      this.fetchFcCompaniesCount();
    } else if(type == 'operator') {
      this.fetchOwnerOperatorsCount();
    } else if(type == 'vendor') {
      this.fetchVendorsCount();
    } else if(type == 'shipper') {
      this.fetchShippersCount();
    }
    this.activeDiv = type+'Table';
  }

  showMainModal() {
    this.custCurrentTab = 1;
    $('#allContactsModal').modal('show');
  }

  clearModalData() {
    this.hideErrors();
    this.searchResults = [];
    this.profilePath = this.defaultProfilePath;
    this.imageText = 'Add Photo';
    this.custCurrentTab = 1;

    // Customer Object
    this.customerData = {
      companyName: this.currentUser,
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
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

    // Broker Object
    this.brokerData = {
      companyName: this.currentUser,
      dbaName: '',
      firstName: '',
      lastName: '',
      ein: '',
      mc: '',
      dot: '',
      workEmail: '',
      accountNumber: '',
      workPhone: '',
      entityType: 'broker',
      brokerType: 'company',
      address: [{
        addressType: '',
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
        street: '',
        states: [],
        cities: []
      }],
      additionalContact: [{
        fullName: '',
        firstName: '',
        lastName: '',
        designation: '',
        phone: '',
        email: '',
        fax: ''
      }]
    };

    // ownerOperator Object
    this.ownerData = {
      companyName: this.currentUser,
      dbaName: '',
      // firstName: '',
      // lastName: '',
      workPhone: '',
      workEmail: '',
      csa: false,
      paymentDetails: {
        fast: '',
        fastExpiry: '',
        payrollType: '',
        sin: '',
        payrollRate: '',
        payrollRateCurrency: '',
        payrollPercent: '',
        percentType: '',
        loadedMiles: '',
        loadedMilesCurrency: '',
        emptyMiles: '',
        emptyMilesCurrency: '',
        deliveryRate: '',
        deliveryRateCurrency: ''
      },
      entityType: 'ownerOperator',
      address: [{
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
        states: [],
        cities: []
      }],
      additionalContact: [{
        fullName: '',
        firstName: '',
        lastName: '',
        designation: '',
        phone: '',
        email: '',
        fax: '',
      }]
    };

    // Vendor Object
    this.vendorData = {
      companyName: this.currentUser,
      dbaName: '',
      accountNumber: '',
      // firstName: '',
      // lastName: '',
      workEmail: '',
      workPhone: '',
      preferedVendor: false,
      entityType: 'vendor',
      address: [{
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
        states: [],
        cities: []
      }],
    };

    // Carrier Object
    this.carrierData = {
      companyName: this.currentUser,
      dbaName: '',
      // firstName: '',
      // lastName: '',
      workPhone: '',
      workEmail: '',
      csa: false,
      ctpat: false,
      pip: false,
      entityType: 'carrier',
      paymentDetails: {
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
        payrollType: '',
        payrollRate: '',
        payrollRateCurrency: '',
        payrollPercent: '',
        percentType: '',
        loadedMiles: '',
        loadedMilesCurrency: '',
        emptyMiles: '',
        emptyMilesCurrency: '',
        deliveryRate: '',
        deliveryRateCurrency: '',
        applyTax: false,
        wsib: false,
        wsibAccountNumber: '',
        wsibExpiry: ''
      },
      address: [{
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
        states: [],
        cities: []
      }],
      additionalContact: [{
        fullName: '',
        firstName: '',
        lastName: '',
        designation: '',
        phone: '',
        email: '',
        fax: ''
      }]
    };

    // Shipper Object
    this.shipperData = {
      companyName: this.currentUser,
      dbaName: '',
      // firstName: '',
      // lastName: '',
      mc: '',
      dot: '',
      workPhone: '',
      workEmail:'',
      entityType: 'consignor',
      address: [{
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
        states: [],
        cities: []
      }],
      additionalContact: [{
        fullName: '',
        firstName: '',
        lastName: '',
        designation: '',
        phone: '',
        email: '',
        fax: ''
      }]
    };

    // Consignee Object
    this.consigneeData = {
      companyName: this.currentUser,
      dbaName: '',
      // firstName: '',
      // lastName: '',
      mc: '',
      dot: '',
      workPhone: '',
      workEmail: '',
      entityType: 'consignee',
      address: [{
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
        states: [],
        cities: []
      }],
      additionalContact: [{
        fullName: '',
        firstName: '',
        lastName: '',
        designation: '',
        phone: '',
        email: '',
        fax: ''
      }]
    };

    // fcCompany Object
    this.fcCompanyData = {
      companyName: this.currentUser,
      dbaName: '',
      isDefault: false,
      // firstName: '',
      // lastName: '',
      workPhone: '',
      workEmail: '',
      entityType: 'factoringCompany',
      address: [{
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
        states: [],
        cities: []
      }],
      fcDetails: {
        accountNumber: '',
        factoringRate: '',
        factoringUnit: '',
      }
    };

    // Staff Object
    this.staffData = {
      companyName: this.currentUser,
      dbaName: '',
      // firstName: '',
      // lastName: '',
      employeeID: '',
      dateOfBirth: '',
      workPhone: '',
      workEmail: '',
      entityType: 'staff',
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
        userLocation: '',
        manual: false,
        countryCode: '',
        stateCode: '',
        houseNumber: '',
        street: '',
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

    this.loginDiv = false;
    this.fieldvisibility = 'false';
    this.newStaffUser = 'false';

  }

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/customer?searchValue='+this.filterVal.customerID+'&companyName='+this.filterVal.customerCompanyName+'&lastKey='+this.lastEvaluatedKeyCustomer)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageCustomer = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedCustomers = [];
        this.suggestedCustomerCompanies = [];
        this.getStartandEndVal('customer');

        this.customers = result['Items'];

        if(this.filterVal.customerID != '') {
          this.custtStartPoint = 1;
          this.custtEndPoint = this.totalRecordsCustomer;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.customerNext = false;
          // for prev button
          if(!this.customerPrevEvauatedKeys.includes(lastEvalKey)){
            this.customerPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyCustomer = lastEvalKey;

        } else {
          // disable next button if no lastevaluated key is found
          this.customerNext = true;
          this.lastEvaluatedKeyCustomer = '';
          this.custtEndPoint = this.totalRecordsCustomer;
        }

        // disable prev btn
        if(this.customerDraw > 0){
          this.customerPrev = false;
        } else{
          this.customerPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableBroker() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/broker?searchValue='+this.filterVal.brokerID+'&companyName='+this.filterVal.brokerCompanyName+'&lastKey='+this.lastEvaluatedKeyBroker)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageBroker = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedBrokers = [];
        this.suggestedBrokerCompanies = [];
        this.getStartandEndVal('broker');

        this.brokers = result['Items'];

        if(this.filterVal.brokerID != '') {
          this.brokerStartPoint = 1;
          this.brokerEndPoint = this.totalRecordsBroker;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.brokerNext = false;
          // for prev button
          if (!this.brokerPrevEvauatedKeys.includes(lastEvalKey)) {
            this.brokerPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyBroker = lastEvalKey;

        } else {
          this.brokerNext = true;
          this.lastEvaluatedKeyBroker = '';
          this.brokerEndPoint = this.totalRecordsBroker;
        }

        // disable prev btn
        if (this.brokerDraw > 0) {
          this.brokerPrev = false;
        } else {
          this.brokerPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableVendor() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/vendor?searchValue='+this.filterVal.vendorID.toLowerCase()+'&companyName='+this.filterVal.vendorCompanyName.toLowerCase()+'&lastKey='+this.lastEvaluatedKeyVendor)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageVendor = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedVendors = [];
        this.suggestedVendorCompanies = [];
        this.getStartandEndVal('vendor');

        this.vendors = result['Items'];

        if(this.filterVal.vendorID != '') {
          this.vendorStartPoint = 1;
          this.vendorEndPoint = this.totalRecordsVendor;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.vendorNext = false;
          // for prev button
          if (!this.vendorPrevEvauatedKeys.includes(lastEvalKey)) {
            this.vendorPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyVendor = lastEvalKey;

        } else {
          this.vendorNext = true;
          this.lastEvaluatedKeyVendor = '';
          this.vendorEndPoint = this.totalRecordsVendor;
        }

        // disable prev btn
        if (this.vendorDraw > 0) {
          this.vendorPrev = false;
        } else {
          this.vendorPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableCarrier() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/carrier?searchValue='+this.filterVal.carrierID+'&companyName='+this.filterVal.carrierCompanyName+'&lastKey='+this.lastEvaluatedKeyCarrier)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageCarrier = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedCarriers = [];
        this.suggestedCarrierCompanies = [];
        this.getStartandEndVal('carrier');

        this.carriers = result['Items'];

        if(this.filterVal.carrierID != '') {
          this.carrierStartPoint = 1;
          this.carrierEndPoint = this.totalRecordsCarrier;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.carrierNext = false;
          // for prev button
          if (!this.carrierPrevEvauatedKeys.includes(lastEvalKey)) {
            this.carrierPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyCarrier = lastEvalKey;

        } else {
          this.carrierNext = true;
          this.lastEvaluatedKeyCarrier = '';
          this.carrierEndPoint = this.totalRecordsCarrier;
        }

        // disable prev btn
        if (this.carrierDraw > 0) {
          this.carrierPrev = false;
        } else {
          this.carrierPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableOperator() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/ownerOperator?searchValue='+this.filterVal.operatorID.toLowerCase()+'&companyName='+this.filterVal.operatorCompanyName.toLowerCase()+'&lastKey='+this.lastEvaluatedKeyOperator)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageOwner = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedOperators = [];
        this.suggestedOperatorCompanies = [];
        this.getStartandEndVal('operator');

        this.ownerOperatorss = result['Items'];

        if(this.filterVal.operatorID != '') {
          this.ownerOperatorStartPoint = 1;
          this.ownerOperatorEndPoint = this.totalRecordsOperator;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.ownerOperatorNext = false;
          // for prev button
          if (!this.ownerOperatorPrevEvauatedKeys.includes(lastEvalKey)) {
            this.ownerOperatorPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyOperator = lastEvalKey;

        } else {
          this.ownerOperatorNext = true;
          this.lastEvaluatedKeyOperator = '';
          this.ownerOperatorEndPoint = this.totalRecordsOperator;
        }

        // disable prev btn
        if (this.ownerOperatorDraw > 0) {
          this.ownerOperatorPrev = false;
        } else {
          this.ownerOperatorPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableShipper() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/consignor?searchValue='+this.filterVal.shipperID.toLowerCase()+'&companyName='+this.filterVal.shipperCompanyName.toLowerCase()+'&lastKey='+this.lastEvaluatedKeyShipper)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageConsignor = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedShipper = [];
        this.suggestedShipperCompanies = [];
        this.getStartandEndVal('shipper');

        this.shippers = result['Items'];

        if(this.filterVal.shipperID != '') {
          this.shipperStartPoint = 1;
          this.shipperEndPoint = this.totalRecordsShipper;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.shipperNext = false;
          // for prev button
          if (!this.shipperPrevEvauatedKeys.includes(lastEvalKey)) {
            this.shipperPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyShipper = lastEvalKey;

        } else {
          this.shipperNext = true;
          this.lastEvaluatedKeyShipper = '';
          this.shipperEndPoint = this.totalRecordsShipper;
        }

        // disable prev btn
        if (this.shipperDraw > 0) {
          this.shipperPrev = false;
        } else {
          this.shipperPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableConsignee() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/consignee?searchValue='+this.filterVal.consigneeID.toLowerCase()+'&companyName='+this.filterVal.receiverCompanyName.toLowerCase()+'&lastKey='+this.lastEvaluatedKeyConsignee)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageConsignee = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedConsignees = [];
        this.suggestedConsigneeCompanies = [];
        this.getStartandEndVal('consignee');

        this.receivers = result['Items'];

        if(this.filterVal.consigneeID != '') {
          this.consigneeStartPoint = 1;
          this.consigneeEndPoint = this.totalRecordsConsignee;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.consigneeNext = false;
          // for prev button
          if (!this.consigneePrevEvauatedKeys.includes(lastEvalKey)) {
            this.consigneePrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyConsignee = lastEvalKey;

        } else {
          this.consigneeNext = true;
          this.lastEvaluatedKeyConsignee = '';
          this.consigneeEndPoint = this.totalRecordsConsignee;
        }

        // disable prev btn
        if (this.consigneeDraw > 0) {
          this.consigneePrev = false;
        } else {
          this.consigneePrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableStaff() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/employee?searchValue='+this.filterVal.staffID.toLowerCase()+'&companyName='+this.filterVal.staffCompanyName.toLowerCase()+'&lastKey='+this.lastEvaluatedKeyStaff)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageEmployee = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedStaffs = [];
        this.suggestedStaffCompanies = [];
        this.getStartandEndVal('staff');

        this.staffs = result['Items'];

        if(this.filterVal.staffID != '') {
          this.staffStartPoint = 1;
          this.staffEndPoint = this.totalRecordsStaff;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.staffNext = false;
          // for prev button
          if (!this.staffPrevEvauatedKeys.includes(lastEvalKey)) {
            this.staffPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyStaff = lastEvalKey;

        } else {
          this.staffNext = true;
          this.lastEvaluatedKeyStaff = '';
          this.staffEndPoint = this.totalRecordsStaff;
        }

        // disable prev btn
        if (this.staffDraw > 0) {
          this.staffPrev = false;
        } else {
          this.staffPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  initDataTableCompany() {
    this.spinner.show();
    this.apiService.getData('contacts/fetch/records/factoringCompany?searchValue='+this.filterVal.companyID.toLowerCase()+'&companyName='+this.filterVal.factoringCompanyName.toLowerCase()+'&lastKey='+this.lastEvaluatedKeyCompany)
      .subscribe((result: any) => {
        if(result.Items.length == 0) {
          this.dataMessageFactoring = Constants.NO_RECORDS_FOUND;
        }
        this.suggestedCompany = [];
        this.suggestedVendorCompanies = [];
        this.getStartandEndVal('company');

        this.fcCompanies = result['Items'];

        if(this.filterVal.companyID != '') {
          this.companyStartPoint = 1;
          this.companyEndPoint = this.totalRecordsCompany;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          let lastEvalKey = result[`LastEvaluatedKey`].contactSK.replace(/#/g,'--');
          this.companyNext = false;
          // for prev button
          if (!this.companyPrevEvauatedKeys.includes(lastEvalKey)) {
            this.companyPrevEvauatedKeys.push(lastEvalKey);
          }
          this.lastEvaluatedKeyCompany = lastEvalKey;

        } else {
          this.companyNext = true;
          this.lastEvaluatedKeyCompany = '';
          this.companyEndPoint = this.totalRecordsCompany;
        }

        // disable prev btn
        if (this.companyDraw > 0) {
          this.companyPrev = false;
        } else {
          this.companyPrev = true;
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
  }

  getSuggestions = _.debounce(function (value, type, searchType = '') {
    // getSuggestions(value, type, searchType='') {
    value = value.toLowerCase()
    if (type == 'customer') {
      this.filterVal.customerID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedCustomers = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedCustomerCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=customer`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedCustomerCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedCustomers = result.Items;
            this.suggestedCustomers = this.suggestedCustomers.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });

    } else if (type == 'broker') {
      this.filterVal.brokerID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedBrokers = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedBrokerCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=broker`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedBrokerCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedBrokers = result.Items;
            this.suggestedBrokers = this.suggestedBrokers.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });

    } else if (type == 'vendor') {
      this.filterVal.vendorID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedVendors = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedVendorCompanies = [];
      }
      this.apiService
        .getData(`contacts/nameSuggestions/${value}?type=${searchType}&tab=vendor`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedVendorCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedVendors = result.Items;
            this.suggestedVendors = this.suggestedVendors.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }

              return v;
            })
          }
        });

    } else if (type == 'carrier') {
      this.filterVal.carrierID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedCarriers = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedCarrierCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=carrier`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedCarrierCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedCarriers = result.Items;
            this.suggestedCarriers = this.suggestedCarriers.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });
    } else if (type == 'operator') {
      this.filterVal.operatorID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedOperators = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedOperatorCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=ownerOperator`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedOperatorCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedOperators = result.Items;
            this.suggestedOperators = this.suggestedOperators.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });
    } else if (type == 'shipper') {
      this.filterVal.shipperID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedShipper = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedShipperCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=consignor`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedShipperCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedShipper = result.Items;
            this.suggestedShipper = this.suggestedShipper.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }

        });
    } else if (type == 'consignee') {
      this.filterVal.consigneeID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedConsignees = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedConsigneeCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=consignee`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedConsigneeCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedConsignees = result.Items;
            this.suggestedConsignees = this.suggestedConsignees.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });
    } else if (type == 'staff') {
      this.filterVal.staffID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedStaffs = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedStaffCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=employee`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedStaffCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedStaffs = result.Items;
            this.suggestedStaffs = this.suggestedStaffs.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });
    } else if (type == 'company') {
      this.filterVal.companyID = '';
      if (searchType == 'name' && value == '') {
        this.suggestedCompany = [];
      }
      if (searchType == 'company' && value == '') {
        this.suggestedFactoringCompanies = [];
      }
      this.apiService
        .getData(`contacts/suggestion/${value}?type=${searchType}&tab=factoringCompany`)
        .subscribe((result) => {
          if (searchType == 'company') {
            this.suggestedFactoringCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedCompany = result.Items;
            this.suggestedCompany = this.suggestedCompany.map(function (v) {
              if (v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });
    }
    // }
  }, 800);

  setSearchValues(val, searchValue, type) {
    if(type == 'customer') {
      // this.filterVal.customerID = searchID;
      this.filterVal.customerID = val;
      this.filterVal.customerName = searchValue;
      this.suggestedCustomers = [];

    } else if(type == 'broker') {
      // this.filterVal.brokerID = searchID;
      this.filterVal.brokerName = searchValue;
      this.filterVal.brokerID = val;
      this.suggestedBrokers = [];

    } else if(type == 'vendor') {
      // this.filterVal.vendorID = searchID;
      this.filterVal.vendorID = val;
      this.filterVal.vendorName = searchValue;
      this.suggestedVendors = [];

    } else if(type == 'carrier') {
      // this.filterVal.carrierID = searchID;
      this.filterVal.carrierID = val;
      this.filterVal.carrierName = searchValue;
      this.suggestedCarriers = [];

    } else if(type == 'operator') {
      // this.filterVal.operatorID = searchID;
      this.filterVal.operatorID = val;
      this.filterVal.operatorName = searchValue;
      this.suggestedOperators = [];

    } else if(type == 'shipper') {
      // this.filterVal.shipperID = searchID;
      this.filterVal.shipperID = val;
      this.filterVal.shipperName = searchValue;
      this.suggestedShipper = [];

    } else if(type == 'consignee') {
      // this.filterVal.consigneeID = searchID;
      this.filterVal.consigneeID = val;
      this.filterVal.consigneeName = searchValue;
      this.suggestedConsignees = [];

    } else if(type == 'staff') {
      // this.filterVal.staffID = searchID;
      this.filterVal.staffID = val;
      this.filterVal.staffName = searchValue;
      this.suggestedStaffs = [];

    } else if(type == 'company') {
      // this.filterVal.companyID = searchID;
      this.filterVal.companyID = val;
      this.filterVal.fcompanyName = searchValue;
      this.suggestedCompany = [];

    } else if(type == 'shipperCompany') {
      this.filterVal.shipperCompanyName = searchValue;
      this.suggestedShipperCompanies = [];

    } else if(type == 'brokerCompany') {
      this.filterVal.brokerCompanyName = searchValue;
      this.suggestedBrokerCompanies = [];

    } else if(type == 'carrierCompany') {
      this.filterVal.carrierCompanyName = searchValue;
      this.suggestedCarrierCompanies = [];

    } else if(type == 'consigneeCompany') {
      this.filterVal.receiverCompanyName = searchValue;
      this.suggestedConsigneeCompanies = [];

    } else if(type == 'customerCompany') {
      this.filterVal.customerCompanyName = searchValue;
      this.suggestedCustomerCompanies = [];

    } else if(type == 'staffCompany') {
      this.filterVal.staffCompanyName = searchValue;
      this.suggestedStaffCompanies = [];

    } else if(type == 'factoringCompany') {
      this.filterVal.factoringCompanyName = searchValue;
      this.suggestedFactoringCompanies = [];

    } else if(type == 'operatorCompany') {
      this.filterVal.operatorCompanyName = searchValue;
      this.suggestedOperatorCompanies = [];

    } else if(type == 'vendorCompany') {
      this.filterVal.vendorCompanyName = searchValue;
      this.suggestedVendorCompanies = [];

    }
  }

  async searchFilter(type) {
    if(type == 'customer') {
      if(this.filterVal.customerName == '') {
        this.filterVal.customerID = '';
      }
      if(this.filterVal.customerName != '' || this.filterVal.customerCompanyName != '') {
        this.filterVal.customerCompanyName = this.filterVal.customerCompanyName.toLowerCase();
        this.filterVal.customerName = this.filterVal.customerName.toLowerCase();
        this.filterVal.customerName = this.filterVal.customerName.trim();
        // this.filterVal.customerName = this.filterVal.customerName.replace(' ', '-');
        this.suggestedCustomers = [];
        this.suggestedCustomerCompanies = [];
        if(this.filterVal.customerID == '') {
          this.filterVal.customerID = this.filterVal.customerName;
        }
        this.customers = [];
        this.activeDiv = 'customerTable';
        this.dataMessageCustomer = Constants.FETCHING_DATA;
        this.fetchCustomersCount();
        // this.initDataTable();
      } else {
        return false
      }

    } else if(type == 'broker') {
      if(this.filterVal.brokerName == '') {
        this.filterVal.brokerID = '';
      }
      if(this.filterVal.brokerName != '' || this.filterVal.brokerCompanyName != '') {
        this.filterVal.brokerCompanyName = this.filterVal.brokerCompanyName.toLowerCase();
        this.filterVal.brokerName = this.filterVal.brokerName.toLowerCase();
        if(this.filterVal.brokerID == '') {
          this.filterVal.brokerID = this.filterVal.brokerName;
        }
        this.suggestedBrokers = [];
        this.suggestedBrokerCompanies = [];
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.dataMessageBroker = Constants.FETCHING_DATA;
        this.fetchBrokersCount();
        // this.initDataTableBroker();
      } else {
        return false
      }

    } else if(type == 'vendor') {
      if(this.filterVal.vendorName == '') {
        this.filterVal.vendorID = '';
      }
      if(this.filterVal.vendorName != '' || this.filterVal.vendorCompanyName != '') {
        this.filterVal.vendorCompanyName = this.filterVal.vendorCompanyName.toLowerCase();
        this.filterVal.vendorName = this.filterVal.vendorName.toLowerCase();
        if(this.filterVal.vendorID == '') {
          this.filterVal.vendorID = this.filterVal.vendorName;
        }
        this.suggestedVendors = [];
        this.suggestedVendorCompanies = [];
        this.vendors = [];
        this.activeDiv = 'vendorTable';
        this.dataMessageVendor = Constants.FETCHING_DATA;
        this.fetchVendorsCount();
        // this.initDataTableVendor();
      } else {
        return false
      }

    } else if(type == 'carrier') {
      if(this.filterVal.carrierName == '') {
        this.filterVal.carrierID = '';
      }
      if(this.filterVal.carrierName != '' || this.filterVal.carrierCompanyName != '') {
        this.filterVal.carrierCompanyName = this.filterVal.carrierCompanyName.toLowerCase();
        this.filterVal.carrierName = this.filterVal.carrierName.toLowerCase();
        if(this.filterVal.carrierID == '') {
          this.filterVal.carrierID = this.filterVal.carrierName;
        }
        this.suggestedCarriers = [];
        this.suggestedCarrierCompanies = [];
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        this.dataMessageCarrier = Constants.FETCHING_DATA;
        this.fetchCarriersCount();
        // this.initDataTableCarrier();
      } else {
        return false
      }

    } else if(type == 'operator') {
      if(this.filterVal.operatorName == '') {
        this.filterVal.operatorID = '';
      }
      if(this.filterVal.operatorID != '' || this.filterVal.operatorName != '' || this.filterVal.operatorCompanyName != '') {
        this.filterVal.operatorCompanyName = this.filterVal.operatorCompanyName.toLowerCase();
        this.filterVal.operatorName = this.filterVal.operatorName.toLowerCase();
        if(this.filterVal.operatorID == '') {
          this.filterVal.operatorID = this.filterVal.operatorName;
        }
        this.suggestedOperators = [];
        this.suggestedOperatorCompanies = [];
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.dataMessageOwner = Constants.FETCHING_DATA;
        this.fetchOwnerOperatorsCount();
        // this.initDataTableOperator();
      } else {
        return false
      }

    } else if(type == 'shipper') {
      if(this.filterVal.shipperName == '') {
        this.filterVal.shipperID = '';
      }
      if(this.filterVal.shipperName != '' || this.filterVal.shipperCompanyName != '') {
        this.filterVal.shipperCompanyName = this.filterVal.shipperCompanyName.toLowerCase();
        this.filterVal.shipperName = this.filterVal.shipperName.toLowerCase();
        if(this.filterVal.shipperID == '') {
          this.filterVal.shipperID = this.filterVal.shipperName;
        }
        this.suggestedShipper = [];
        this.suggestedShipperCompanies = [];
        this.shippers = [];
        this.activeDiv = 'shipperTable';
        this.dataMessageConsignor = Constants.FETCHING_DATA;
        this.fetchShippersCount();
        // this.initDataTableShipper();
      } else {
        return false
      }

    } else if(type == 'consignee') {
      if(this.filterVal.consigneeName == '') {
        this.filterVal.consigneeID = '';
      }
      if(this.filterVal.consigneeName != '' || this.filterVal.receiverCompanyName != '') {
        this.filterVal.receiverCompanyName = this.filterVal.receiverCompanyName.toLowerCase();
        this.filterVal.consigneeName = this.filterVal.consigneeName.toLowerCase();
        if(this.filterVal.consigneeID == '') {
          this.filterVal.consigneeID = this.filterVal.consigneeName;
        }
        this.suggestedConsignees = [];
        this.suggestedConsigneeCompanies = [];
        this.receivers = [];
        this.activeDiv = 'consigneeTable';
        this.dataMessageConsignee = Constants.FETCHING_DATA;
        this.fetchConsigneeCount();
        // this.initDataTableConsignee();
      } else {
        return false
      }

    } else if(type == 'staff') {
      if(this.filterVal.staffName == '') {
        this.filterVal.staffID = '';
      }
      if(this.filterVal.staffName != '' || this.filterVal.staffCompanyName != '') {
        this.filterVal.staffCompanyName = this.filterVal.staffCompanyName.toLowerCase();
        this.filterVal.staffName = this.filterVal.staffName.toLowerCase();
        if(this.filterVal.staffID == '') {
          this.filterVal.staffID = this.filterVal.staffName;
        }
        this.suggestedStaffs = [];
        this.suggestedStaffCompanies = [];
        this.staffs = [];
        this.activeDiv = 'staffTable';
        this.dataMessageEmployee = Constants.FETCHING_DATA;
        this.fetchStaffsCount();
        this.initDataTableStaff();
      } else {
        return false
      }

    } else if(type == 'company') {
      if(this.filterVal.fcompanyName == '') {
        this.filterVal.companyID = '';
      }
      if(this.filterVal.companyID != '' || this.filterVal.fcompanyName != '' || this.filterVal.factoringCompanyName != '') {
        this.filterVal.factoringCompanyName = this.filterVal.factoringCompanyName.toLowerCase();
        this.filterVal.fcompanyName = this.filterVal.fcompanyName.toLowerCase();

        if(this.filterVal.companyID == '') {
          this.filterVal.companyID = this.filterVal.fcompanyName;
        }
        this.suggestedCompany = [];
        this.suggestedFactoringCompanies = [];
        this.fcCompanies = [];
        this.activeDiv = 'companyTable';
        this.dataMessageFactoring = Constants.FETCHING_DATA;
        this.fetchFcCompaniesCount()
        // this.initDataTableCompany();
      } else {
        return false
      }

    }
  }

  async resetFilter(type) {
    if(type == 'customer') {
      if(this.filterVal.customerID != '' || this.filterVal.customerName != '' || this.filterVal.customerCompanyName != '') {
        this.customers = [];
        this.lastEvaluatedKeyCustomer = '';
        this.activeDiv = 'customerTable';
        this.filterVal.customerID = '';
        this.filterVal.customerName = '';
        this.filterVal.customerCompanyName = '';
        this.suggestedCustomers = [];
        this.dataMessageCustomer = Constants.FETCHING_DATA;
        this.suggestedCustomerCompanies = [];
        this.fetchCustomersCount();
        // this.initDataTable();
        this.customerDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'broker') {
      if(this.filterVal.brokerID != '' || this.filterVal.brokerName != '' || this.filterVal.brokerCompanyName != '') {
        this.brokers = [];
        this.lastEvaluatedKeyBroker = '';
        this.activeDiv = 'brokerTable';
        this.filterVal.brokerID = '';
        this.filterVal.brokerName = '';
        this.filterVal.brokerCompanyName = '';
        this.suggestedBrokers = [];
        this.suggestedBrokerCompanies = [];
        this.dataMessageBroker = Constants.FETCHING_DATA;
        this.fetchBrokersCount();
        // this.initDataTableBroker();
        this.brokerDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'vendor') {
      if(this.filterVal.vendorID != '' || this.filterVal.vendorName != '' || this.filterVal.vendorCompanyName != '') {
        this.vendors = [];
        this.lastEvaluatedKeyVendor = '';
        this.activeDiv = 'vendorTable';
        this.filterVal.vendorID = '';
        this.filterVal.vendorName = '';
        this.filterVal.vendorCompanyName = '';
        this.suggestedVendors = [];
        this.suggestedVendorCompanies = [];
        this.dataMessageVendor = Constants.FETCHING_DATA;
        this.fetchVendorsCount();
        // this.initDataTableVendor();
        this.vendorDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'carrier') {
      if(this.filterVal.carrierID != '' || this.filterVal.carrierName != '' || this.filterVal.carrierCompanyName != '') {
        this.carriers = [];
        this.lastEvaluatedKeyCarrier = '';
        this.activeDiv = 'carrierTable';
        this.filterVal.carrierID = '';
        this.filterVal.carrierName = '';
        this.filterVal.carrierCompanyName = '';
        this.suggestedCarriers = [];
        this.suggestedCarrierCompanies = [];
        this.dataMessageCarrier = Constants.FETCHING_DATA;
        this.fetchCarriersCount();
        // this.initDataTableCarrier();
        this.carrierDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'operator') {
      if(this.filterVal.operatorID != '' || this.filterVal.operatorName != '' || this.filterVal.operatorCompanyName != '') {
        this.ownerOperatorss = [];
        this.lastEvaluatedKeyOperator = '';
        this.activeDiv = 'operatorTable';
        this.filterVal.operatorID = '';
        this.filterVal.operatorName = '';
        this.filterVal.operatorCompanyName = '';
        this.suggestedOperators = [];
        this.suggestedOperatorCompanies = [];
        this.dataMessageOwner = Constants.FETCHING_DATA;
        this.fetchOwnerOperatorsCount();
        // this.initDataTableOperator();
        this.ownerOperatorDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'shipper') {
      if(this.filterVal.shipperID != '' || this.filterVal.shipperName != '' || this.filterVal.shipperCompanyName != '') {
        this.shippers = [];
        this.lastEvaluatedKeyShipper = '';
        this.activeDiv = 'shipperTable';
        this.filterVal.shipperID = '';
        this.filterVal.shipperName = '';
        this.filterVal.shipperCompanyName = '';
        this.suggestedShipper = [];
        this.suggestedShipperCompanies = [];
        this.dataMessageConsignor = Constants.FETCHING_DATA;
        this.fetchShippersCount();
        // this.initDataTableShipper();
        this.shipperDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'consignee') {
      if(this.filterVal.consigneeID != '' || this.filterVal.consigneeName != '' || this.filterVal.receiverCompanyName != '') {
        this.receivers = [];
        this.lastEvaluatedKeyConsignee = '';
        this.activeDiv = 'consigneeTable';
        this.filterVal.consigneeID = '';
        this.filterVal.consigneeName = '';
        this.filterVal.receiverCompanyName = '';
        this.suggestedConsignees = [];
        this.suggestedConsigneeCompanies = [];
        this.dataMessageConsignee = Constants.FETCHING_DATA;
        this.fetchConsigneeCount();
        // this.initDataTableConsignee();
        this.consigneeDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'staff') {
      if(this.filterVal.staffID != '' || this.filterVal.staffName != '' || this.filterVal.staffCompanyName != '') {
        this.receivers = [];
        this.lastEvaluatedKeyStaff = '';
        this.activeDiv = 'staffTable';
        this.filterVal.staffID = '';
        this.filterVal.staffName = '';
        this.filterVal.staffCompanyName = '';
        this.suggestedStaffs = [];
        this.dataMessageEmployee = Constants.FETCHING_DATA;
        this.suggestedStaffCompanies = [];
        this.fetchStaffsCount();
        this.initDataTableStaff();
        this.staffDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    } else if(type == 'company') {
      if(this.filterVal.companyID != '' || this.filterVal.fcompanyName != '' || this.filterVal.factoringCompanyName != '') {
        this.fcCompanies = [];
        this.suggestedFactoringCompanies = [];
        this.lastEvaluatedKeyCompany = '';
        this.activeDiv = 'companyTable';
        this.filterVal.companyID = '';
        this.filterVal.fcompanyName = '';
        this.filterVal.factoringCompanyName = '';
        this.suggestedCompany = [];
        this.dataMessageFactoring = Constants.FETCHING_DATA;
        this.fetchFcCompaniesCount();
        // this.initDataTableCompany();
        this.companyDraw = 0;
        this.resetCountResult(type);
      } else {
        return false
      }

    }
  }

  removeAddress(index, addressID = null, type='') {
    if(type == 'vendor') {
      if (addressID != null) {
        this.deleteVendorAddr.push(addressID);
      }
      this.vendorData.address.splice(index, 1);

    } else if(type == 'customer') {
      if (addressID != null) {
        this.deleteCustomerAddr.push(addressID);
      }
      this.customerData.address.splice(index, 1);

    } else if(type == 'broker') {
      if (addressID != null) {
        this.deleteBrokerAddr.push(addressID);
      }
      this.brokerData.address.splice(index, 1);

    } else if(type == 'carrier') {
      if (addressID != null) {
        this.deleteCarrierAddr.push(addressID);
      }
      this.carrierData.address.splice(index, 1);

    } else if(type == 'operator') {
      if (addressID != null) {
        this.deleteOperatorAddr.push(addressID);
      }
      this.ownerData.address.splice(index, 1);

    } else if(type == 'shipper') {
      if (addressID != null) {
        this.deleteShipperAddr.push(addressID);
      }
      this.shipperData.address.splice(index, 1);

    } else if(type == 'consignee') {
      if (addressID != null) {
        this.deleteConsigneeAddr.push(addressID);
      }
      this.consigneeData.address.splice(index, 1);

    } else if(type == 'staff') {
      if (addressID != null) {
        this.deleteStaffAddr.push(addressID);
      }
      this.staffData.address.splice(index, 1);

    } else if(type == 'company') {
      if (addressID != null) {
        this.deleteCompanyAddr.push(addressID);
      }
      this.fcCompanyData.address.splice(index, 1);
    }
  }

  clearAddress(index, type='') {
    if(type == 'vendor') {
      this.vendorData.address[index].address1 = '';
      this.vendorData.address[index].address2 = '';
      this.vendorData.address[index].cityID = '';
      this.vendorData.address[index].cityName = '';
      this.vendorData.address[index].countryID = '';
      this.vendorData.address[index].countryName = '';
      this.vendorData.address[index].stateID = '';
      this.vendorData.address[index].stateName = '';
      this.vendorData.address[index].userLocation = '';
      this.vendorData.address[index].zipCode = '';

    } else if(type == 'customer') {
      this.customerData.address[index].addressType = '';
      this.customerData.address[index].address1 = '';
      this.customerData.address[index].address2 = '';
      this.customerData.address[index].cityID = '';
      this.customerData.address[index].cityName = '';
      this.customerData.address[index].countryID = '';
      this.customerData.address[index].countryName = '';
      this.customerData.address[index].stateID = '';
      this.customerData.address[index].stateName = '';
      this.customerData.address[index].userLocation = '';
      this.customerData.address[index].zipCode = '';

    } else if(type == 'broker') {
      this.brokerData.address[index].address1 = '';
      this.brokerData.address[index].address2 = '';
      this.brokerData.address[index].cityName = '';
      this.brokerData.address[index].countryName = '';
      this.brokerData.address[index].stateName = '';
      this.brokerData.address[index].userLocation = '';
      this.brokerData.address[index].zipCode = '';
      this.brokerData.address[index].countryCode = '';
      this.brokerData.address[index].stateCode = '';

    } else if(type == 'carrier') {
      this.carrierData.address[index].address1 = '';
      this.carrierData.address[index].address2 = '';
      this.carrierData.address[index].cityID = '';
      this.carrierData.address[index].cityName = '';
      this.carrierData.address[index].countryID = '';
      this.carrierData.address[index].countryName = '';
      this.carrierData.address[index].stateID = '';
      this.carrierData.address[index].stateName = '';
      this.carrierData.address[index].userLocation = '';
      this.carrierData.address[index].zipCode = '';

    } else if(type == 'operator') {
      this.ownerData.address[index].address1 = '';
      this.ownerData.address[index].address2 = '';
      this.ownerData.address[index].cityID = '';
      this.ownerData.address[index].cityName = '';
      this.ownerData.address[index].countryID = '';
      this.ownerData.address[index].countryName = '';
      this.ownerData.address[index].stateID = '';
      this.ownerData.address[index].stateName = '';
      this.ownerData.address[index].userLocation = '';
      this.ownerData.address[index].zipCode = '';

    } else if(type == 'shipper') {
      this.shipperData.address[index].address1 = '';
      this.shipperData.address[index].address2 = '';
      this.shipperData.address[index].cityID = '';
      this.shipperData.address[index].cityName = '';
      this.shipperData.address[index].countryID = '';
      this.shipperData.address[index].countryName = '';
      this.shipperData.address[index].stateID = '';
      this.shipperData.address[index].stateName = '';
      this.shipperData.address[index].userLocation = '';
      this.shipperData.address[index].zipCode = '';

    } else if(type == 'consignee') {
      this.consigneeData.address[index].address1 = '';
      this.consigneeData.address[index].address2 = '';
      this.consigneeData.address[index].cityID = '';
      this.consigneeData.address[index].cityName = '';
      this.consigneeData.address[index].countryID = '';
      this.consigneeData.address[index].countryName = '';
      this.consigneeData.address[index].stateID = '';
      this.consigneeData.address[index].stateName = '';
      this.consigneeData.address[index].userLocation = '';
      this.consigneeData.address[index].zipCode = '';

    } else if(type == 'staff') {
      this.staffData.address[index].address1 = '';
      this.staffData.address[index].address2 = '';
      this.staffData.address[index].cityID = '';
      this.staffData.address[index].cityName = '';
      this.staffData.address[index].countryID = '';
      this.staffData.address[index].countryName = '';
      this.staffData.address[index].stateID = '';
      this.staffData.address[index].stateName = '';
      this.staffData.address[index].userLocation = '';
      this.staffData.address[index].zipCode = '';

    } else if(type == 'company') {
      this.fcCompanyData.address[index].address1 = '';
      this.fcCompanyData.address[index].address2 = '';
      this.fcCompanyData.address[index].cityID = '';
      this.fcCompanyData.address[index].cityName = '';
      this.fcCompanyData.address[index].countryID = '';
      this.fcCompanyData.address[index].countryName = '';
      this.fcCompanyData.address[index].stateID = '';
      this.fcCompanyData.address[index].stateName = '';
      this.fcCompanyData.address[index].userLocation = '';
      this.fcCompanyData.address[index].zipCode = '';
    }
  }

  enableLogin(event) {
    this.loginDiv = event.target.checked;
  }

  saveUserData() {
    this.hasError = false;
    this.hasSuccess = false;
    this.hideErrors();
      const data = {
        firstName: this.staffData['firstName'],
        lastName: this.staffData['lastName'],
        employeeID: this.staffData['employeeID'],
        dateOfBirth: this.staffData['dateOfBirth'],
        phone: this.staffData['workPhone'],
        email: this.staffData['workEmail'],
        currentStatus: 'ACTIVE',
        departmentName: this.staffData.userAccount['department'],
        userType: this.staffData.userData.userType,
        userName: this.staffData.userData.username,
        password: this.staffData.userData.password,
      };

      // create form data instance
      const formData = new FormData();

      //append other fields
      formData.append('data', JSON.stringify(data));

      this.apiService.postData('users', formData, true).subscribe({
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
                //this.throwErrors();
                this.hasError = true;
                this.toastr.error('Please see the errors');
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.errorClass = false;
        }
      });
  }

  // next button func
  nextResults(type) {
    if(type == 'customer') {
      this.customerNext = true;
      this.customerPrev = true;
      this.customerDraw += 1;
      this.initDataTable();

    } else if(type == 'broker') {
      this.brokerNext = true;
      this.brokerPrev = true;
      this.brokerDraw += 1;
      this.initDataTableBroker();

    } else if(type == 'vendor') {
      this.vendorNext = true;
      this.vendorPrev = true;
      this.vendorDraw += 1;
      this.initDataTableVendor();

    } else if(type == 'carrier') {
      this.carrierNext = true;
      this.carrierPrev = true;
      this.carrierDraw += 1;
      this.initDataTableCarrier();

    } else if(type == 'operator') {
      this.ownerOperatorNext = true;
      this.ownerOperatorPrev = true;
      this.ownerOperatorDraw += 1;
      this.initDataTableOperator();

    } else if(type == 'shipper') {
      this.shipperNext = true;
      this.shipperPrev = true;
      this.shipperDraw += 1;
      this.initDataTableShipper();

    } else if(type == 'consignee') {
      this.consigneeNext = true;
      this.consigneePrev = true;
      this.consigneeDraw += 1;
      this.initDataTableConsignee();

    } else if(type == 'staff') {
      this.staffNext = true;
      this.staffPrev = true;
      this.staffDraw += 1;
      this.initDataTableStaff();

    } else if(type == 'company') {
      this.companyNext = true;
      this.companyPrev = true;
      this.companyDraw += 1;
      this.initDataTableCompany();
    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'customer') {
      this.customerNext = true;
      this.customerPrev = true;
      this.customerDraw -= 1;
      this.lastEvaluatedKeyCustomer = this.customerPrevEvauatedKeys[this.customerDraw];
      this.initDataTable();

    } else if(type == 'broker') {
      this.brokerNext = true;
      this.brokerPrev = true;
      this.brokerDraw -= 1;
      this.lastEvaluatedKeyBroker = this.brokerPrevEvauatedKeys[this.brokerDraw];
      this.initDataTableBroker();

    } else if(type == 'vendor') {
      this.vendorNext = true;
      this.vendorPrev = true;
      this.vendorDraw -= 1;
      this.lastEvaluatedKeyVendor = this.vendorPrevEvauatedKeys[this.vendorDraw];
      this.initDataTableVendor();

    } else if(type == 'carrier') {
      this.carrierNext = true;
      this.carrierPrev = true;
      this.carrierDraw -= 1;
      this.lastEvaluatedKeyCarrier = this.carrierPrevEvauatedKeys[this.carrierDraw];
      this.initDataTableCarrier();

    } else if(type == 'operator') {
      this.ownerOperatorNext = true;
      this.ownerOperatorPrev = true;
      this.ownerOperatorDraw -= 1;
      this.lastEvaluatedKeyOperator = this.ownerOperatorPrevEvauatedKeys[this.ownerOperatorDraw];
      this.initDataTableOperator();

    } else if(type == 'shipper') {
      this.shipperNext = true;
      this.shipperPrev = true;
      this.shipperDraw -= 1;
      this.lastEvaluatedKeyShipper = this.shipperPrevEvauatedKeys[this.shipperDraw];
      this.initDataTableShipper();

    } else if(type == 'consignee') {
      this.consigneeNext = true;
      this.consigneePrev = true;
      this.consigneeDraw -= 1;
      this.lastEvaluatedKeyConsignee = this.consigneePrevEvauatedKeys[this.consigneeDraw];
      this.initDataTableConsignee();

    } else if(type == 'staff') {
      this.staffNext = true;
      this.staffPrev = true;
      this.staffDraw -= 1;
      this.lastEvaluatedKeyStaff = this.staffPrevEvauatedKeys[this.staffDraw];
      this.initDataTableStaff();

    } else if(type == 'company') {
      this.companyNext = true;
      this.companyPrev = true;
      this.companyDraw -= 1;
      this.lastEvaluatedKeyCompany = this.companyPrevEvauatedKeys[this.companyDraw];
      this.initDataTableCompany();
    }
  }

  getStartandEndVal(type) {
    if(type == 'customer') {
      this.custtStartPoint = this.customerDraw*this.pageLength+1;
      this.custtEndPoint = this.custtStartPoint+this.pageLength-1;

    } else if(type == 'broker') {
      this.brokerStartPoint = this.brokerDraw*this.pageLength+1;
      this.brokerEndPoint = this.brokerStartPoint+this.pageLength-1;

    } else if(type == 'vendor') {
      this.vendorStartPoint = this.vendorDraw*this.pageLength+1;
      this.vendorEndPoint = this.vendorStartPoint+this.pageLength-1;

    } else if(type == 'carrier') {
      this.carrierStartPoint = this.carrierDraw*this.pageLength+1;
      this.carrierEndPoint = this.carrierStartPoint+this.pageLength-1;

    } else if(type == 'operator') {
      this.ownerOperatorStartPoint = this.ownerOperatorDraw*this.pageLength+1;
      this.ownerOperatorEndPoint = this.ownerOperatorStartPoint+this.pageLength-1;

    } else if(type == 'shipper') {
      this.shipperStartPoint = this.shipperDraw*this.pageLength+1;
      this.shipperEndPoint = this.shipperStartPoint+this.pageLength-1;

    } else if(type == 'consignee') {
      this.consigneeStartPoint = this.consigneeDraw*this.pageLength+1;
      this.consigneeEndPoint = this.consigneeStartPoint+this.pageLength-1;

    } else if(type == 'staff') {
      this.staffStartPoint = this.staffDraw*this.pageLength+1;
      this.staffEndPoint = this.staffStartPoint+this.pageLength-1;

    } else if(type == 'company') {
      this.companyStartPoint = this.companyDraw*this.pageLength+1;
      this.companyEndPoint = this.companyStartPoint+this.pageLength-1;
    }
  }

  manAddress(event, i, type) {
    if(type == 'customer') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.customerData.address[i]['userLocation'] = '';
      this.customerData.address[i].countryCode = '';
      this.customerData.address[i].countryName = '';
      this.customerData.address[i].stateCode = '';
      this.customerData.address[i].stateName = '';
      this.customerData.address[i].cityName = '';
      this.customerData.address[i].zipCode = '';
      this.customerData.address[i].address1 = '';
      this.customerData.address[i].address2 = '';
      if(this.customerData.address[i].geoCords != undefined){
        this.customerData.address[i].geoCords.lat = '';
        this.customerData.address[i].geoCords.lng = '';
      }
    } else if(type == 'broker') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.brokerData.address[i]['userLocation'] = '';
      this.brokerData.address[i].countryCode = '';
      this.brokerData.address[i].stateCode = '';
      this.brokerData.address[i].countryName = '';
      this.brokerData.address[i].stateName = '';
      this.brokerData.address[i].cityName = '';
      this.brokerData.address[i].zipCode = '';
      this.brokerData.address[i].address1 = '';
      this.brokerData.address[i].address2 = '';
      if(this.brokerData.address[i].geoCords != undefined){
        this.brokerData.address[i].geoCords.lat = '';
        this.brokerData.address[i].geoCords.lng = '';
      }
    } else if(type == 'vendor') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.vendorData.address[i]['userLocation'] = '';
      this.vendorData.address[i].countryCode = '';
      this.vendorData.address[i].countryName = '';
      this.vendorData.address[i].stateCode = '';
      this.vendorData.address[i].stateName = '';
      this.vendorData.address[i].cityName = '';
      this.vendorData.address[i].zipCode = '';
      this.vendorData.address[i].address1 = '';
      this.vendorData.address[i].address2 = '';
      if(this.vendorData.address[i].geoCords != undefined){
        this.vendorData.address[i].geoCords.lat = '';
        this.vendorData.address[i].geoCords.lng = '';
      }
    } else if(type == 'carrier') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.carrierData.address[i]['userLocation'] = '';
      this.carrierData.address[i].countryCode = '';
      this.carrierData.address[i].countryName = '';
      this.carrierData.address[i].stateCode = '';
      this.carrierData.address[i].stateName = '';
      this.carrierData.address[i].cityName = '';
      this.carrierData.address[i].zipCode = '';
      this.carrierData.address[i].address1 = '';
      this.carrierData.address[i].address2 = '';
      if(this.carrierData.address[i].geoCords != undefined){
        this.carrierData.address[i].geoCords.lat = '';
        this.carrierData.address[i].geoCords.lng = '';
      }
    } else if(type == 'owner') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.ownerData.address[i]['userLocation'] = '';
      this.ownerData.address[i].countryCode = '';
      this.ownerData.address[i].countryName = '';
      this.ownerData.address[i].stateCode = '';
      this.ownerData.address[i].stateName = '';
      this.ownerData.address[i].cityName = '';
      this.ownerData.address[i].zipCode = '';
      this.ownerData.address[i].address1 = '';
      this.ownerData.address[i].address2 = '';
      if(this.ownerData.address[i].geoCords != undefined){
        this.ownerData.address[i].geoCords.lat = '';
        this.ownerData.address[i].geoCords.lng = '';
      }
    } else if(type == 'shipper') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.shipperData.address[i]['userLocation'] = '';
      this.shipperData.address[i].countryCode = '';
      this.shipperData.address[i].countryName = '';
      this.shipperData.address[i].stateCode = '';
      this.shipperData.address[i].stateName = '';
      this.shipperData.address[i].cityName = '';
      this.shipperData.address[i].zipCode = '';
      this.shipperData.address[i].address1 = '';
      this.shipperData.address[i].address2 = '';
      if(this.shipperData.address[i].geoCords != undefined){
        this.shipperData.address[i].geoCords.lat = '';
        this.shipperData.address[i].geoCords.lng = '';
      }
    } else if(type == 'consignee') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.consigneeData.address[i]['userLocation'] = '';
      this.consigneeData.address[i].countryCode = '';
      this.consigneeData.address[i].countryName = '';
      this.consigneeData.address[i].stateCode = '';
      this.consigneeData.address[i].stateName = '';
      this.consigneeData.address[i].cityName = '';
      this.consigneeData.address[i].zipCode = '';
      this.consigneeData.address[i].address1 = '';
      this.consigneeData.address[i].address2 = '';
      if(this.consigneeData.address[i].geoCords != undefined){
        this.consigneeData.address[i].geoCords.lat = '';
        this.consigneeData.address[i].geoCords.lng = '';
      }
    } else if(type == 'staff') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.staffData.address[i]['userLocation'] = '';
      this.staffData.address[i].countryCode = '';
      this.staffData.address[i].countryName = '';
      this.staffData.address[i].stateCode = '';
      this.staffData.address[i].stateName = '';
      this.staffData.address[i].cityName = '';
      this.staffData.address[i].zipCode = '';
      this.staffData.address[i].address1 = '';
      this.staffData.address[i].address2 = '';
      if(this.staffData.address[i].geoCords != undefined){
        this.staffData.address[i].geoCords.lat = '';
        this.staffData.address[i].geoCords.lng = '';
      }
    } else if(type == 'fcCompany') {
      if (event.target.checked) {
        $(event.target).closest('.address-item').addClass('open');
      } else {
        $(event.target).closest('.address-item').removeClass('open');
      }
      this.fcCompanyData.address[i]['userLocation'] = '';
      this.fcCompanyData.address[i].countryCode = '';
      this.fcCompanyData.address[i].countryName = '';
      this.fcCompanyData.address[i].stateCode = '';
      this.fcCompanyData.address[i].stateName = '';
      this.fcCompanyData.address[i].cityName = '';
      this.fcCompanyData.address[i].zipCode = '';
      this.fcCompanyData.address[i].address1 = '';
      this.fcCompanyData.address[i].address2 = '';
      if(this.fcCompanyData.address[i].geoCords != undefined){
        this.fcCompanyData.address[i].geoCords.lat = '';
        this.fcCompanyData.address[i].geoCords.lng = '';
      }
    }
  }

  getEditStates(countryCode, type, index) {
    let states = CountryStateCity.GetStatesByCountryCode([countryCode]);
    if(type == 'broker') {
      this.brokerData.address[index].states = states;
    } else if(type == 'customer') {
      this.customerData.address[index].states = states;
    } else if(type == 'vendor') {
      this.vendorData.address[index].states = states;
    } else if(type == 'carrier') {
      this.carrierData.address[index].states = states;
    } else if(type == 'operator') {
      this.ownerData.address[index].states = states;
    } else if(type == 'shipper') {
      this.shipperData.address[index].states = states;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].states = states;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].states = states;
    }
  }

  getEditCities(countryCode, stateCode, type, index) {
    let cities = CountryStateCity.GetCitiesByStateCodes(countryCode, stateCode);
    if(type == 'broker') {
      this.brokerData.address[index].cities = cities;
    } else if(type == 'customer') {
      this.customerData.address[index].cities = cities;
    } else if(type == 'vendor') {
      this.vendorData.address[index].cities = cities;
    } else if(type == 'carrier') {
      this.carrierData.address[index].cities = cities;
    } else if(type == 'operator') {
      this.ownerData.address[index].cities = cities;
    } else if(type == 'shipper') {
      this.shipperData.address[index].cities = cities;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].cities = cities;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].cities = cities;
    }
  }

  brokerType(value: any) {
    this.brokerData.brokerType = value;
  }

  resetCountResult(type) {
    if(type == 'customer') {
      this.custtStartPoint = 1;
      this.custtEndPoint = this.pageLength;
      this.customerDraw = 0;

    } else if(type == 'broker') {
      this.brokerStartPoint = 1;
      this.brokerEndPoint = this.pageLength;
      this.brokerDraw = 0;

    } else if(type == 'vendor') {
      this.vendorStartPoint = 1;
      this.vendorEndPoint = this.pageLength;
      this.vendorDraw = 0;

    } else if(type == 'carrier') {
      this.carrierStartPoint = 1;
      this.carrierEndPoint = this.pageLength;
      this.carrierDraw = 0;

    } else if(type == 'operator') {
      this.ownerOperatorStartPoint = 1;
      this.ownerOperatorEndPoint = this.pageLength;
      this.ownerOperatorDraw = 0;

    } else if(type == 'shipper') {
      this.shipperStartPoint = 1;
      this.shipperEndPoint = this.pageLength;
      this.shipperDraw = 0;

    } else if(type == 'consignee') {
      this.consigneeStartPoint = 1;
      this.consigneeEndPoint = this.pageLength;
      this.consigneeDraw = 0;

    } else if(type == 'staff') {
      this.staffStartPoint = 1;
      this.staffEndPoint = this.pageLength;
      this.staffDraw = 0;

    } else if(type == 'company') {
      this.companyStartPoint = 1;
      this.companyEndPoint = this.pageLength;
      this.companyDraw = 0;
    }
  }

  getCurrentuser = async () => {
    this.isCarrierID = localStorage.getItem('carrierID');
    if(this.isCarrierID == undefined || this.isCarrierID == null) {
      let usr = (await Auth.currentSession()).getIdToken().payload;
      this.isCarrierID = usr.carrierID;
    }
  }

  checkCompanyName = _.debounce(function(value, type, searchType='') {

    this.apiService
        .getData(`customers/suggestion/${value}?type=${searchType}`)
        .subscribe((result) => {
          if(searchType == 'company') {
            this.suggestedCustomerCompanies = result.Items.map(item => item.companyName).filter((value, index, self) => self.indexOf(value) === index)

          } else {
            this.suggestedCustomers = result.Items;
            this.suggestedCustomers = this.suggestedCustomers.map(function (v) {
              if(v.lastName != undefined && v.lastName != '') {
                v.name = v.firstName + ' ' + v.lastName;
                v.searchVall = v.firstName + '-' + v.lastName;
              } else {
                v.name = v.firstName;
                v.searchVall = v.firstName;
              }
              return v;
            })
          }
        });
  }, 400);

  getEditRecord(id, type) {
    this.apiService.getData('contacts/detail/' + id).subscribe((result: any) => {
      if(result.Items.length > 0) {
        delete result.Items[0].contactSK;
        delete result.Items[0].carrierID;
        delete result.Items[0].timeModified;

        if(type == 'broker') {
          this.brokerData = result.Items[0];
          for (let k = 0; k < this.brokerData['address'].length; k++) {
            const element = this.brokerData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'broker', k);
              this.getEditCities(element.countryCode, element.stateCode, 'broker', k);
            }
          }

        } else if(type == 'carrier') {
          this.carrierData = result.Items[0];
          for (let k = 0; k < this.carrierData['address'].length; k++) {
            const element = this.carrierData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'carrier', k);
              this.getEditCities(element.countryCode, element.stateCode, 'carrier', k);
            }
          }

        } else if(type == 'consignee') {
          this.consigneeData = result.Items[0];
          for (let k = 0; k < this.consigneeData['address'].length; k++) {
            const element = this.consigneeData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'consignee', k);
              this.getEditCities(element.countryCode, element.stateCode, 'consignee', k);
            }
          }

        } else if(type == 'consignor') {
          this.shipperData = result.Items[0];
          for (let k = 0; k < this.shipperData['address'].length; k++) {
            const element = this.shipperData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'consignor', k);
              this.getEditCities(element.countryCode, element.stateCode, 'consignor', k);
            }
          }

        } else if(type == 'customer') {
          this.customerData = result.Items[0];
          for (let k = 0; k < this.customerData['address'].length; k++) {
            const element = this.customerData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'customer', k);
              this.getEditCities(element.countryCode, element.stateCode, 'customer', k);
            }
          }

        } else if(type == 'factoringCompany') {
          this.fcCompanyData = result.Items[0];
          for (let k = 0; k < this.fcCompanyData['address'].length; k++) {
            const element = this.fcCompanyData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'factoringCompany', k);
              this.getEditCities(element.countryCode, element.stateCode, 'factoringCompany', k);
            }
          }

        } else if(type == 'ownerOperator') {
          this.ownerData = result.Items[0];
          for (let k = 0; k < this.ownerData['address'].length; k++) {
            const element = this.ownerData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'ownerOperator', k);
              this.getEditCities(element.countryCode, element.stateCode, 'ownerOperator', k);
            }
          }

        } else if(type == 'vendor') {
          this.vendorData = result.Items[0];
          for (let k = 0; k < this.vendorData['address'].length; k++) {
            const element = this.vendorData['address'][k];
            if (element.manual) {
              this.getEditStates(element.countryCode, 'vendor', k);
              this.getEditCities(element.countryCode, element.stateCode, 'vendor', k);
            }
          }
        }
      }
    });
  }

  getContactsCount() {
    this.apiService.getData('contacts/get/types/count').subscribe((result: any) => {
      this.totalRecordsCustomer = result.customerCount;
      this.totalRecordsBroker = result.brokerCount;
      this.totalRecordsVendor = result.vendorCount;
      this.totalRecordsCarrier = result.carrierCount;
      this.totalRecordsOperator = result.operatorCount;
      this.totalRecordsShipper = result.consignorCount;
      this.totalRecordsConsignee = result.consigneeCount;
      this.totalRecordsStaff = result.staffCount;
      this.totalRecordsCompany = result.fcompanyCount;

      this.initDataTableBroker();
    });
  }

  addAdditionalContact(data){
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
  }

  delAdditionalContact(type, index) {
    if(type == 'broker') {
      this.brokerData.additionalContact.splice(index, 1);
    } else if(type == 'carrier') {
      this.carrierData.additionalContact.splice(index, 1);
    } else if(type == 'consignee') {
      this.consigneeData.additionalContact.splice(index, 1);
    } else if(type == 'consignor') {
      this.shipperData.additionalContact.splice(index, 1);
    } else if(type == 'customer') {
      this.customerData.additionalContact.splice(index, 1);
    } else if(type == 'ownerOperator') {
      this.ownerData.additionalContact.splice(index, 1);
    }
  }
}

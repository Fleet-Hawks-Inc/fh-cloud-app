import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HereMapService, ListService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {

  Asseturl = this.apiService.AssetUrl;
  customers = [];
  drivers = [];
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
      manual: false
    }],
    additionalContact: {}
  };

  // Broker Object
  brokerData = {
    entityType: 'broker',
    brokerType: 'company',
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
      manual: false
    }],
    additionalContact: {}
  };

  // ownerOperator Object
  ownerData = {
    paymentDetails: {},
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
      manual: false
    }],
    additionalContact: {}
  };

  // Vendor Object
  vendorData = {
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
      manual: false
    }],
  };

  // Carrier Object
  carrierData = {
    entityType: 'carrier',
    paymentDetails: {},
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
      manual: false
    }],
    additionalContact: {}

  };

  // Shipper Object
  shipperData = {
    entityType: 'shipper',
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
      manual: false
    }],
    additionalContact: {}
  };

  // Consignee Object
  consigneeData = {
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
      manual: false
    }],
    additionalContact: {}
  };

  // fcCompany Object
  fcCompanyData = {
    entityType: 'factoring company',
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
      manual: false
    }],
    fcDetails: {}
  };

   // Staff Object
   staffData = {
    entityType: 'staff',
    paymentDetails: {},
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
      manual: false
    }],
    userAccount: {},
    userData : {
      username: '',
      userType: '',
      password: '',
      confirmPassword: ''
    }
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
  lastEvaluatedKeyDriver = '';
  totalRecordsCustomer = 20;
  totalRecordsBroker = 20;
  totalRecordsVendor = 20;
  totalRecordsCarrier = 20;
  totalRecordsOperator = 20;
  totalRecordsShipper = 20;
  totalRecordsConsignee = 20;
  totalRecordsStaff = 20;
  totalRecordsCompany = 20;
  totalRecordsDriver = 20;
  activeDiv = 'customerTable';
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
    driverID: '',
    driverName: '',
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
  suggestedDriver = [];

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
  driverNext = false;
  driverPrev = true;
  driverDraw = 0;
  driverPrevEvauatedKeys = [''];
  driverStartPoint = 1;
  driverEndPoint = this.pageLength;
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
    this.fetchCountries();
    this.fetchCustomersCount();
    this.fetchBrokersCount();
    this.fetchVendorsCount();
    this.fetchCarriersCount();
    this.fetchOwnerOperatorsCount();
    this.fetchShippersCount();
    this.fetchConsigneeCount();
    this.fetchStaffsCount();
    this.fetchFcCompaniesCount();
    this.fetchDriversCount();

    this.initDataTable();
    this.initDataTableBroker();
    this.initDataTableVendor();
    this.initDataTableCarrier();
    this.initDataTableOperator();
    this.initDataTableShipper();
    this.initDataTableConsignee();
    this.initDataTableStaff();
    this.initDataTableCompany();
    this.initDataTableDriver();

    this.searchLocation();
    this.fetchAllCountriesIDs();
    this.fetchAllStatesIDs();
    this.fetchAllCitiesIDs();

    $(document).ready(() => {
      this.form = $('#customerForm, #brokerForm, #vendorForm, #carrierForm, #consigneeForm').validate();
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

  openDetail(targetModal, data) {
    if(data.profileImg != '' && data.profileImg != undefined && data.profileImg != null) {
      this.detailImgPath = `${this.Asseturl}/${data.carrierID}/${data.profileImg}`;
    } else {
      this.detailImgPath = this.defaultProfilePath;
    }
    $('.modal').modal('hide');
    this.userDetailTitle = data.firstName;
    const modalRef = this.modalService.open(targetModal);
    this.userDetailData = data;
  }

  async userAddress(data: any, i: number, item: any) {
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    $('div').removeClass('show-search__result');

    data.address[i].userLocation = result.address.label;
    data.address[i].geoCords.lat = result.position.lat;
    data.address[i].geoCords.lng = result.position.lng;

    let countryID = await this.fetchCountriesByName(result.address.countryName);
    data.address[i].countryID = countryID;
    data.address[i].countryName = result.address.countryName;

    let stateID = await this.fetchStatesByName(result.address.state);
    data.address[i].stateID = stateID;
    data.address[i].stateName = result.address.state;

    let cityID = await this.fetchCitiesByName(result.address.city);
    data.address[i].cityID = cityID;
    data.address[i].cityName = result.address.city;
    if (result.address.houseNumber === undefined) {
      result.address.houseNumber = '';
    }
    if (result.address.street === undefined) {
      result.address.street = '';
    }
    data.address[i].zipCode = result.address.postalCode;
    data.address[i].address1 = `${result.title}, ${result.address.houseNumber} ${result.address.street}`;
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
      countryID: '',
      stateID: '',
      cityID: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: { lat: '', lng: '' }
    });
  }

  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
        $('.map-search__results').hide();
        $('div').removeClass('show-search__result');
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

    for (let i = 0; i < this.customerData.address.length; i++) {
      const element = this.customerData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.customerData));

    this.apiService.postData('customers', formData, true).
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
                this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.listService.fetchCustomers();
          $('#addCustomerModal').modal('hide');
          this.showMainModal();
          this.customers = [];
          this.fetchCustomersCount();
          this.activeDiv = 'customerTable';
          // this.rerender();
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

    this.hideErrors();
    this.removeAddressFields(this.customerData);

    for (let i = 0; i < this.customerData.address.length; i++) {
      if(this.customerData.address[i].geoCords == undefined) {
        this.customerData.address[i].geoCords = {
          lat: '',
          lng: ''
        };
      }
    
      const element = this.customerData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        element['geoCords']['lat'] = '';
        element['geoCords']['lng'] = '';
        result = result.items[0];
        
        if(result != undefined) {
          element['geoCords']['lat'] = result.position.lat;
          element['geoCords']['lng'] = result.position.lng;
        }
      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.customerData));

    this.apiService.putData('customers', formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteCustomerAddr.length; i++) {
          const element = this.deleteCustomerAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addCustomerModal').modal('hide');
        this.showMainModal();
        this.customers = [];
        this.activeDiv = 'customerTable';
        this.toastr.success('Customer updated successfully');
      },
    });
  }

  // Add Broker
  async addBroker() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    for (let i = 0; i < this.brokerData.address.length; i++) {
      const element = this.brokerData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.brokerData));

    this.apiService.postData('brokers', formData, true).
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
              this.throwErrors();
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#addBrokerModal').modal('hide');
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

    this.hideErrors();

    for (let i = 0; i < this.ownerData.address.length; i++) {
      const element = this.ownerData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.ownerData));

    this.apiService.postData('ownerOperators', formData, true).
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
              this.throwErrors();
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#addOwnerOperatorModal').modal('hide');
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

    this.hideErrors();
    this.removeAddressFields(this.ownerData);

    for (let i = 0; i < this.ownerData.address.length; i++) {
      const element = this.ownerData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.ownerData));

    this.apiService.putData('ownerOperators', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              // this.errors[val.context.key] = val.message;
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res.Items[0];
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteOperatorAddr.length; i++) {
          const element = this.deleteOperatorAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addOwnerOperatorModal').modal('hide');
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

    this.hideErrors();
    this.removeAddressFields(this.brokerData);
    for (let i = 0; i < this.brokerData.address.length; i++) {
      const element = this.brokerData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.brokerData));

    this.apiService.putData('brokers', formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteBrokerAddr.length; i++) {
          const element = this.deleteBrokerAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addBrokerModal').modal('hide');
        this.showMainModal();
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        // this.rerender();
        this.toastr.success('Broker updated successfully');
      },
    });
  }

  // Add Vendor
  async addVendor() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();

    for (let i = 0; i < this.vendorData.address.length; i++) {
      const element = this.vendorData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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

    this.apiService.postData('vendors', formData, true).
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
                this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.vendorData = {
            entityType: '',
            address: []
          };
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

    this.hideErrors();
    this.removeAddressFields(this.vendorData);
    for (let i = 0; i < this.vendorData.address.length; i++) {
      const element = this.vendorData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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

    this.apiService.putData('vendors', formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteVendorAddr.length; i++) {
          const element = this.deleteVendorAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addVendorModal').modal('hide');
        this.showMainModal();
        this.vendors = [];
        this.activeDiv = 'vendorTable';
        this.toastr.success('Vendor updated successfully');
      },
    });
  }

  // Add Carrier
  async addCarrier() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();

    for (let i = 0; i < this.carrierData.address.length; i++) {
      const element = this.carrierData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.carrierData));

    this.apiService.postData('externalCarriers', formData, true).
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
                this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addCarrierModal').modal('hide');
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

    this.hideErrors();
    this.removeAddressFields(this.carrierData);

    for (let i = 0; i < this.carrierData.address.length; i++) {
      const element = this.carrierData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.carrierData));

    this.apiService.putData('externalCarriers', formData, true).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              // this.errors[val.context.key] = val.message;
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteCarrierAddr.length; i++) {
          const element = this.deleteCarrierAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addCarrierModal').modal('hide');
        this.showMainModal();
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        // this.rerender();
        this.toastr.success('Carrier updated successfully');
      },
    });
  }


  // Add Shipper
  async addShipper() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    for (let i = 0; i < this.shipperData.address.length; i++) {
      if(this.shipperData.address[i].geoCords == undefined) {
        this.shipperData.address[i].geoCords = {
          lat: '',
          lng: ''
        };
      }

      const element = this.shipperData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        if(result != undefined) {
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.shipperData));

    this.apiService.postData('shippers', formData, true).
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
                this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addShipperModal').modal('hide');
          this.listService.fetchShippers();
          this.fetchShippersCount();
          this.showMainModal();
          this.shippers = [];
          this.activeDiv = 'shipperTable';
          this.toastr.success('Shipper Added Successfully');

        }
      });
  }

  async updateShipper() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    this.removeAddressFields(this.shipperData);
    for (let i = 0; i < this.shipperData.address.length; i++) {
      if(this.shipperData.address[i].geoCords == undefined) {
        this.shipperData.address[i].geoCords = {
          lat: '',
          lng: ''
        };
      }

      const element = this.shipperData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);

        result = result.items[0];
        if(result != undefined) {
          element.geoCords.lat = result.position.lat;
          element.geoCords.lng = result.position.lng;
        }
      }
    }

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.shipperData));

    this.apiService.putData('shippers', formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteShipperAddr.length; i++) {
          const element = this.deleteShipperAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addShipperModal').modal('hide');
        this.shippers = [];
        this.showMainModal();
        this.activeDiv = 'shipperTable';
        this.toastr.success('Shipper updated successfully');
      },
    });
  }


  // Add Consignee
  async addConsignee() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();

    for (let i = 0; i < this.consigneeData.address.length; i++) {
      const element = this.consigneeData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.consigneeData));

    this.apiService.postData('receivers', formData, true).
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
                this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addConsigneeModal').modal('hide');
          this.listService.fetchReceivers();
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

    this.hideErrors();
    this.removeAddressFields(this.consigneeData);
    for (let i = 0; i < this.consigneeData.address.length; i++) {
      const element = this.consigneeData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    formData.append('data', JSON.stringify(this.consigneeData));

    this.apiService.putData('receivers', formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteConsigneeAddr.length; i++) {
          const element = this.deleteConsigneeAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addConsigneeModal').modal('hide');
        this.receivers = [];
        this.showMainModal();
        this.activeDiv = 'consigneeTable';
        this.toastr.success('Consignee updated successfully');
      },
    });
  }

  // Add FC Company
  async addFCompany() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    for (let i = 0; i < this.fcCompanyData.address.length; i++) {
      const element = this.fcCompanyData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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

    this.apiService.postData('factoringCompanies', formData, true).
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
                this.throwErrors();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
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

    this.hideErrors();
    this.removeAddressFields(this.fcCompanyData);
    for (let i = 0; i < this.fcCompanyData.address.length; i++) {
      const element = this.fcCompanyData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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

    this.apiService.putData('factoringCompanies', formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteCompanyAddr.length; i++) {
          const element = this.deleteCompanyAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addFCModal').modal('hide');
        this.showMainModal();
        this.fcCompanies = [];
        this.activeDiv = 'companyTable';
        this.toastr.success('Company updated successfully');
      },
    });
  }

  // Add addStaff
  async addStaff() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    this.spinner.show();
    for (let i = 0; i < this.staffData.address.length; i++) {
      const element = this.staffData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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
    
    this.apiService.postData('staffs?newUser='+this.newStaffUser, formData, true).
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
                this.throwErrors();
                this.spinner.hide();
                this.hasError = true;
                this.Error = 'Please see the errors';
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.spinner.hide();
          this.response = res;
          this.hasSuccess = true;
          if(this.staffData.loginEnabled){
            this.saveUserData();
          }
          $('#addStaffModal').modal('hide');
          this.staffs = [];
          this.fetchStaffsCount();
          this.showMainModal();
          this.activeDiv = 'staffTable';
          this.toastr.success('Staff Added Successfully');
        }
      });
  }

  async updateStaff() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();
    this.removeAddressFields(this.staffData);
    for (let i = 0; i < this.staffData.address.length; i++) {
      const element = this.staffData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
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

    this.apiService.putData('staffs?newUser='+this.newStaffUser, formData, true).subscribe({
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
              this.hasError = true;
              this.Error = 'Please see the errors';
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;

        //delete address
        for (let i = 0; i < this.deleteStaffAddr.length; i++) {
          const element = this.deleteStaffAddr[i];
          this.apiService.deleteData(`addresses/deleteAddress/${element}`).subscribe(async (result: any) => {});
        }

        $('#addStaffModal').modal('hide');
        this.staffs = [];
        this.showMainModal();
        this.activeDiv = 'staffTable';
        this.toastr.success('Staff updated successfully');
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
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }

  getStates(id, type='', index='') {
    let countryResult = this.countriesObject[id];
    if(type == 'vendor') {
      this.vendorData.address[index].countryName = countryResult;
    } else if(type == 'customer') {
      this.customerData.address[index].countryName = countryResult;
    } else if(type == 'broker') {
      this.brokerData.address[index].countryName = countryResult;
    } else if(type == 'carrier') {
      this.carrierData.address[index].countryName = countryResult;
    } else if(type == 'operator') {
      this.ownerData.address[index].countryName = countryResult;
    } else if(type == 'shipper') {
      this.shipperData.address[index].countryName = countryResult;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].countryName = countryResult;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].countryName = countryResult;
    } else if(type == 'staff') {
      this.staffData.address[index].countryName = countryResult;
    }

    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(id, type='', index='') {
    let stateResult = this.statesObject[id];
    if(type == 'vendor') {
      this.vendorData.address[index].stateName = stateResult;
    } else if(type == 'customer') {
      this.customerData.address[index].stateName = stateResult;
    } else if(type == 'broker') {
      this.brokerData.address[index].stateName = stateResult;
    } else if(type == 'carrier') {
      this.carrierData.address[index].stateName = stateResult;
    } else if(type == 'operator') {
      this.ownerData.address[index].stateName = stateResult;
    } else if(type == 'shipper') {
      this.shipperData.address[index].stateName = stateResult;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].stateName = stateResult;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].stateName = stateResult;
    } else if(type == 'staff') {
      this.staffData.address[index].stateName = stateResult;
    }

    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  getCityName(id, type='', index='') {
    let result = this.citiesObject[id];
    if(type == 'vendor') {
      this.vendorData.address[index].cityName = result;
    } else if(type == 'customer') {
      this.customerData.address[index].cityName = result;
    } else if(type == 'broker') {
      this.brokerData.address[index].cityName = result;
    } else if(type == 'carrier') {
      this.carrierData.address[index].cityName = result;
    } else if(type == 'operator') {
      this.ownerData.address[index].cityName = result;
    } else if(type == 'shipper') {
      this.shipperData.address[index].cityName = result;
    } else if(type == 'consignee') {
      this.consigneeData.address[index].cityName = result;
    } else if(type == 'company') {
      this.fcCompanyData.address[index].cityName = result;
    } else if(type == 'staff') {
      this.staffData.address[index].cityName = result;
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
        this.imageText = 'Change Picture';
      }
    }
  }


  fetchAddress() {
    return this.apiService.getData('addresses');
  }

  fetchCustomersCount() {
    this.apiService.getData('customers/get/count?customer='+this.filterVal.customerID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsCustomer = result.Count;
      },
    });
  }

  fetchOwnerOperatorsCount() {
    this.apiService.getData('ownerOperators/get/count?operatorID='+this.filterVal.operatorID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsOperator = result.Count;
      },
    });
  }

  fetchDriversCount() {
    this.apiService.getData('drivers/get/count?driverID='+this.filterVal.driverID+'&dutyStatus=').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsDriver = result.Count;
      },
    });
  }

  fetchBrokersCount() {
    this.apiService.getData('brokers/get/count?brokerID='+this.filterVal.brokerID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsBroker = result.Count;
      },
    });
  }

  fetchVendorsCount() {
    this.apiService.getData('vendors/get/count?vendorID='+this.filterVal.vendorID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsVendor = result.Count;
      },
    });
  }

  fetchCarriersCount() {
    this.apiService.getData('externalCarriers/get/count?infoID='+this.filterVal.carrierID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsCarrier = result.Count;
      },
    });
  }

  fetchShippersCount() {
    this.apiService.getData('shippers/get/count?shipperID='+this.filterVal.shipperID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsShipper = result.Count;
      },
    });
  }

  fetchConsigneeCount() {
    this.apiService.getData('receivers/get/count?consigneeID='+this.filterVal.consigneeID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsConsignee = result.Count;
      },
    });
  }

  fetchStaffsCount() {
    this.apiService.getData('staffs/get/count?staffID='+this.filterVal.staffID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsStaff = result.Count;
      },
    });
  }

  fetchFcCompaniesCount() {
    this.apiService.getData('factoringCompanies/get/count?companyID='+this.filterVal.companyID).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        this.totalRecordsCompany = result.Count;
      },
    });
  }


  carrierWSIB(value) {
    if (value !== true) {
      delete this.carrierData['paymentDetails']['wsibAccountNumber'];
      delete this.carrierData['paymentDetails']['wsibExpiry'];
    }
  }

  assignAddressToUpdate(entityAddresses: any) {
    this.newAddress = [];
    for (let i = 0; i < entityAddresses.length; i++) {
      this.newAddress.push({
        addressID: entityAddresses[i].addressID,
        addressType: entityAddresses[i].addressType,
        countryID: entityAddresses[i].countryID,
        countryName: entityAddresses[i].countryName,
        stateID: entityAddresses[i].stateID,
        stateName: entityAddresses[i].stateName,
        cityID: entityAddresses[i].cityID,
        cityName: entityAddresses[i].cityName,
        zipCode: entityAddresses[i].zipCode,
        address1: entityAddresses[i].address1,
        address2: entityAddresses[i].address2,
        userLocation: entityAddresses[i].userLocation
      })
    }
    return this.newAddress;
  }

  async deactivateCustomer(item, userID) {
    let curr = this;
    if (confirm("Are you sure you want to delete?") === true) {
      await this.apiService
      .getData(`customers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe(async(result: any) => {
        curr.customers = [];
        curr.fetchCustomersCount();
        curr.initDataTable();
        curr.toastr.success('Customer deleted successfully');

      });
    }
  }

  deactivateDriver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`drivers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.drivers = [];
        this.fetchDriversCount();
        this.initDataTableDriver();
        this.toastr.success('Driver deleted successfully');
      });
    }
  }

  deactivateBroker(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`brokers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.brokers = [];
        this.fetchBrokersCount();
        this.initDataTableBroker();
        this.toastr.success('Broker deleted successfully');
      });
    }
  }

  deactivateVendor(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`vendors/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.vendors = [];
        this.fetchVendorsCount();
        this.initDataTableVendor();
        this.toastr.success('Vendor deleted successfully');
      });
    }
  }

  deactivateShipper(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`shippers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.shippers = [];
        this.fetchShippersCount();
        this.initDataTableShipper();
        this.toastr.success('Shipper deleted successfully');
      });
    }
  }
  deactivateReceiver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`receivers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.receivers = [];
        this.fetchConsigneeCount();
        this.initDataTableConsignee();
        this.toastr.success('Consignee deleted successfully');
      });
    }
  }

  deactivateStaff(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`staffs/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.staffs = [];
        this.fetchStaffsCount();
        this.initDataTableStaff();
        this.toastr.success('Staff deleted successfully');
      });
    }
  }

  deactivateCompany(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`factoringCompanies/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.fcCompanies = [];
        this.fetchFcCompaniesCount();
        this.initDataTableCompany();
        this.toastr.success('Company deleted successfully');
      });
    }
  }

  deactivateOperator(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`ownerOperators/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.ownerOperatorss = [];
        this.fetchOwnerOperatorsCount();
        this.initDataTableOperator();
        this.toastr.success('Operator deleted successfully');
      });
    }
  }

  deactivateCarrier(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`externalCarriers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.carriers = [];
        this.fetchCarriersCount();
        this.initDataTableCarrier();
        this.toastr.success('Carrier deleted successfully');
      });
    }
  }

  editUser(type: string, item: any, index:any) {
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
      this.customerData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.customerData.address = result;

    } else if(type === 'broker') {
      $('#addBrokerModal').modal('show');
      this.brokerData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.brokerData.address = result;

    } else if(type === 'vendor') {
      $('#addVendorModal').modal('show');
      this.vendorData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.vendorData.address = result;

    } else if(type === 'shipper') {
      $('#addShipperModal').modal('show');
      this.shipperData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.shipperData.address = result;

    } else if(type === 'consignee') {
      $('#addConsigneeModal').modal('show');
      this.consigneeData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.consigneeData.address = result;

    } else if(type === 'staff') {
      $('#addStaffModal').modal('show');
      this.staffData = item;
      if(item.loginEnabled){
        this.loginDiv = true;
        this.fieldvisibility = 'true';
        this.newStaffUser = 'false';
      } else {
        this.staffData.loginEnabled = false;
        this.loginDiv = false;
        this.fieldvisibility = 'false';
        this.newStaffUser = 'true';
      }
      let result = this.assignAddressToUpdate(item.address)
      this.staffData.address = result;

    } else if(type === 'factoring company') {
      $('#addFCModal').modal('show');
      this.fcCompanyData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.fcCompanyData.address = result;

    } else if(type === 'ownerOperator') {
      $('#addOwnerOperatorModal').modal('show');
      this.ownerData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.ownerData.address = result;

    } else if(type === 'carrier') {
      $('#addCarrierModal').modal('show');
      this.carrierData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.carrierData.address = result;
    }
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
    this.imageText = 'Add Picture';
    this.custCurrentTab = 1;

    // Customer Object
    this.customerData = {
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
        manual: false
      }],
      additionalContact: {}
    };

    // Broker Object
    this.brokerData = {
      entityType: 'broker',
      brokerType: 'company',
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
        manual: false
      }],
      additionalContact: {}
    };

    // ownerOperator Object
    this.ownerData = {
      paymentDetails: {},
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
        manual: false
      }],
      additionalContact: {}
    };

    // Vendor Object
    this.vendorData = {
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
        manual: false
      }],
    };

    // Carrier Object
    this.carrierData = {
      entityType: 'carrier',
      paymentDetails: {},
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
        manual: false
      }],
      additionalContact: {}
    };

    // Shipper Object
    this.shipperData = {
      entityType: 'shipper',
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
        manual: false
      }],
      additionalContact: {}
    };

    // Consignee Object
    this.consigneeData = {
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
        manual: false
      }],
      additionalContact: {}
    };

    // fcCompany Object
    this.fcCompanyData = {
      entityType: 'factoring company',
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
        manual: false
      }],
      fcDetails: {}
    };

    // Staff Object
    this.staffData = {
      entityType: 'staff',
      loginEnabled: false,
      paymentDetails: {},
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
        manual: false
      }],
      userAccount: {},
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

  initDataTable() {
    this.spinner.show();
    this.apiService.getData('customers/fetch/records?customer='+this.filterVal.customerID+'&lastKey='+this.lastEvaluatedKeyCustomer)
      .subscribe((result: any) => {
        this.customers = result['Items'];

        if(this.filterVal.customerID != '') {
          this.custtStartPoint = this.totalRecordsCustomer;
          this.custtEndPoint = this.totalRecordsCustomer;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.customerNext = false;
          // for prev button
          if(!this.customerPrevEvauatedKeys.includes(result['LastEvaluatedKey'].customerID)){
            this.customerPrevEvauatedKeys.push(result['LastEvaluatedKey'].customerID);
          }
          this.lastEvaluatedKeyCustomer = result['LastEvaluatedKey'].customerID;

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
      });
  }

  initDataTableBroker() {

    this.spinner.show();
    this.apiService.getData('brokers/fetch/records?brokerID='+this.filterVal.brokerID+'&lastKey='+this.lastEvaluatedKeyBroker)
      .subscribe((result: any) => {
        this.brokers = result['Items'];

        if(this.filterVal.brokerID != '') {
          this.brokerStartPoint = this.totalRecordsBroker;
          this.brokerEndPoint = this.totalRecordsBroker;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.brokerNext = false;
          // for prev button
          if (!this.brokerPrevEvauatedKeys.includes(result['LastEvaluatedKey'].brokerID)) {
            this.brokerPrevEvauatedKeys.push(result['LastEvaluatedKey'].brokerID);
          }
          this.lastEvaluatedKeyBroker = result['LastEvaluatedKey'].brokerID;

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
      });
  }

  initDataTableVendor() {

    this.spinner.show();
    this.apiService.getData('vendors/fetch/records?vendorID='+this.filterVal.vendorID+'&lastKey='+this.lastEvaluatedKeyVendor)
      .subscribe((result: any) => {
        this.vendors = result['Items'];

        if(this.filterVal.vendorID != '') {
          this.vendorStartPoint = this.totalRecordsVendor;
          this.vendorEndPoint = this.totalRecordsVendor;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.vendorNext = false;
          // for prev button
          if (!this.vendorPrevEvauatedKeys.includes(result['LastEvaluatedKey'].vendorID)) {
            this.vendorPrevEvauatedKeys.push(result['LastEvaluatedKey'].vendorID);
          }
          this.lastEvaluatedKeyVendor = result['LastEvaluatedKey'].vendorID;

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
      });
  }

  initDataTableCarrier() {

    this.spinner.show();
    this.apiService.getData('externalCarriers/fetch/records?infoID='+this.filterVal.carrierID+'&lastKey='+this.lastEvaluatedKeyCarrier)
      .subscribe((result: any) => {
        this.carriers = result['Items'];

        if(this.filterVal.carrierID != '') {
          this.carrierStartPoint = this.totalRecordsCarrier;
          this.carrierEndPoint = this.totalRecordsCarrier;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.carrierNext = false;
          // for prev button
          if (!this.carrierPrevEvauatedKeys.includes(result['LastEvaluatedKey'].infoID)) {
            this.carrierPrevEvauatedKeys.push(result['LastEvaluatedKey'].infoID);
          }
          this.lastEvaluatedKeyCarrier = result['LastEvaluatedKey'].infoID;

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
      });
  }

  initDataTableOperator() {

    this.spinner.show();
    this.apiService.getData('ownerOperators/fetch/records?operatorID='+this.filterVal.operatorID+'&lastKey='+this.lastEvaluatedKeyOperator)
      .subscribe((result: any) => {
        this.ownerOperatorss = result['Items'];

        if(this.filterVal.operatorID != '') {
          this.ownerOperatorStartPoint = this.totalRecordsOperator;
          this.ownerOperatorEndPoint = this.totalRecordsOperator;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.ownerOperatorNext = false;
          // for prev button
          if (!this.ownerOperatorPrevEvauatedKeys.includes(result['LastEvaluatedKey'].operatorID)) {
            this.ownerOperatorPrevEvauatedKeys.push(result['LastEvaluatedKey'].operatorID);
          }
          this.lastEvaluatedKeyOperator = result['LastEvaluatedKey'].operatorID;

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
      });
  }

  initDataTableShipper() {

    this.spinner.show();
    this.apiService.getData('shippers/fetch/records?shipperID='+this.filterVal.shipperID+'&lastKey='+this.lastEvaluatedKeyShipper)
      .subscribe((result: any) => {
        this.shippers = result['Items'];

        if(this.filterVal.shipperID != '') {
          this.shipperStartPoint = this.totalRecordsShipper;
          this.shipperEndPoint = this.totalRecordsShipper;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.shipperNext = false;
          // for prev button
          if (!this.shipperPrevEvauatedKeys.includes(result['LastEvaluatedKey'].shipperID)) {
            this.shipperPrevEvauatedKeys.push(result['LastEvaluatedKey'].shipperID);
          }
          this.lastEvaluatedKeyShipper = result['LastEvaluatedKey'].shipperID;

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
      });
  }

  initDataTableConsignee() {

    this.spinner.show();
    this.apiService.getData('receivers/fetch/records?consigneeID='+this.filterVal.consigneeID+'&lastKey='+this.lastEvaluatedKeyConsignee)
      .subscribe((result: any) => {
        this.receivers = result['Items'];

        if(this.filterVal.consigneeID != '') {
          this.consigneeStartPoint = this.totalRecordsConsignee;
          this.consigneeEndPoint = this.totalRecordsConsignee;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.consigneeNext = false;
          // for prev button
          if (!this.consigneePrevEvauatedKeys.includes(result['LastEvaluatedKey'].receiverID)) {
            this.consigneePrevEvauatedKeys.push(result['LastEvaluatedKey'].receiverID);
          }
          this.lastEvaluatedKeyConsignee = result['LastEvaluatedKey'].receiverID;

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
      });
  }

  initDataTableStaff() {

    this.spinner.show();
    this.apiService.getData('staffs/fetch/records?staffID='+this.filterVal.staffID+'&lastKey='+this.lastEvaluatedKeyStaff)
      .subscribe((result: any) => {
        this.staffs = result['Items'];

        if(this.filterVal.staffID != '') {
          this.staffStartPoint = this.totalRecordsStaff;
          this.staffEndPoint = this.totalRecordsStaff;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.staffNext = false;
          // for prev button
          if (!this.staffPrevEvauatedKeys.includes(result['LastEvaluatedKey'].staffID)) {
            this.staffPrevEvauatedKeys.push(result['LastEvaluatedKey'].staffID);
          }
          this.lastEvaluatedKeyStaff = result['LastEvaluatedKey'].staffID;

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
      });
  }

  initDataTableCompany() {

    this.spinner.show();
    this.apiService.getData('factoringCompanies/fetch/records?companyID='+this.filterVal.companyID+'&lastKey='+this.lastEvaluatedKeyCompany)
      .subscribe((result: any) => {
        this.fcCompanies = result['Items'];

        if(this.filterVal.companyID != '') {
          this.companyStartPoint = this.totalRecordsCompany;
          this.companyEndPoint = this.totalRecordsCompany;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.companyNext = false;
          // for prev button
          if (!this.companyPrevEvauatedKeys.includes(result['LastEvaluatedKey'].factoringCompanyID)) {
            this.companyPrevEvauatedKeys.push(result['LastEvaluatedKey'].factoringCompanyID);
          }
          this.lastEvaluatedKeyCompany = result['LastEvaluatedKey'].factoringCompanyID;

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
      });
  }

  initDataTableDriver() {

    this.spinner.show();
    this.apiService.getData('drivers/fetch/records?driverID='+this.filterVal.driverID+'&dutyStatus=&lastKey='+this.lastEvaluatedKeyDriver)
      .subscribe((result: any) => {
        this.drivers = result['Items'];

        if(this.filterVal.driverID != '') {
          this.driverStartPoint = this.totalRecordsDriver;
          this.driverEndPoint = this.totalRecordsDriver;
        }

        if (result['LastEvaluatedKey'] !== undefined) {
          this.driverNext = false;
          // for prev button
          if (!this.driverPrevEvauatedKeys.includes(result['LastEvaluatedKey'].driverID)) {
            this.driverPrevEvauatedKeys.push(result['LastEvaluatedKey'].driverID);
          }
          this.lastEvaluatedKeyDriver = result['LastEvaluatedKey'].driverID;

        } else {
          this.driverNext = true;
          this.lastEvaluatedKeyDriver = '';
          this.driverEndPoint = this.totalRecordsDriver;
        }

        // disable prev btn
        if (this.driverDraw > 0) {
          this.driverPrev = false;
        } else {
          this.driverPrev = true;
        }
        this.spinner.hide();
      });
  }

  getSuggestions(value, type) {
    value = value.toLowerCase()
    if (type == 'customer') {
      this.apiService
        .getData(`customers/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedCustomers = result.Items;
          if (this.suggestedCustomers.length == 0) {
            this.filterVal.customerID = '';
            this.filterVal.customerName = '';
          } else {
            this.suggestedCustomers = this.suggestedCustomers.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
          }
        });

    } else if (type == 'broker') {
      this.apiService
        .getData(`brokers/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedBrokers = result.Items;
          if (this.suggestedBrokers.length == 0) {
            this.filterVal.staffID = '';
            this.filterVal.brokerName = '';
          } else {
            this.suggestedBrokers = this.suggestedBrokers.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
          }
        });

    } else if (type == 'vendor') {
      this.apiService
        .getData(`vendors/nameSuggestions/${value}`)
        .subscribe((result) => {
          this.suggestedVendors = result.Items;
            this.suggestedVendors = this.suggestedVendors.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });

    } else if (type == 'carrier') {
      this.apiService
        .getData(`externalCarriers/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedCarriers = result.Items;
            this.suggestedCarriers = this.suggestedCarriers.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });
    } else if (type == 'operator') {
      this.apiService
        .getData(`ownerOperators/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedOperators = result.Items;
            this.suggestedOperators = this.suggestedOperators.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });
    } else if (type == 'shipper') {
      this.apiService
        .getData(`shippers/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedShipper = result.Items;
            this.suggestedShipper = this.suggestedShipper.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });
    } else if (type == 'consignee') {
      this.apiService
        .getData(`receivers/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedConsignees = result.Items;
            this.suggestedConsignees = this.suggestedConsignees.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });
    } else if (type == 'staff') {
      this.apiService
        .getData(`staffs/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedStaffs = result.Items;
            this.suggestedStaffs = this.suggestedStaffs.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });
    } else if (type == 'company') {
      this.apiService
        .getData(`factoringCompanies/suggestion/${value}`)
        .subscribe((result) => {
          this.suggestedCompany = result.Items;
            this.suggestedCompany = this.suggestedCompany.map(function (v) {
              v.name = v.companyName;
              return v;
            })
        });
    } else if (type == 'driver') {
      this.apiService
        .getData(`drivers/get/suggestions/${value}`)
        .subscribe((result) => {
          this.suggestedDriver = result.Items;
            this.suggestedDriver = this.suggestedDriver.map(function (v) {
              v.name = v.firstName + ' ' + v.lastName;
              return v;
            })
        });
    }
  }

  setSearchValues(searchID, searchValue, type) {
    if(type == 'customer') {
      this.filterVal.customerID = searchID;
      this.filterVal.customerName = searchValue;
      this.suggestedCustomers = [];

    } else if(type == 'broker') {
      this.filterVal.brokerID = searchID;
      this.filterVal.brokerName = searchValue;
      this.suggestedBrokers = [];

    } else if(type == 'vendor') {
      this.filterVal.vendorID = searchID;
      this.filterVal.vendorName = searchValue;
      this.suggestedVendors = [];

    } else if(type == 'carrier') {
      this.filterVal.carrierID = searchID;
      this.filterVal.carrierName = searchValue;
      this.suggestedCarriers = [];

    } else if(type == 'operator') {
      this.filterVal.operatorID = searchID;
      this.filterVal.operatorName = searchValue;
      this.suggestedOperators = [];

    } else if(type == 'shipper') {
      this.filterVal.shipperID = searchID;
      this.filterVal.shipperName = searchValue;
      this.suggestedShipper = [];

    } else if(type == 'consignee') {
      this.filterVal.consigneeID = searchID;
      this.filterVal.consigneeName = searchValue;
      this.suggestedConsignees = [];

    } else if(type == 'staff') {
      this.filterVal.staffID = searchID;
      this.filterVal.staffName = searchValue;
      this.suggestedStaffs = [];

    } else if(type == 'company') {
      this.filterVal.companyID = searchID;
      this.filterVal.fcompanyName = searchValue;
      this.suggestedCompany = [];

    } else if(type == 'driver') {
      this.filterVal.driverID = searchID;
      this.filterVal.driverName = searchValue;
      this.suggestedDriver = [];
    }
  }

  async searchFilter(type) {
    if(type == 'customer') {
      if(this.filterVal.customerID != '' || this.filterVal.customerName != '') {
        this.customers = [];
        this.activeDiv = 'customerTable';
        this.fetchCustomersCount();
        this.initDataTable();
      } else {
        return false
      }

    } else if(type == 'broker') {
      if(this.filterVal.brokerID != '' || this.filterVal.brokerName != '') {
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.fetchBrokersCount();
        this.initDataTableBroker();
      } else {
        return false
      }

    } else if(type == 'vendor') {
      if(this.filterVal.vendorID != '' || this.filterVal.vendorName != '') {
        this.vendors = [];
        this.activeDiv = 'vendorTable';
        this.fetchVendorsCount();
        this.initDataTableVendor();
      } else {
        return false
      }

    } else if(type == 'carrier') {
      if(this.filterVal.carrierID != '' || this.filterVal.carrierName != '') {
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        this.fetchCarriersCount();
        this.initDataTableCarrier();
      } else {
        return false
      }

    } else if(type == 'operator') {
      if(this.filterVal.operatorID != '' || this.filterVal.operatorName != '') {
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.fetchOwnerOperatorsCount();
        this.initDataTableOperator();
      } else {
        return false
      }

    } else if(type == 'shipper') {
      if(this.filterVal.shipperID != '' || this.filterVal.shipperName != '') {
        this.shippers = [];
        this.activeDiv = 'shipperTable';
        this.fetchShippersCount();
        this.initDataTableShipper();
      } else {
        return false
      }

    } else if(type == 'consignee') {
      if(this.filterVal.consigneeID != '' || this.filterVal.consigneeName != '') {
        this.receivers = [];
        this.activeDiv = 'consigneeTable';
        this.fetchConsigneeCount();
        this.initDataTableConsignee();
      } else {
        return false
      }

    } else if(type == 'staff') {
      if(this.filterVal.staffID != '' || this.filterVal.staffName != '') {
        this.staffs = [];
        this.activeDiv = 'staffTable';
        this.fetchStaffsCount();
        this.initDataTableStaff();
      } else {
        return false
      }

    } else if(type == 'company') {
      if(this.filterVal.companyID != '' || this.filterVal.fcompanyName != '') {
        this.fcCompanies = [];
        this.activeDiv = 'companyTable';
        this.fetchFcCompaniesCount()
        this.initDataTableCompany();
      } else {
        return false
      }

    } else if(type == 'driver') {
      if(this.filterVal.driverID != '' || this.filterVal.driverName != '') {
        this.drivers = [];
        this.activeDiv = 'driverTable';
        this.fetchDriversCount();
        this.initDataTableDriver();
      } else {
        return false
      }

    }
  }

  async resetFilter(type) {
    if(type == 'customer') {
      if(this.filterVal.customerID != '' || this.filterVal.customerName != '') {
        this.customers = [];
        this.activeDiv = 'customerTable';
        this.filterVal.customerID = '';
        this.filterVal.customerName = '';
        this.suggestedCustomers = [];
        this.fetchCustomersCount();
        this.initDataTable();
        this.customerDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'broker') {
      if(this.filterVal.brokerID != '' || this.filterVal.brokerName != '') {
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.filterVal.brokerID = '';
        this.filterVal.brokerName = '';
        this.suggestedBrokers = [];
        this.fetchBrokersCount();
        this.initDataTableBroker();
        this.brokerDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'vendor') {
      if(this.filterVal.vendorID != '' || this.filterVal.vendorName != '') {
        this.vendors = [];
        this.activeDiv = 'vendorTable';
        this.filterVal.vendorID = '';
        this.filterVal.vendorName = '';
        this.suggestedVendors = [];
        this.fetchVendorsCount();
        this.initDataTableVendor();
        this.vendorDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'carrier') {
      if(this.filterVal.carrierID != '' || this.filterVal.carrierName != '') {
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        this.filterVal.carrierID = '';
        this.filterVal.carrierName = '';
        this.suggestedCarriers = [];
        this.fetchCarriersCount();
        this.initDataTableCarrier();
        this.carrierDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'operator') {
      if(this.filterVal.operatorID != '' || this.filterVal.operatorName != '') {
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.filterVal.operatorID = '';
        this.filterVal.operatorName = '';
        this.suggestedOperators = [];
        this.fetchOwnerOperatorsCount();
        this.initDataTableOperator();
        this.ownerOperatorDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'shipper') {
      if(this.filterVal.shipperID != '' || this.filterVal.shipperName != '') {
        this.shippers = [];
        this.activeDiv = 'shipperTable';
        this.filterVal.shipperID = '';
        this.filterVal.shipperName = '';
        this.suggestedShipper = [];
        this.fetchShippersCount();
        this.initDataTableShipper();
        this.shipperDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'consignee') {
      if(this.filterVal.consigneeID != '' || this.filterVal.consigneeName != '') {
        this.receivers = [];
        this.activeDiv = 'consigneeTable';
        this.filterVal.consigneeID = '';
        this.filterVal.consigneeName = '';
        this.suggestedConsignees = [];
        this.fetchConsigneeCount();
        this.initDataTableConsignee();
        this.consigneeDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'staff') {
      if(this.filterVal.staffID != '' || this.filterVal.staffName != '') {
        this.receivers = [];
        this.activeDiv = 'staffTable';
        this.filterVal.staffID = '';
        this.filterVal.staffName = '';
        this.suggestedStaffs = [];
        this.fetchStaffsCount();
        this.initDataTableStaff();
        this.staffDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'company') {
      if(this.filterVal.companyID != '' || this.filterVal.fcompanyName != '') {
        this.fcCompanies = [];
        this.activeDiv = 'companyTable';
        this.filterVal.companyID = '';
        this.filterVal.fcompanyName = '';
        this.suggestedCompany = [];
        this.fetchFcCompaniesCount();
        this.initDataTableCompany();
        this.companyDraw = 0;
        this.getStartandEndVal(type);
      } else {
        return false
      }

    } else if(type == 'driver') {
      if(this.filterVal.driverID != '' || this.filterVal.driverName != '') {
        this.drivers = [];
        this.activeDiv = 'driverTable';
        this.filterVal.driverID = '';
        this.filterVal.driverName = '';
        this.suggestedDriver = [];
        this.fetchDriversCount();
        this.initDataTableDriver();
        this.driverDraw = 0;
        this.getStartandEndVal(type);
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
      this.brokerData.address[index].cityID = '';
      this.brokerData.address[index].cityName = '';
      this.brokerData.address[index].countryID = '';
      this.brokerData.address[index].countryName = '';
      this.brokerData.address[index].stateID = '';
      this.brokerData.address[index].stateName = '';
      this.brokerData.address[index].userLocation = '';
      this.brokerData.address[index].zipCode = '';

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
                this.throwErrors();
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
      this.customerDraw += 1;
      this.initDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'driver') {
      this.driverDraw += 1;
      this.initDataTableDriver();
      this.getStartandEndVal(type);

    } else if(type == 'broker') {
      this.brokerDraw += 1;
      this.initDataTableBroker();
      this.getStartandEndVal(type);

    } else if(type == 'vendor') {
      this.vendorDraw += 1;
      this.initDataTableVendor();
      this.getStartandEndVal(type);

    } else if(type == 'carrier') {
      this.carrierDraw += 1;
      this.initDataTableCarrier();
      this.getStartandEndVal(type);

    } else if(type == 'operator') {
      this.ownerOperatorDraw += 1;
      this.initDataTableOperator();
      this.getStartandEndVal(type);

    } else if(type == 'shipper') {
      this.shipperDraw += 1;
      this.initDataTableShipper();
      this.getStartandEndVal(type);

    } else if(type == 'consignee') {
      this.consigneeDraw += 1;
      this.initDataTableConsignee();
      this.getStartandEndVal(type);

    } else if(type == 'staff') {
      this.staffDraw += 1;
      this.initDataTableStaff();
      this.getStartandEndVal(type);

    } else if(type == 'company') {
      this.companyDraw += 1;
      this.initDataTableCompany();
      this.getStartandEndVal(type);
    }
  }

  // prev button func
  prevResults(type) {
    if(type == 'customer') {
      this.customerDraw -= 1;
      this.lastEvaluatedKeyCustomer = this.customerPrevEvauatedKeys[this.customerDraw];
      this.initDataTable();
      this.getStartandEndVal(type);

    } else if(type == 'driver') {
      this.driverDraw -= 1;
      this.lastEvaluatedKeyDriver = this.driverPrevEvauatedKeys[this.driverDraw];
      this.initDataTableDriver();
      this.getStartandEndVal(type);

    } else if(type == 'broker') {
      this.brokerDraw -= 1;
      this.lastEvaluatedKeyBroker = this.brokerPrevEvauatedKeys[this.brokerDraw];
      this.initDataTableBroker();
      this.getStartandEndVal(type);

    } else if(type == 'vendor') {
      this.vendorDraw -= 1;
      this.lastEvaluatedKeyVendor = this.vendorPrevEvauatedKeys[this.vendorDraw];
      this.initDataTableVendor();
      this.getStartandEndVal(type);

    } else if(type == 'carrier') {
      this.carrierDraw -= 1;
      this.lastEvaluatedKeyCarrier = this.carrierPrevEvauatedKeys[this.carrierDraw];
      this.initDataTableCarrier();
      this.getStartandEndVal(type);

    } else if(type == 'operator') {
      this.ownerOperatorDraw -= 1;
      this.lastEvaluatedKeyOperator = this.ownerOperatorPrevEvauatedKeys[this.ownerOperatorDraw];
      this.initDataTableOperator();
      this.getStartandEndVal(type);

    } else if(type == 'shipper') {
      this.shipperDraw -= 1;
      this.lastEvaluatedKeyShipper = this.shipperPrevEvauatedKeys[this.shipperDraw];
      this.initDataTableShipper();
      this.getStartandEndVal(type);

    } else if(type == 'consignee') {
      this.consigneeDraw -= 1;
      this.lastEvaluatedKeyConsignee = this.consigneePrevEvauatedKeys[this.consigneeDraw];
      this.initDataTableConsignee();
      this.getStartandEndVal(type);

    } else if(type == 'staff') {
      this.staffDraw -= 1;
      this.lastEvaluatedKeyStaff = this.staffPrevEvauatedKeys[this.staffDraw];
      this.initDataTableStaff();
      this.getStartandEndVal(type);

    } else if(type == 'company') {
      this.companyDraw -= 1;
      this.lastEvaluatedKeyCompany = this.companyPrevEvauatedKeys[this.companyDraw];
      this.initDataTableCompany();
      this.getStartandEndVal(type);
    }
  }

  getStartandEndVal(type) {
    if(type == 'customer') {
      this.custtStartPoint = this.customerDraw*this.pageLength+1;
      this.custtEndPoint = this.custtStartPoint+this.pageLength-1;

    } else if(type == 'driver') {
      this.driverStartPoint = this.driverDraw*this.pageLength+1;
      this.driverEndPoint = this.driverStartPoint+this.pageLength-1;

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
}

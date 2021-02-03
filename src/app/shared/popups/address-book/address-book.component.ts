import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HereMapService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ListService } from '../../../services';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { QueryList, ViewChildren } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChildren(DataTableDirective)
  dtElement: QueryList<DataTableDirective>;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptionsBroker: any = {};
  dtTriggerBroker: Subject<any> = new Subject();
  dtOptionsVendor: any = {};
  dtTriggerVendor: Subject<any> = new Subject();
  dtOptionsCarrier: any = {};
  dtTriggerCarrier: Subject<any> = new Subject();
  dtOptionsOperator: any = {};
  dtTriggerOperator: Subject<any> = new Subject();
  dtOptionsShipper: any = {};
  dtTriggerShipper: Subject<any> = new Subject();
  dtOptionsConsignee: any = {};
  dtTriggerConsignee: Subject<any> = new Subject();
  dtOptionsStaff: any = {};
  dtTriggerStaff: Subject<any> = new Subject();
  dtOptionsCompany: any = {};
  dtTriggerCompany: Subject<any> = new Subject();

  dtOptionsDriver: any = {};
  dtTriggerDriver: Subject<any> = new Subject();
  
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
  // dtOptions: DataTables.Settings = {};
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    }],
    fcDetails: {}
  };

   // Staff Object
   staffData = {
    entityType: 'staff',
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
      }
    }],
    userAccount: {},
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
  totalRecords = 20;
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

  constructor(
            private apiService: ApiService,
            private toastr: ToastrService,
            private modalService: NgbModal,
            private HereMap: HereMapService,
            // private listService: ListService
            )
  { }

  ngOnInit() {
    this.fetchCountries();
    this.fetchCustomers();
    this.fetchBrokers();
    this.fetchVendors();
    this.fetchCarriers();
    this.fetchOwnerOperators();
    this.fetchShippers();
    this.fetchConsignee();
    this.fetchStaffs();
    this.fetchFcCompanies();
    this.fetchDrivers();

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

  remove(data, i) {
    data.address.splice(i, 1);
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
          $('#addCustomerModal').modal('hide');
          this.showMainModal();
          this.customers = [];
          this.fetchCustomers();
          this.activeDiv = 'customerTable';
          this.rerender();
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
      delete element['addressID'];
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
    // this.removeUserLocation(this.customerData.address)

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
        if(res.Items[0] != undefined) {
          this.response = res.Items[0];
          if(this.response.profileImg != '' && this.response.profileImg != undefined) {
            this.imageText = "Update Picture";
            this.profilePath = `${this.Asseturl}/${this.response.carrierID}/${this.response.profileImg}`;
          }
          this.customerData['userType'] = 'Customer';
          this.customerData['userTypeTitle'] = 'CU';
        }

        this.hasSuccess = true;
        $('#addCustomerModal').modal('hide');
        this.showMainModal();
        this.customers = [];
        this.activeDiv = 'customerTable';
        this.rerender();
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
    // this.removeUserLocation(this.brokerData.address);

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
        this.fetchBrokers();
        this.showMainModal();
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.rerender();
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
    // this.removeUserLocation(this.ownerData.address);

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
        this.fetchOwnerOperators();
        this.showMainModal();
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.rerender();
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
        $('#addOwnerOperatorModal').modal('hide');
        this.showMainModal();
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        this.rerender();
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
    // this.removeUserLocation(this.brokerData.address);

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
        $('#addBrokerModal').modal('hide');
        this.showMainModal();
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        this.rerender();
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
    // this.removeUserLocation(this.vendorData.address);

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
          this.fetchVendors();
          this.showMainModal();
          this.vendors = [];
          this.activeDiv = 'vendorTable';
          this.rerender();
          // this.listService.fetchVendors();
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
    // this.removeUserLocation(this.vendorData.address)

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
        $('#addVendorModal').modal('hide');
        this.showMainModal();
        this.vendors = [];
        this.activeDiv = 'vendorTable';
        this.rerender();
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
    // this.removeUserLocation(this.carrierData.address);

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
          this.fetchCarriers();
          this.showMainModal();
          this.carriers = [];
          this.activeDiv = 'carrierTable';
          this.rerender();
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
    // this.removeUserLocation(this.carrierData.address);

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
        $('#addCarrierModal').modal('hide');
        this.showMainModal();
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        this.rerender();
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
      const element = this.shipperData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        
        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
      }
    }

    // this.removeUserLocation(this.shipperData.address);

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
          this.fetchShippers();
          this.showMainModal();
          this.shippers = [];
          this.activeDiv = 'shipperTable';
          this.rerender();
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
      const element = this.shipperData.address[i];
      if(element.countryID != '' && element.stateID != '' && element.cityID != '') {
        let fullAddress = `${element.address1} ${element.address2} ${this.citiesObject[element.cityID]}
        ${this.statesObject[element.stateID]} ${this.countriesObject[element.countryID]}`;
        let result = await this.HereMap.geoCode(fullAddress);
        
        result = result.items[0];
        element.geoCords.lat = result.position.lat;
        element.geoCords.lng = result.position.lng;
        
      }
    }
    // this.removeUserLocation(this.shipperData.address)

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
        $('#addShipperModal').modal('hide');
        this.shippers = [];
        this.showMainModal();
        this.activeDiv = 'shipperTable';
        this.rerender();
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
    // this.removeUserLocation(this.consigneeData.address);

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
          this.showMainModal();
          this.receivers = [];
          this.activeDiv = 'consigneeTable';
          this.fetchConsignee();
          this.rerender();
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
    // this.removeUserLocation(this.consigneeData.address)

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
        $('#addConsigneeModal').modal('hide');
        this.receivers = [];
        this.showMainModal();
        this.activeDiv = 'consigneeTable';
        this.rerender();
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
    // this.removeUserLocation(this.fcCompanyData.address);

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
          this.fetchFcCompanies();
          this.showMainModal();
          this.brokers = [];
          this.activeDiv = 'brokerTable';
          this.rerender();
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
    // this.removeUserLocation(this.fcCompanyData.address)

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
        $('#addFCModal').modal('hide');
        this.showMainModal();
        this.fcCompanies = [];
        this.activeDiv = 'companyTable';
        this.rerender();
        this.toastr.success('Company updated successfully');
      },
    });
  }

  // Add addStaff
  async addStaff() {
    this.hasError = false;
    this.hasSuccess = false;

    this.hideErrors();

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
    // this.removeUserLocation(this.staffData.address);

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.staffData));
    
    this.apiService.postData('staffs', formData, true).
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
          $('#addStaffModal').modal('hide');
          this.staffs = [];
          this.fetchStaffs();
          this.showMainModal();
          this.activeDiv = 'staffTable';
          this.rerender();
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
    // this.removeUserLocation(this.staffData.address)

    // create form data instance
    const formData = new FormData();

    //append photos if any
    for(let i = 0; i < this.uploadedPhotos.length; i++){
      formData.append('uploadedPhotos', this.uploadedPhotos[i]);
    }

    //append other fields
    formData.append('data', JSON.stringify(this.staffData));

    this.apiService.putData('staffs', formData, true).subscribe({
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
        $('#addStaffModal').modal('hide');
        this.staffs = [];
        this.showMainModal();
        this.activeDiv = 'staffTable';
        this.rerender();
        this.toastr.success('Staff updated successfully');
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
    // this.vehicleForm.showErrors(this.errors);
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
    // return this.apiService.getData('countries');
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
  
  fetchCustomers() {
    // return this.apiService.getData('customers');
    this.apiService.getData('customers')
      .subscribe((result: any) => {
        this.totalRecords = result.Count;
      });
  }

  fetchOwnerOperators() {
    // return this.apiService.getData('ownerOperators');
    this.apiService.getData('ownerOperators')
      .subscribe((result: any) => {
        this.totalRecordsOperator = result.Count;
      });
  }

  fetchDrivers() {
    // return this.apiService.getData('drivers');
    this.apiService.getData('drivers')
      .subscribe((result: any) => {
        this.totalRecordsDriver = result.Count;
      });
  }
  
  fetchBrokers() {
    // return this.apiService.getData('brokers');
    this.apiService.getData('brokers')
      .subscribe((result: any) => {
        this.totalRecordsBroker = result.Count;
    });
  }

  fetchVendors() {
    // return this.apiService.getData('vendors');
    this.apiService.getData('vendors')
      .subscribe((result: any) => {
        this.totalRecordsVendor = result.Count;
    });
  }

  fetchCarriers() {
    // return this.apiService.getData('externalCarriers');
    this.apiService.getData('externalCarriers')
      .subscribe((result: any) => {
        this.totalRecordsCarrier = result.Count;
    });
  }
  
  fetchShippers() {
    // return this.apiService.getData('shippers');
    this.apiService.getData('shippers')
      .subscribe((result: any) => {
        this.totalRecordsShipper = result.Count;
    });
  }
  
  fetchConsignee() {
    // return this.apiService.getData('receivers');
    this.apiService.getData('receivers')
      .subscribe((result: any) => {
        this.totalRecordsConsignee = result.Count;
    });
  }

  fetchStaffs() {
    // return this.apiService.getData('staffs');
    this.apiService.getData('staffs')
      .subscribe((result: any) => {
        this.totalRecordsStaff = result.Count;
    });
  }

  fetchFcCompanies() {
    // return this.apiService.getData('factoringCompanies');
    this.apiService.getData('factoringCompanies')
      .subscribe((result: any) => {
        this.totalRecordsCompany = result.Count;
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
        curr.rerender();
        curr.fetchCustomers();
        curr.toastr.success('Customer deleted successfully');
        
        // this.customers = this.customers.filter(u => u.customerID !== item.customerID);
      });
    }
  }

  deactivateDriver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`drivers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.drivers = [];
        this.rerender();
        this.fetchDrivers();
        this.toastr.success('Driver deleted successfully');
        // this.drivers = this.drivers.filter(u => u.driverID !== item.driverID);
      });
    }
  }

  deactivateBroker(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`brokers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.brokers = [];
        this.rerender();
        this.fetchBrokers();
        this.toastr.success('Broker deleted successfully');
        // this.brokers = this.brokers.filter(u => u.brokerID !== item.brokerID);
      });
    }
  }

  deactivateVendor(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`vendors/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.vendors = [];
        this.rerender();
        this.fetchVendors();
        this.toastr.success('Vendor deleted successfully');
        // this.vendors = this.vendors.filter(u => u.vendorID !== item.vendorID);
      });
    }
  }

  deactivateShipper(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`shippers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.shippers = [];
        this.rerender();
        this.fetchShippers();
        this.toastr.success('Shipper deleted successfully');
        // this.shippers = this.shippers.filter(u => u.shipperID !== item.shipperID);
      });
    }
  }
  deactivateReceiver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`receivers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.receivers = [];
        this.rerender();
        this.fetchConsignee();
        this.toastr.success('Consignee deleted successfully');
        // this.receivers = this.receivers.filter(u => u.receiverID !== item.receiverID);
      });
    }
  }

  deactivateStaff(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`staffs/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.staffs = [];
        this.rerender();
        this.fetchStaffs();
        this.toastr.success('Staff deleted successfully');
        // this.staffs = this.staffs.filter(u => u.staffID !== item.staffID);
      });
    }
  }

  deactivateCompany(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`factoringCompanies/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.fcCompanies = [];
        this.rerender();
        this.fetchFcCompanies();
        this.toastr.success('Company deleted successfully');
        // this.fcCompanies = this.fcCompanies.filter(u => u.factoringCompanyID !== item.factoringCompanyID);
      });
    }
  }

  deactivateOperator(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`ownerOperators/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.ownerOperatorss = [];
        this.rerender();
        this.fetchOwnerOperators();
        this.toastr.success('Operator deleted successfully');
        // this.toastr.success('Owner operator deleted successfully');
      });
    }
  }

  deactivateCarrier(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`externalCarriers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.carriers = [];
        this.rerender();
        this.fetchCarriers();
        this.toastr.success('Carrier deleted successfully');
        // this.brokers = this.brokers.filter(u => u.brokerID !== item.brokerID);
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
    if(type == 'driver') {
      this.showDriverModal = true;
    } else {
      this.updateButton = false;
    }
    this.custCurrentTab = 1;
    this.clearModalData()
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
      }],
      fcDetails: {}
    };

    // Staff Object
    this.staffData = {
      entityType: 'staff',
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
        }
      }],
      userAccount: {},
    };
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
        console.log('this.countriesObject')
        console.log(this.countriesObject)
      });
  }

  fetchAllCitiesIDs() {
    this.apiService.getData('cities/get/list')
      .subscribe((result: any) => {
        this.citiesObject = result;
      });
  }

  //dtb
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtTriggerBroker.next();
    this.dtTriggerVendor.next();
    this.dtTriggerCarrier.next();
    this.dtTriggerOperator.next();
    this.dtTriggerShipper.next();
    this.dtTriggerConsignee.next();
    this.dtTriggerStaff.next();
    this.dtTriggerCompany.next();
    this.dtTriggerDriver.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if(this.activeDiv == 'customerTable') { 
      this.dtTrigger.unsubscribe();
    } else if(this.activeDiv == 'brokerTable') { 
      this.dtTriggerBroker.unsubscribe();
    } else if(this.activeDiv == 'vendorTable') { 
      this.dtTriggerVendor.unsubscribe();
    } else if(this.activeDiv == 'carrierTable') { 
      this.dtTriggerCarrier.unsubscribe();
    } else if(this.activeDiv == 'operatorTable') { 
      this.dtTriggerOperator.unsubscribe();
    } else if(this.activeDiv == 'shipperTable') { 
      this.dtTriggerShipper.unsubscribe();
    } else if(this.activeDiv == 'consigneeTable') { 
      this.dtTriggerConsignee.unsubscribe();
    } else if(this.activeDiv == 'staffTable') { 
      this.dtTriggerStaff.unsubscribe();
    } else if(this.activeDiv == 'companyTable') { 
      this.dtTriggerCompany.unsubscribe();
    } else if(this.activeDiv == 'driverTable') { 
      this.dtTriggerDriver.unsubscribe();
    }
  }

  rerender() {
    let curr = this;
    this.dtElement.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        let tableId = dtInstance.table().node().id;
        if(this.activeDiv == tableId) { 
          if(tableId == 'customerTable') { 
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptions.pageLength = this.totalRecords;
            } else {
              this.dtOptions.pageLength = this.pageLength;
            }
            curr.dtTrigger.next();

          } else if(tableId == 'brokerTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsBroker.pageLength = this.totalRecordsBroker;
            } else {
              this.dtOptionsBroker.pageLength = this.pageLength;
            }
            curr.dtTriggerBroker.next();

          } else if(tableId == 'vendorTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsVendor.pageLength = this.totalRecordsVendor;
            } else {
              this.dtOptionsVendor.pageLength = this.pageLength;
            }
            curr.dtTriggerVendor.next();

          } else if(tableId == 'carrierTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsCarrier.pageLength = this.totalRecordsCarrier;
            } else {
              this.dtOptionsCarrier.pageLength = this.pageLength;
            }
            curr.dtTriggerCarrier.next();

          } else if(tableId == 'operatorTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsOperator.pageLength = this.totalRecordsOperator;
            } else {
              this.dtOptionsOperator.pageLength = this.pageLength;
            }
            curr.dtTriggerOperator.next();

          } else if(tableId == 'shipperTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsShipper.pageLength = this.totalRecordsShipper;
            } else {
              this.dtOptionsShipper.pageLength = this.pageLength;
            }
            curr.dtTriggerShipper.next();

          } else if(tableId == 'consigneeTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsConsignee.pageLength = this.totalRecordsConsignee;
            } else {
              this.dtOptionsConsignee.pageLength = this.pageLength;
            }
            curr.dtTriggerConsignee.next();

          } else if(tableId == 'staffTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsStaff.pageLength = this.totalRecordsStaff;
            } else {
              this.dtOptionsStaff.pageLength = this.pageLength;
            }
            curr.dtTriggerStaff.next();

          } else if(tableId == 'companyTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsCompany.pageLength = this.totalRecordsCompany;
            } else {
              this.dtOptionsCompany.pageLength = this.pageLength;
            }
            curr.dtTriggerCompany.next();

          } else if(tableId == 'driverTable') {
            dtInstance.destroy();
            if (status === 'reset') {
              this.dtOptionsDriver.pageLength = this.totalRecordsDriver;
            } else {
              this.dtOptionsDriver.pageLength = this.pageLength;
            }
            curr.dtTriggerDriver.next();
          }
        }
      });
    });
  }

  initDataTable() {
    let current = this;
    this.dtOptions = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('customers/fetch/records?customer='+this.filterVal.customerID+'&lastKey='+this.lastEvaluatedKeyCustomer, dataTablesParameters).subscribe(resp => {
            current.customers = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyCustomer = resp['LastEvaluatedKey'].customerID;
              
            } else {
              this.lastEvaluatedKeyCustomer = '';
            }

            callback({
              recordsTotal: current.totalRecords,
              recordsFiltered: current.totalRecords,
              data: []
            });
          });
      }
    };
  }

  initDataTableBroker() {
    let current = this;
    this.dtOptionsBroker = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('brokers/fetch/records?brokerID='+this.filterVal.brokerID+'&lastKey='+this.lastEvaluatedKeyBroker, dataTablesParameters).subscribe(resp => {
            current.brokers = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyBroker = resp['LastEvaluatedKey'].brokerID;
              
            } else {
              this.lastEvaluatedKeyBroker = '';
            }

            callback({
              recordsTotal: current.totalRecordsBroker,
              recordsFiltered: current.totalRecordsBroker,
              data: []
            });
          });
      }
    };
  }

  initDataTableVendor() {
    let current = this;
    this.dtOptionsVendor = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('vendors/fetch/records?vendorID='+this.filterVal.vendorID+'&lastKey='+this.lastEvaluatedKeyVendor, dataTablesParameters).subscribe(resp => {
            current.vendors = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyVendor = resp['LastEvaluatedKey'].vendorID;
              
            } else {
              this.lastEvaluatedKeyVendor = '';
            }

            callback({
              recordsTotal: current.totalRecordsVendor,
              recordsFiltered: current.totalRecordsVendor,
              data: []
            });
          });
      }
    };
  }

  initDataTableCarrier() {
    let current = this;
    this.dtOptionsCarrier = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('externalCarriers/fetch/records?infoID='+this.filterVal.carrierID+'&lastKey='+this.lastEvaluatedKeyCarrier, dataTablesParameters).subscribe(resp => {
            current.carriers = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyCarrier = resp['LastEvaluatedKey'].infoID;
              
            } else {
              this.lastEvaluatedKeyCarrier = '';
            }

            callback({
              recordsTotal: current.totalRecordsCarrier,
              recordsFiltered: current.totalRecordsCarrier,
              data: []
            });
          });
      }
    };
  }

  initDataTableOperator() {
    let current = this;
    this.dtOptionsOperator = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('ownerOperators/fetch/records?operatorID='+this.filterVal.operatorID+'&lastKey='+this.lastEvaluatedKeyOperator, dataTablesParameters).subscribe(resp => {
            current.ownerOperatorss = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyOperator = resp['LastEvaluatedKey'].operatorID;
              
            } else {
              this.lastEvaluatedKeyOperator = '';
            }

            callback({
              recordsTotal: current.totalRecordsOperator,
              recordsFiltered: current.totalRecordsOperator,
              data: []
            });
          });
      }
    };
  }

  initDataTableShipper() {
    let current = this;
    this.dtOptionsShipper = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('shippers/fetch/records?shipperID='+this.filterVal.shipperID+'&lastKey='+this.lastEvaluatedKeyShipper, dataTablesParameters).subscribe(resp => {
            current.shippers = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyShipper = resp['LastEvaluatedKey'].shipperID;
              
            } else {
              this.lastEvaluatedKeyShipper = '';
            }

            callback({
              recordsTotal: current.totalRecordsShipper,
              recordsFiltered: current.totalRecordsShipper,
              data: []
            });
          });
      }
    };
  }

  initDataTableConsignee() {
    let current = this;
    this.dtOptionsConsignee = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('receivers/fetch/records?consigneeID='+this.filterVal.consigneeID+'&lastKey='+this.lastEvaluatedKeyConsignee, dataTablesParameters).subscribe(resp => {
            current.receivers = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyConsignee = resp['LastEvaluatedKey'].receiverID;
              
            } else {
              this.lastEvaluatedKeyConsignee = '';
            }

            callback({
              recordsTotal: current.totalRecordsConsignee,
              recordsFiltered: current.totalRecordsConsignee,
              data: []
            });
          });
      }
    };
  }

  initDataTableStaff() {
    let current = this;
    this.dtOptionsStaff = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6,7],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('staffs/fetch/records?staffID='+this.filterVal.staffID+'&lastKey='+this.lastEvaluatedKeyStaff, dataTablesParameters).subscribe(resp => {
            current.staffs = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyStaff = resp['LastEvaluatedKey'].staffID;
              
            } else {
              this.lastEvaluatedKeyStaff = '';
            }

            callback({
              recordsTotal: current.totalRecordsStaff,
              recordsFiltered: current.totalRecordsStaff,
              data: []
            });
          });
      }
    };
  }

  initDataTableCompany() {
    let current = this;
    this.dtOptionsCompany = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5,6],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('factoringCompanies/fetch/records?companyID='+this.filterVal.companyID+'&lastKey='+this.lastEvaluatedKeyCompany, dataTablesParameters).subscribe(resp => {
            current.fcCompanies = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyCompany = resp['LastEvaluatedKey'].factoringCompanyID;
              
            } else {
              this.lastEvaluatedKeyCompany = '';
            }

            callback({
              recordsTotal: current.totalRecordsCompany,
              recordsFiltered: current.totalRecordsCompany,
              data: []
            });
          });
      }
    };
  }

  initDataTableDriver() {
    let current = this;
    this.dtOptionsDriver = { // All list options
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [ //sortable false
        {"targets": [0,1,2,3,4,5],"orderable": false},
      ],
      dom: 'lrtip',
      language: {
        "emptyTable": "No records found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        current.apiService.getDatatablePostData('drivers/fetch-records?driverID='+this.filterVal.driverID+'&dutyStatus=&lastKey='+this.lastEvaluatedKeyCompany, dataTablesParameters).subscribe(resp => {
            current.drivers = resp['Items'];
            if (resp['LastEvaluatedKey'] !== undefined) {
              this.lastEvaluatedKeyCompany = resp['LastEvaluatedKey'].driverID;
              
            } else {
              this.lastEvaluatedKeyCompany = '';
            }

            callback({
              recordsTotal: current.totalRecordsDriver,
              recordsFiltered: current.totalRecordsDriver,
              data: []
            });
          });
      }
    };
  }

  getSuggestions(value, type) {
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
            this.filterVal.brokerID = '';
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
              v.name = v.firstName + ' ' + v.lastName;
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
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'broker') {
      if(this.filterVal.brokerID != '' || this.filterVal.brokerName != '') {
        this.brokers = [];
        this.activeDiv = 'brokerTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'vendor') {
      if(this.filterVal.vendorID != '' || this.filterVal.vendorName != '') {
        this.vendors = [];
        this.activeDiv = 'vendorTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'carrier') {
      if(this.filterVal.carrierID != '' || this.filterVal.carrierName != '') {
        this.carriers = [];
        this.activeDiv = 'carrierTable';
        await this.rerender();
      } else {
        return false
      }
      
    } else if(type == 'operator') {
      if(this.filterVal.operatorID != '' || this.filterVal.operatorName != '') {
        this.ownerOperatorss = [];
        this.activeDiv = 'operatorTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'shipper') {
      if(this.filterVal.shipperID != '' || this.filterVal.shipperName != '') {
        this.shippers = [];
        this.activeDiv = 'shipperTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'consignee') {
      if(this.filterVal.consigneeID != '' || this.filterVal.consigneeName != '') {
        this.receivers = [];
        this.activeDiv = 'consigneeTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'staff') {
      if(this.filterVal.staffID != '' || this.filterVal.staffName != '') {
        this.staffs = [];
        this.activeDiv = 'staffTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'company') {
      if(this.filterVal.companyID != '' || this.filterVal.fcompanyName != '') {
        this.fcCompanies = [];
        this.activeDiv = 'companyTable';
        await this.rerender();
      } else {
        return false
      }

    } else if(type == 'driver') {
      if(this.filterVal.driverID != '' || this.filterVal.driverName != '') {
        this.drivers = [];
        this.activeDiv = 'driverTable';
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();

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
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();
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
        await this.rerender();
      } else {
        return false
      }
    }
  }
}

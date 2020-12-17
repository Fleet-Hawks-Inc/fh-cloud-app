import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HereMapService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  customers: any;
  drivers: any;
  brokers: any;
  vendors: any;
  carriers: any;
  shippers: any;
  receivers: any;
  staffs: any;
  fcCompanies: any;

  allData: any;

  form;
  countries;
  states;
  cities;
  public customerProfileSrc: any = 'assets/img/driver/driver.png';
  userLocation;
  manualAddress: boolean;
  manualAddress1: boolean;
  dtOptions: DataTables.Settings = {};
  wsib: false;
  addresses = [];
  // Customer Object
  customerData = {
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
    additionalContact: {}
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
  constructor(
            private apiService: ApiService,
            private toastr: ToastrService,
            private modalService: NgbModal,
            private HereMap: HereMapService)
  { }

  ngOnInit() {
    forkJoin([
      this.fetchCustomers(),
      this.fetchDrivers(),
      this.fetchBrokers(),
      this.fetchVendors(),
      this.fetchCarriers(),
      this.fetchShippers(),
      this.fetchConsignee(),
      this.fetchStaffs(),
      this.fetchFcCompanies(),
      this.fetchCountries(),
      this.fetchAddress(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.initDataTable();
        },
        error: () => { },
        next: ([
          customers,
          drivers,
          brokers,
          vendors,
          carriers,
          shippers,
          receivers,
          staffs,
          fcCompanies,
          countries,
          addresses
        ]: any) => {
          this.customers = customers.Items;
          this.drivers = drivers.Items;
          this.brokers = brokers.Items,
          this.vendors = vendors.Items,
          this.carriers = carriers.Items,
          this.shippers = shippers.Items,
          this.receivers = receivers.Items,
          this.staffs = staffs.Items,
          this.fcCompanies = fcCompanies.Items,

          this.allData = [...this.customers, ...this.drivers, ...this.brokers, ...this.vendors,
                            ...this.carriers, ...this.shippers, ...this.receivers, ...this.staffs, ...this.fcCompanies];                           

          this.countries = countries.Items;
          this.addresses = addresses;
        }
      });
    this.searchLocation();
    
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
    $('.modal').modal('hide');
    this.userDetailTitle = data.firstName;
    const modalRef = this.modalService.open(targetModal);
    this.userDetailData = data;
    console.log("this.userDetailData", this.userDetailData);
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
  addCustomer() {
    this.hideErrors();
    this.removeUserLocation(this.customerData.address)
    this.apiService.postData('customers', this.customerData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addCustomerModal').modal('hide');
          this.toastr.success('Customer Added Successfully');
        }
      });
  }

  async checkUserExist(phone: number, email: string){
    this.addresses.forEach(element => {
      if( element.email === email || element.phone === phone) {
        console.log('exists');
      } else {
        console.log('not exists');
      }
    });
  }

  // Add Broker
  async addBroker() {
    this.hideErrors();
    this.removeUserLocation(this.brokerData.address);
    // let result = await this.checkUserExist(this.brokerData['workPhone'], this.brokerData['workEmail'])
    this.apiService.postData('brokers', this.brokerData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addBrokerModal').modal('hide');
          this.toastr.success('Customer Added Successfully');
        }
      });
  }

  // Add Vendor
  addVendor() {
    this.hideErrors();
    this.removeUserLocation(this.vendorData.address);
    this.apiService.postData('vendors', this.vendorData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          this.vendorData = {
            address: []
          };
          $('#addVendorModal').modal('hide');
          this.toastr.success('Vendor Added Successfully');
        }
      });
  }

  // Add Carrier
  addCarrier() {
    this.hideErrors();
    this.removeUserLocation(this.carrierData.address);
    this.apiService.postData('carriers', this.carrierData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addCarrierModal').modal('hide');
          this.toastr.success('Carrier Added Successfully');
        }
      });
  }

  
  // Add Shipper
  addShipper() {
    this.hideErrors();
    this.removeUserLocation(this.shipperData.address);
    this.apiService.postData('shippers', this.shipperData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addShipperModal').modal('hide');
          this.toastr.success('Shipper Added Successfully');
        }
      });
  }

  // Add Consignee
  addConsignee() {
    this.hideErrors();
    this.removeUserLocation(this.consigneeData.address);
    this.apiService.postData('receivers', this.consigneeData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addConsigneeModal').modal('hide');
          this.toastr.success('Consignee Added Successfully');
        }
      });
  }

  // Add FC Company
  addFCompany() {
    this.hideErrors();
    this.removeUserLocation(this.fcCompanyData.address);
    this.apiService.postData('factoringCompanies', this.fcCompanyData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addFCModal').modal('hide');
          this.toastr.success('Company Added Successfully');
        }
      });
  }

  // Add addStaff
  addStaff() {
    this.hideErrors();
    this.removeUserLocation(this.staffData.address);
    this.apiService.postData('staffs', this.staffData).
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addStaffModal').modal('hide');
          this.toastr.success('Staff Added Successfully');
        }
      });
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
          .remove('label')
      });
    this.errors = {};
  }

  /*
   * Get all countries from api
   */
  fetchCountries() {
    return this.apiService.getData('countries');
  }

  getStates(id) {
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }

  getCities(id) {
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
      });
  }

  uploadDriverImg(event): void {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.customerProfileSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }


  fetchAddress() {
    return this.apiService.getData('addresses');
  }
  
  fetchCustomers() {
    return this.apiService.getData('customers');
  }

  fetchDrivers() {
    return this.apiService.getData('drivers');
  }
  
  fetchBrokers() {
    return this.apiService.getData('brokers');
  }

  fetchVendors() {
    return this.apiService.getData('vendors');
  }

  fetchCarriers() {
    return this.apiService.getData('carriers');
  }
  
  fetchShippers() {
    return this.apiService.getData('shippers');
  }
  
  fetchConsignee() {
    return this.apiService.getData('receivers');
  }

  fetchStaffs() {
    return this.apiService.getData('staffs');
  }

  fetchFcCompanies() {
    return this.apiService.getData('factoringCompanies');
  }


  carrierWSIB(value) {
    if (value !== true) {
      delete this.carrierData['paymentDetails']['wsibAccountNumber'];
      delete this.carrierData['paymentDetails']['wsibExpiry'];
    }
  }

  initDataTable() {
    this.dtOptions = {
      searching: false,
      dom: 'Bfrtip', // lrtip to hide search field
      processing: true,
      
     
    };
  }

}

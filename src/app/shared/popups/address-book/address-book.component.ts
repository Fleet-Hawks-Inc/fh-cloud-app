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
  Asseturl = this.apiService.AssetUrl;
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
  public profilePath: any = 'assets/img/driver/driver.png';
  public defaultProfilePath: any = 'assets/img/driver/driver.png';
  imageText = 'Add Picture';
  userLocation;
  manualAddress: boolean;
  manualAddress1: boolean;
  dtOptions: DataTables.Settings = {};
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
      this.fetchOwnerOperators()
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
          addresses,
          operators
        ]: any) => {
          this.customers = customers.Items;
          this.drivers = drivers.Items;
          this.brokers = brokers.Items;
          this.vendors = vendors.Items;
          this.carriers = carriers.Items;
          this.shippers = shippers.Items;
          this.receivers = receivers.Items;
          this.staffs = staffs.Items;
          this.fcCompanies = fcCompanies.Items;
          this.ownerOperatorss = operators.Items;

          console.log('this.ownerOperatorss');
          console.log(this.ownerOperatorss)

          for (let i = 0; i < this.customers.length; i++) {
            const element = this.customers[i];
            element.userType = 'Customer';
            element.userTypeTitle = 'CU';
            element.imageText = "Add Picture";
            element.profilePath = 'assets/img/driver/driver.png';
            if(element.profileImg != '' && element.profileImg != undefined) {
              element.imageText = "Update Picture";
              element.profilePath = `${this.Asseturl}/${element.carrierID}/${element.profileImg}`;
            }
          }

          for (let i = 0; i < this.drivers.length; i++) {
            const element = this.drivers[i];
            
            element.userType = 'Driver';
            element.userTypeTitle = 'DR';
          }

          for (let i = 0; i < this.brokers.length; i++) {
            const element = this.brokers[i];
            
            element.userType = 'Broker';
            element.userTypeTitle = 'BR';
            element.imageText = "Add Picture";
            element.profilePath = 'assets/img/driver/driver.png';
            if(element.profileImg != '' && element.profileImg != undefined) {
              element.imageText = "Update Picture";
              element.profilePath = `${this.Asseturl}/${element.carrierID}/${element.profileImg}`;
            }
          }

          for (let i = 0; i < this.vendors.length; i++) {
            const element = this.vendors[i];
            
            element.userType = 'Vendor';
            element.userTypeTitle = 'VN';
          }

          for (let i = 0; i < this.carriers.length; i++) {
            const element = this.carriers[i];
            
            element.userType = 'Carrier';
            element.userTypeTitle = 'CR';
          }

          for (let i = 0; i < this.shippers.length; i++) {
            const element = this.shippers[i];
            
            element.userType = 'Shipper';
            element.userTypeTitle = 'SH';
          }

          for (let i = 0; i < this.receivers.length; i++) {
            const element = this.receivers[i];
            
            element.userType = 'Consignee';
            element.userTypeTitle = 'CO';
          }

          for (let i = 0; i < this.staffs.length; i++) {
            const element = this.staffs[i];
            
            element.userType = 'Staff';
            element.userTypeTitle = 'ST';
          }

          for (let i = 0; i < this.fcCompanies.length; i++) {
            const element = this.fcCompanies[i];
            
            element.userType = 'Factoring Company';
            element.userTypeTitle = 'FC';
          }

          for (let i = 0; i < this.ownerOperatorss.length; i++) {
            const element = this.ownerOperatorss[i];
            
            element.userType = 'Owner Operator';
            element.userTypeTitle = 'OP';
          }

          this.allData = [...this.customers, ...this.drivers, ...this.brokers, ...this.vendors,
                            ...this.carriers, ...this.shippers, ...this.receivers, ...this.staffs, ...this.fcCompanies, ...this.ownerOperatorss];                           
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
    // this.removeUserLocation(this.customerData.address)

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

  updateCustomer() {
   
    this.hideErrors();
    this.removeAddressFields(this.customerData);
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
        this.toastr.success('Customer updated successfully');
      },
    });
  }

  // Add Broker
  async addBroker() {
    this.hideErrors();
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

  // Add Broker
  async addOwnerOperator() {
    this.hideErrors();
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
        $('#addOwnerOperatorModal').modal('hide');
        this.toastr.success('Owner Operator Added Successfully');
      }
    });
  }

  updateOwnerOperator() {
    this.hideErrors();
    this.removeAddressFields(this.ownerData);

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
        this.response = res.Items[0];
        this.hasSuccess = true;
        $('#addOwnerOperatorModal').modal('hide');
        this.toastr.success('Owner operator updated successfully');
      },
    });
  }

  updateBroker() {
   
    this.hideErrors();
    this.removeAddressFields(this.brokerData);
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
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#addBrokerModal').modal('hide');
        this.toastr.success('Broker updated successfully');
      },
    });
  }

  // Add Vendor
  addVendor() {
    this.hideErrors();
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
        }
      });
  }

  updateVendor() {
   
    this.hideErrors();
    this.removeAddressFields(this.vendorData);
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
        this.toastr.success('Vendor updated successfully');
      },
    });
  }

  // Add Carrier
  addCarrier() {
    this.hideErrors();
    // this.removeUserLocation(this.carrierData.address);
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
              },
              error: () => { },
              next: () => { },
            });
        },
        next: (res) => {
          this.response = res;
          this.hasSuccess = true;
          $('#addShipperModal').modal('hide');
          this.showMainModal();
          this.toastr.success('Shipper Added Successfully');
        }
      });
  }

  updateShipper() {
   
    this.hideErrors();
    this.removeAddressFields(this.shipperData);
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
            },
            error: () => { },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        $('#addShipperModal').modal('hide');
        this.showMainModal();
        this.toastr.success('Shipper updated successfully');
      },
    });
  }


  // Add Consignee
  addConsignee() {
    this.hideErrors();
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
          this.toastr.success('Consignee Added Successfully');
        }
      });
  }

  updateConsignee() {
   
    this.hideErrors();
    this.removeAddressFields(this.consigneeData);
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
        this.toastr.success('Consignee updated successfully');
      },
    });
  }

  // Add FC Company
  addFCompany() {
    this.hideErrors();
    // this.removeUserLocation(this.fcCompanyData.address);
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

  updateFCompany() {
   
    this.hideErrors();
    this.removeAddressFields(this.fcCompanyData);
    // this.removeUserLocation(this.fcCompanyData.address)
    this.apiService.putData('factoringCompanies', this.fcCompanyData).subscribe({
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
        this.toastr.success('Company updated successfully');
      },
    });
  }

  // Add addStaff
  addStaff() {
    this.hideErrors();
    // this.removeUserLocation(this.staffData.address);
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

  updateStaff() {
   
    this.hideErrors();
    this.removeAddressFields(this.staffData);
    // this.removeUserLocation(this.staffData.address)
    this.apiService.putData('staffs', this.staffData).subscribe({
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
    return this.apiService.getData('customers');
  }

  fetchOwnerOperators() {
    return this.apiService.getData('ownerOperators');
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
      "pageLength": 10,
      searching: false,
      processing: true,
      
    };
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

  deactivateCustomer(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`customers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.customers = this.customers.filter(u => u.customerID !== item.customerID);
      });
    }
  }

  deactivateDriver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`drivers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.drivers = this.drivers.filter(u => u.driverID !== item.driverID);
      });
    }
  }

  deactivateBroker(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`brokers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.brokers = this.brokers.filter(u => u.brokerID !== item.brokerID);
      });
    }
  }

  deactivateVendor(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`vendors/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.vendors = this.vendors.filter(u => u.vendorID !== item.vendorID);
      });
    }
  }

  deactivateShipper(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`shippers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.shippers = this.shippers.filter(u => u.shipperID !== item.shipperID);
      });
    }
  }
  deactivateReceiver(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`receivers/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.receivers = this.receivers.filter(u => u.receiverID !== item.receiverID);
      });
    }
  }

  deactivateStaff(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`staffs/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.staffs = this.staffs.filter(u => u.staffID !== item.staffID);
      });
    }
  }

  deactivateCompany(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`factoringCompanies/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.fcCompanies = this.fcCompanies.filter(u => u.factoringCompanyID !== item.factoringCompanyID);
      });
    }
  }

  deactivateOperator(item, userID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.apiService
      .getData(`ownerOperators/isDeleted/${userID}/${item.isDeleted}`)
      .subscribe((result: any) => {
        this.toastr.success('Owner operator deleted successfully');
      });
    }
  }

  editUser(type: string, item: any, index:any) {
    this.updateButton = true;
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

    } else if(type === 'Factoring Company') {
      $('#addStaffModal').modal('show');
      this.fcCompanyData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.fcCompanyData.address = result;

    } else if(type === 'ownerOperator') {
      $('#addOwnerOperatorModal').modal('show');
      this.ownerData = item;
      let result = this.assignAddressToUpdate(item.address)
      this.ownerData.address = result;
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
    if(type == 'driver') {
      this.showDriverModal = true;
    } else {
      this.updateButton = false;
    }
    this.custCurrentTab = 1;
    this.clearModalData()
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

}

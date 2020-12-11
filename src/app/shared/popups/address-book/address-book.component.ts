import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { from, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HereMapService } from '../../../services';

declare var $: any;
@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {
  form;
  countries;
  countries1;
  states;
  cities;
  public customerProfileSrc: any = 'assets/img/driver/driver.png';
  public customers = [];
  userLocation;
  manualAddress: boolean;
  manualAddress1: boolean;
  wsib: false;

  // Customer Object
  customerData = {
    address: [{
      addressType: '',
      countryID: '',
      stateID: '',
      cityID: '',
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
      stateID: '',
      cityID: '',
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
    contactType: 'vendor',
    additionalData: {
      vendorAdditionalData: {
        address: {}
      }
    }
  };

  // Carrier Object
  carrierData = {
    contactType: 'carrier',
    additionalData: {
      carrierAdditionalData: {
        address: {},
        additionalContact: {}
      }
    }
  };

  // Shipper Object
  shipperData = {
    contactType: 'shipper',
    additionalData: {
      shipperAdditionalData: {
        address: {},
        additionalContact: {}
      }
    }
  };

  // Consignee Object
  consigneeData = {
    contactType: 'consignee',
    additionalData: {
      consigneeAdditionalData: {
        address: {},
        additionalContact: {}
      }
    }
  };

  // fcCompany Object
  fcCompanyData = {
    contactType: 'factoring',
    additionalData: {
      factoringAdditionalData: {
        address: {},
        fcDetails: {}
      }
    }
  };

   // Staff Object
   staffData = {
    contactType: 'staff',
    additionalData: {
      staffAdditionalData: {
        address: {},
      }
    }
  };

  public searchTerm = new Subject<string>();
  public searchResults: any;

  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};
  constructor(
            private apiService: ApiService,
            private HereMap: HereMapService)
  { }

  ngOnInit() {
    this.fetchContacts();
    this.fetchCountries();
    this.searchLocation();
    this.fetchAddress();
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

  remove(data, i) {
    data.address.splice(i, 1);
  }

  async userAddress(data: any, i: number, item: any) {
    console.log('obj', data, i, item);
    let result = await this.HereMap.geoCode(item.address.label);
    result = result.items[0];
    console.log('result', result);
    console.log('data.address[i]', data.address[i]);
    $('div').removeClass('show-search__result');

    data.address[i].userLocation = result.address.label;
    data.address[i].geoCords.lat = result.position.lat;
    data.address[i].geoCords.lng = result.position.lng;

    let countryID = await this.fetchCountriesByName(result.address.countryName);
    data.address[i].countryID = countryID;
    
    let stateID = await this.fetchStatesByName(result.address.state);
    data.address[i].stateID = stateID;

    let cityID = await this.fetchCitiesByName(result.address.city);
    data.address[i].cityID = cityID;
    
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
      console.log('cities', result);
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
        console.log('res', res);
        this.searchResults = res;
      }
    });
  }

  // Add Customer
  addCustomer() {
    console.log('customers', this.customerData);
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
          this.Success = 'Customer Added Successfully';
        }
      });
  }

  // Add Broker
  addBroker() {
    console.log('brokerData', this.brokerData);
    this.hideErrors();
    return;
    this.apiService.postData('contacts', this.brokerData).
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
          this.Success = 'Broker Added Successfully';
        }
      });
  }

  // Add Vendor
  addVendor() {
    console.log('vendorData', this.vendorData);
    this.hideErrors();
    this.apiService.postData('contacts', this.vendorData).
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
          this.Success = 'Vendor Added Successfully';
        }
      });
  }

  // Add Carrier
  addCarrier() {
    console.log('carrierData', this.carrierData);
    this.hideErrors();
    this.apiService.postData('contacts', this.carrierData).
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
          this.Success = 'Carrier Added Successfully';
        }
      });
  }

  
  // Add Shipper
  addShipper() {
    console.log('shipperData', this.shipperData);
    this.hideErrors();
    this.apiService.postData('contacts', this.shipperData).
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
          this.Success = 'Shipper Added Successfully';
        }
      });
  }

  // Add Consignee
  addConsignee() {
    console.log('consigneeData', this.consigneeData);
    this.hideErrors();
    this.apiService.postData('contacts', this.consigneeData).
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
          this.Success = 'Consignee Added Successfully';
        }
      });
  }

  // Add FC Company
  addFCompany() {
    console.log('fcCompanyData', this.fcCompanyData);
    this.hideErrors();
    this.apiService.postData('contacts', this.fcCompanyData).
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
          this.Success = 'Company Added Successfully';
        }
      });
  }

  // Add addStaff
  addStaff() {
    console.log('staffData', this.staffData);
    this.hideErrors();
    this.apiService.postData('contacts', this.staffData).
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
          this.Success = 'Staff Added Successfully';
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

  fetchContacts() {
    this.apiService.getData('contacts').subscribe({
      complete: () => { },
      error: () => { },
      next: (result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            this.customers.push(result.Items[i]);
          }
        }
        // console.log('this.fetchContacts', this.customers);
      }
    });
  }

  /*
   * Get all countries from api
   */
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
      this.countries1 = result.Items;
      // console.log('countries', this.countries);
    });
  }

  getStates(id) {
    // const countryID = event.target.value;
    // const countryID = this.customerData.address['countryID'];
    this.apiService.getData('states/country/' + id)
      .subscribe((result: any) => {
        this.states = result.Items;
        console.log('this.states', this.states)
      });
  }

  getCities(id) {
    this.apiService.getData('cities/state/' + id)
      .subscribe((result: any) => {
        this.cities = result.Items;
        console.log('this.cities', this.cities)
      });
  }

  uploadDriverImg(event): void {
    console.log(event);
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.customerProfileSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }


  fetchAddress() {
    this.apiService.getData('addresses')
      .subscribe((result: any) => {
        console.log('address', result);
      });
  }

}

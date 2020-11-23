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
  states;
  cities;
  public customerProfileSrc: any = 'assets/img/driver/driver.png';
  public customers = [];
  userLocation;
  manualAddress: boolean;
  wsib: false;

  // Customer Object
  customerData = {
    contactType: 'customer',
    additionalData: {
      customerAdditionalData: {
        address: [{
          addressType: '',
          countryID: '',
          stateID: '',
          cityID: '',
          addressZip: '',
          address1: '',
          address2: '',
          saveAsLocation: '',
        }],
        additionalContact: {}
      }
    },
  };
  
  // Broker Object
  brokerData = {
    contactType: 'broker',
    additionalData: {
      brokerAdditionalData: {
        address: {},
        additionalContact: {}
      }
    },
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

    $(document).ready(() => {
      this.form = $('#customerForm, #brokerForm, #vendorForm, #carrierForm, #consigneeForm').validate();
    });
  }

  geocodingSearch(value) {
    this.HereMap.geoCode(value);
  }

  async userAddress(address) {
    let label = address.label;
    this.userLocation = address.label;

    if (label) {
      this.customerData.additionalData.customerAdditionalData.address['address1'] = '';
      this.customerData.additionalData.customerAdditionalData.address['stateID'] = '';
      this.customerData.additionalData.customerAdditionalData.address['cityID'] = '';
      this.customerData.additionalData.customerAdditionalData.address['addressZip'] = '';
      // $('.address_country, .address_state, .address_city, .address_zip, .address_one').val('');
      let result = await this.HereMap.geoCode(label);
      result = result.items[0];
      console.log('result', result);
      // tslint:disable-next-line: max-line-length
      if (result.title !== undefined || result.address.street !== undefined || result.address.houseNumber !== undefined || result.address.countryName !== undefined || result.addess.postalCode) {
        this.customerData.additionalData.customerAdditionalData.address['address1'] =
                                                  `${result.title} ${result.address.houseNumber} ${result.address.street}`;
        console.log('this.countries', this.countries);
        this.countries.filter(country => {
          console.log('country', country);
          if (country.countryName === result.address.countryName) {
            console.log('result.address.countryName', result.address.countryName);
            this.customerData.additionalData.customerAdditionalData.address['countryID'] = country.countryID;
          }
        });
        // this.getStates();

        if (this.states) {
          this.states.filter(state => {
            if (state.stateName === result.address.state) {
              this.customerData.additionalData.customerAdditionalData.address['stateID'] = state.stateID;
            }
          });
        }
        // this.getCities();
        if (this.cities) {
          this.cities.filter(city => {
            if (city.cityName === result.address.city) {
              this.customerData.additionalData.customerAdditionalData.address['cityID'] = city.cityID;
            }
          });
        }
        
        this.customerData.additionalData.customerAdditionalData.address['addressZip'] = result.address.postalCode;
      }

    }
    this.searchResults = false;
  }

  addAddress(item) {
    console.log("itesm", item);
    this.customerData.additionalData.customerAdditionalData.address.push({
      addressType: item.addressType,
      countryID: item.countryID,
      stateID: item.stateID,
      cityID: item.cityID,
      addressZip: item.address_zip,
      address1: item.address1,
      address2: item.address2,
      saveAsLocation: item.saveAsLocation,
    });
    console.log("address", this.customerData.additionalData.customerAdditionalData.address);
  }

  public searchLocation() {
    let target;
    this.searchTerm.pipe(
      map((e: any) => {
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
    console.log('this.this.documentData', this.customerData);
    this.hideErrors();
    this.apiService.postData('contacts', this.customerData).
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
        console.log('this.fetchContacts', this.customers);
      }
    });
  }

  /*
   * Get all countries from api
   */
  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countries = result.Items;
      // console.log('countries', this.countries);
    });
  }

  getStates(event) {
    // const countryID = event.target.value;
    const countryID = this.customerData.additionalData.customerAdditionalData.address['countryID'];
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
        console.log('this.states', this.states)
      });
  }

  getCities(event) {
    // const stateID = event.target.value;
    const stateID = this.customerData.additionalData.customerAdditionalData.address['stateID'];
    this.apiService.getData('cities/state/' + stateID)
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

}

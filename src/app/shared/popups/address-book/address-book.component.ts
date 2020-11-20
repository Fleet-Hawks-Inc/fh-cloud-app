import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
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
  
  // Customer Object
  customerData = {
    contactType: 'customer',
    additionalData: {
      customerAdditionalData: {
        address: {},
        additionalContact: {}
      }
    },
  }

  // Broker Object
  brokerData = {
    contactType: 'broker',
    additionalData: {
      brokerAdditionalData: {
        address: {},
        additionalContact: {}
      }
    },
  }

  public searchTerm = new Subject<string>();
  public searchResults: any;
  
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};
  constructor( private apiService: ApiService,
    private HereMap: HereMapService) { }

  ngOnInit() {
    this.fetchCustomer();
    this.fetchCountries();
    this.searchLocation();
    
    $(document).ready(() => {
      this.form = $('#form_, #form1_').validate();
    });
  }

  geocodingSearch(value){
    this.HereMap.geoCode(value);
  }

  async userAddress(address) {
    let label = address.label;
    this.userLocation = address.label;
    
    if (label) {
      this.customerData.additionalData.customerAdditionalData.address['address1'] = '';
      this.customerData.additionalData.customerAdditionalData.address['countryID'] = '';
      this.customerData.additionalData.customerAdditionalData.address['stateID'] = '';
      this.customerData.additionalData.customerAdditionalData.address['cityID'] = '';
      this.customerData.additionalData.customerAdditionalData.address['addressZip'] = '';
      let result = await this.HereMap.geoCode(label);
      result = result.items[0];
      console.log('result', result);
      // tslint:disable-next-line: max-line-length
      if (result.title !== undefined || result.address.street !== undefined || result.address.houseNumber !== undefined || result.address.countryName !== undefined || result.addess.postalCode) {
        this.customerData.additionalData.customerAdditionalData.address['address1'] =
                                  `${result.title} ${result.address.houseNumber} ${result.address.street}`;
        this.countries.filter(country => {
          if (country.countryName === result.address.countryName) {
            this.customerData.additionalData.customerAdditionalData.address['countryID'] = country.countryID;
          }
        });
        this.getStates();

        this.states.filter(state => {
          if (state.stateName === result.address.state) {
            this.customerData.additionalData.customerAdditionalData.address['stateID'] = state.stateID;
          }
        });
        this.getCities();

        this.cities.filter(city => {
          console.log('city', city)
          if (city.cityName === result.address.city) {
            this.customerData.additionalData.customerAdditionalData.address['cityID'] = city.cityID;
          }
        });
        this.customerData.additionalData.customerAdditionalData.address['addressZip'] = result.address.postalCode;
      }
      
    }
    this.searchResults = false;
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
    this.apiService.postData('contacts', this.customerData).
    subscribe({
      complete : () => {},
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
    this.apiService.postData('contacts', this.brokerData).
    subscribe({
      complete : () => {},
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

  throwErrors() {
    this.form.showErrors(this.errors);
  }
  fetchCustomer() {
    this.apiService.getData('contacts').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            this.customers.push(result.Items[i]);
          }
        }
        console.log('this.customer', this.customers);
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

  getStates() {
    const countryID = this.customerData.additionalData.customerAdditionalData.address['countryID'];
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
        console.log('this.states', this.states)
      });
  }

  getCities() {
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

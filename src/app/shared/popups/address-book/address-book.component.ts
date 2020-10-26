import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import { from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
  customerData = {
    customerAddress: {},
    additionalContact: {}
  }
  
  response: any = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;
  Error: string = '';
  Success: string = '';
  errors = {};
  constructor( private apiService: ApiService) { }

  ngOnInit() {
    this.fetchCustomer();
    this.fetchCountries();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  addCustomer() {
    console.log('this.this.documentData', this.customerData);
    this.apiService.postData('customers', this.customerData).
    subscribe({
      complete : () => {},
      error: (err) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              const path = val.path;
              // We Can Use This Method
              const key = val.message.match(/"([^']+)"/)[1];
              console.log(key);
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.Success = '';
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
  throwErrors() {
    this.form.showErrors(this.errors);
  }
  fetchCustomer() {
    this.apiService.getData('customers').subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          if (result.Items[i].isDeleted === 0) {
            this.customers.push(result.Items[i]);
          }
        }
        // console.log('this.customer', this.customers);
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
    console.log("ff", this.customerData);
    const countryID = this.customerData.customerAddress['countryID'];
    this.apiService.getData('states/country/' + countryID)
      .subscribe((result: any) => {
        this.states = result.Items;
        // console.log('this.states', this.states)
      });
  }

  getCities() {
    const stateID = this.customerData.customerAddress['stateID'];
    this.apiService.getData('cities/state/' + stateID)
      .subscribe((result: any) => {
        this.cities = result.Items;
        // console.log('this.cities', this.cities)
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

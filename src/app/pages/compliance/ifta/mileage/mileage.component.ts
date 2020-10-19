import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
declare var $: any;
@Component({
  selector: 'app-mileage',
  templateUrl: './mileage.component.html',
  styleUrls: ['./mileage.component.css']
})
export class MileageComponent implements OnInit {

  activeTab = 'jurisdiction';
  countries = [];
  states = [];
  form;
  baseState: string;
  baseCountry: string;
  accountNumber: string;
  EIN: string;
  signingAuthority = {};
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this. fetchCountries();
    $(document).ready(() => {
      this.form = $('#form_').validate();
    });
  }
  fetchCountries() {
    this.apiService.getData('countries')
      .subscribe((result: any) => {
        this.countries = result.Items;
      });
  }
  getStates() {
    this.apiService.getData('states/country/' + this.baseCountry)
      .subscribe((result: any) => {
        this.states = result.Items;
      });
  }
  addIftaAccount() {
    const data = {
      baseState : this.baseState,
      baseCountry: this.baseCountry,
      accountNumber:  this.accountNumber
    };
  console.log('data', data);
  console.log('Signing Authority', this.signingAuthority);
  }
}

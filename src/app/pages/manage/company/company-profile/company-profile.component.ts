import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';

import { ApiService } from '../../../../services';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  companyID = '';
  carriers: any = [];
  logoSrc: any = '';
  countryList: any = {};
  stateList: any = {};
  cityList; any = {};
  showData = false;
  bank: any = {
    branchName: '',
    accountNumber: '',
    transitNumber: '',
    routingNumber: '',
    institutionNumber: '',
    addressDetails: [{
      addressType: '',
      countryName: '',
      countryCode: '',
      stateCode: '',
      stateName: '',
      cityName: '',
      zipCode: '',
      address: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      manual: false,
    }]
  };
  constructor(private route: ActivatedRoute, private apiService: ApiService,
    private countryStateCity: CountryStateCityService
  ) { }

  ngOnInit() {
    this.companyID = this.route.snapshot.params[`companyID`];
    this.fetchCarrier();
  }
  fetchCarrier() {
    this.apiService.getData(`carriers/${this.companyID}`)
      .subscribe((result: any) => {
        this.carriers = result.Items[0];
        //console.log(Object.keys(this.carriers.referral.name).length)
        // console.log("name" in this.carriers.referral)
        //console.log(this.carriers.haswOwnProperty('referral'))
        if (!this.carriers.referral && this.carriers.findingWay == 'Referral') {
          this.carriers.referral = {}
        }
        if (result.Items.length > 0) {
          this.showData = true;
        }
        this.fetchAddress(this.carriers.addressDetails);
        this.logoSrc = 'assets/img/logo.png';
        // below code is commented as fleet hawks logo will be used for now not company logo
        // if (this.carriers.uploadedLogo !== '' || this.carriers.uploadedLogo !== undefined) {
        //   this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
        // } else {
        //   this.logoSrc = 'assets/img/logo.png';
        // }
      });
  }

  fetchAddress(address: any) {
    for (let a = 0; a < address.length; a++) {
      address.map(async (e: any) => {
        if (e.manual) {
          e.countryName = await this.countryStateCity.GetSpecificCountryNameByCode(e.countryCode);
          e.stateName = await this.countryStateCity.GetStateNameFromCode(e.stateCode, e.countryCode);
        }
      });
    }
  }
}

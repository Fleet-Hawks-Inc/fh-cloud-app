import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
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
 logoSrc: any  = '';
 countryList: any = {};
 stateList: any  = {};
 cityList; any  = {};
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
  constructor( private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.companyID = this.route.snapshot.params[`companyID`];
    this.fetchCarrier();
  }
  fetchCarrier() {
    this.apiService.getData(`carriers/${this.companyID}`)
        .subscribe((result: any) => {
          this.carriers = result.Items[0];
          if(result.Items.length > 0) {
            this.showData = true;
          }
          this.fetchAddress(this.carriers.addressDetails);
          if (this.carriers.uploadedLogo !== '') {
            this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
          } else {
            this.logoSrc = 'assets/img/logo.png';
          }
        });
  }

  fetchAddress(address: any) {
   for(let a=0; a < address.length; a++){
     address.map((e: any) => {
       if(e.manual) {
          e.countryName =  CountryStateCity.GetSpecificCountryNameByCode(e.countryCode);
          e.stateName = CountryStateCity.GetStateNameFromCode(e.stateCode, e.countryCode);
       }
     });
   }
  }
}

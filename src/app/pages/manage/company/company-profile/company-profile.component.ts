import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor( private route: ActivatedRoute,private apiService: ApiService,) { }

  ngOnInit() {
    this.companyID = this.route.snapshot.params[`companyID`];
    console.log('company', this.companyID);
    this.fetchCarrier();
    this.fetchCountriesList();
    this. fetchCitiesList();
    this.fetchStatesList();
  }
  fetchCarrier(){
    this.apiService.getData(`carriers/${this.companyID}`)
        .subscribe((result: any) => {
          this.carriers = result.Items[0];
          console.log('this.carriers',this.carriers);
         // this.logoSrc = 'assets/img/logo.png';
          this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
          if (this.logoSrc === undefined || this.logoSrc === null || this.logoSrc === '' || this.logoSrc === 'undefined') {
            this.logoSrc = 'assets/img/logo.png';
          }
        });
  }
  fetchCountriesList() {
    this.apiService.getData('countries/get/list').subscribe((result: any) => {
      this.countryList = result;
    });
  }
  fetchStatesList() {
    this.apiService.getData('states/get/list').subscribe((result: any) => {
      this.stateList = result;
    });
  }
  fetchCitiesList() {
    this.apiService.getData('cities/get/list').subscribe((result: any) => {
      this.cityList = result;
    });
  }
}

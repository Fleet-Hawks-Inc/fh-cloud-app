import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-carrier-register',
  templateUrl: './carrier-register.component.html',
  styleUrls: ['./carrier-register.component.css'],
})
export class CarrierRegisterComponent implements OnInit {
  activeTab = 1;
  carrierID = 'testing';
  businessDetail = {
    businessType: '',
    carrierName: '',
    dbaName: '',
    EIN: '',
  };
  addressDetail = {
    addressType: '',
    countryID: '',
    stateID: '',
    cityID: '',
    zipCode: '',
    address1: '',
    address2: '',
    geoLocation: {
      lat: '',
      lng: '',
    },
  };
  contactDetail = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fax: '',
  };
  superAdminInfo = {
    email: '',
    userName: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    language: '',
  };
  socialNetwork = {
    facebook: '',
    twitter: '',
    linkedin: '',
    googlePlus: '',
    blog: '',
    tumblr: '',
  };
  notes: '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.carrierID = this.route.snapshot.params['carrierID'];
  }

  ngOnInit() {
    this.getInfo();
  }

  toggleTab(tab) {
    this.activeTab = tab;
  }

  next() {
    if (this.activeTab === 5) return;
    this.activeTab++;
  }

  previous() {
    if (this.activeTab === 1) return;
    this.activeTab--;
  }

  getInfo() {
    this.apiService
      .getData('carriers/register/' + this.carrierID)
      .subscribe((result: any) => {
        result = result.Items[0];
        this.carrierID = result.carrierID;
        this.businessDetail.carrierName = result.businessDetail.carrierName;
        this.contactDetail.email = result.contactDetail.email;
        this.superAdminInfo.email = result.contactDetail.email;
      });
  }

  submit() {
    this.register();

    let data = {
      carrierID: this.carrierID,
      businessDetail: this.businessDetail,
      addressDetail: this.addressDetail,
      contactDetail: this.contactDetail,
      superAdminInfo: {
        userName: this.superAdminInfo.userName,
        firstName: this.superAdminInfo.firstName,
        lastName: this.superAdminInfo.lastName,
        phone: this.superAdminInfo.phone,
        language: this.superAdminInfo.language,
        email: this.superAdminInfo.email,
      },
      socialNetwork: this.socialNetwork,
      notes: this.notes,
    };

    this.apiService.putData('carriers/register', data).subscribe({
      complete: () => {},
      error: (err) => {
        // this.hasError = true;
        // this.Error = err.error;
      },
      next: (res) => {
        // this.response = res;
        // this.hasSuccess = true;
        // this.Success = 'Shipper Updated successfully';
      },
    });
  }

  register = async () => {
    try {
      // This should go in Register component
      let res = await Auth.signUp({
        password: this.superAdminInfo.password,
        username: this.superAdminInfo.userName,
        attributes: {
          email: this.superAdminInfo.email,
          phone_number: this.superAdminInfo.phone,
        },
      });

      console.log(res);
    } catch (err) {
      console.log('inside catch block');
      // this.hasError = true;
      // this.Error = err.message || 'Error during login';
    }
  };
}

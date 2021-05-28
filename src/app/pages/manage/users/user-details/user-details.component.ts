import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  Asseturl = this.apiService.AssetUrl;
  contactID = '';
  profilePath = '';
  userData = {
    companyName: '',
    dbaName: '',
    firstName: '',
    lastName: '',
    employeeID: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    entityType: 'employee',
    profileImg: '',
    loginEnabled: false,
    paymentDetails: {
      payrollType: '',
      payrollRate: '',
      payrollRateUnit: '',
      payPeriod: '',
      SIN: '',
      WCB: '',
      healthCare: ''
    },
    address: [{
      addressType: '',
      countryCode: '',
      countryName: '',
      stateCode: '',
      stateName: '',
      cityName: '',
      zipCode: '',
      address1: '',
      address2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      userLocation: '',
      manual: false,
      states: [],
      cities: []
    }],
    userAccount: {
      contractStartDate: '',
      contractEndDate: '',
      department: '',
      designation: ''
    },
    currentStatus: 'active',
    userLoginData: {
      userName: '',
      userType: '',
      password: '',
      confirmPassword: ''
    }
  };
      public userProfileSrc: any = 'assets/img/driver/driver.png';
  constructor(private route: ActivatedRoute, private apiService: ApiService,private router: Router, private toastr: ToastrService,) { }

  ngOnInit() {
    this.contactID = this.route.snapshot.params[`contactID`];
      this.fetchUserByID();
  }
  fetchUserByID() {
    this.apiService.getData('contacts/detail/' + this.contactID).subscribe((result: any) => {
      result = result.Items[0];
      this.userData = {
        companyName: result.companyName,
        dbaName: result.dbaName,
        firstName: result.firstName,
        lastName: result.lastName,
        employeeID: result.employeeID,
        dateOfBirth: result.dateOfBirth,
        phone: result.phone,
        email: result.email,
        entityType: 'employee',
        loginEnabled: result.loginEnabled,
        profileImg: result.profileImg,
        currentStatus: result.currentStatus,
        paymentDetails: {
          payrollType: result.paymentDetails.payrollType,
          payrollRate: result.paymentDetails.payrollRate,
          payrollRateUnit: result.paymentDetails.payrollRateUnit,
          payPeriod: result.paymentDetails.payPeriod,
          SIN: result.paymentDetails.SIN,
          WCB: result.paymentDetails.WCB,
          healthCare: result.paymentDetails.healthCare,
        },
        address: result.address,
        userAccount: {
          contractStartDate: result.userAccount.contractStartDate,
          contractEndDate: result.userAccount.contractEndDate,
          department: result.userAccount.department,
          designation: result.userAccount.designation,
        },
        userLoginData: {
          userName: result.userLoginData.userName,
          userType: result.userLoginData.userType,
          password: '',
          confirmPassword: ''
        }
      };
      if (this.userData.address !== undefined) {
        this.fetchAddress(this.userData.address);
      }
      this.userData[`timeCreated`] = result.timeCreated;
      this.userData[`createdDate`] = result.createdDate;
      this.userData[`createdTime`] = result.createdTime;
      // to show profile image
      if (result.profileImg !== '' && result.profileImg !== undefined) {
        this.profilePath = `${this.Asseturl}/${result.carrierID}/${result.profileImg}`;
      }
    });
  }
  fetchAddress(address: any) {
    for(let a=0; a < address.length; a++){
      address.map((e: any) => {
        if (e.manual) {
           e.countryName =  CountryStateCity.GetSpecificCountryNameByCode(e.countryCode);
           e.stateName = CountryStateCity.GetStateNameFromCode(e.stateCode, e.countryCode);
        }
      });
    }
   }
}

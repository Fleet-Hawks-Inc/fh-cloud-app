import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';

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
    workPhone: '',
    workEmail: '',
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
    adrs: [{
      aType: null,
      cCode: null,
      cName: '',
      sCode: null,
      sName: null,
      ctyName: null,
      zip: '',
      add1: '',
      add2: '',
      geoCords: {
        lat: '',
        lng: ''
      },
      isSuggest: false,
      userLoc: '',
      manual: false,
      houseNo: '',
      street: '',
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
      password: '',
      confirmPassword: ''
    }
  };
  newRoles = [];
  public userProfileSrc: any = 'assets/img/driver/driver.png';
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private toastr: ToastrService,
              private countryStateCity: CountryStateCityService) { }

  ngOnInit() {
    this.contactID = this.route.snapshot.params[`contactID`];
    this.fetchUserByID();
  }
  fetchUserByID() {
    this.apiService.getData('contacts/detail/' + this.contactID).subscribe((result: any) => {
      result = result.Items[0];
      result.userLoginData.userRoles.map((v: any) => {
        const role = v.split('_');
        const newRole = role[1];
        this.newRoles.push(newRole);
      });
      this.userData = {
        companyName: result.companyName,
        dbaName: result.dbaName,
        firstName: result.firstName,
        lastName: result.lastName,
        employeeID: result.employeeID,
        dateOfBirth: result.dateOfBirth,
        workPhone: result.workPhone,
        workEmail: result.workEmail,
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
        adrs: result.adrs,
        userAccount: {
          contractStartDate: result.userAccount.contractStartDate,
          contractEndDate: result.userAccount.contractEndDate,
          department: result.userAccount.department,
          designation: result.userAccount.designation,
        },
        userLoginData: {
          userName: result.userLoginData.userName,
          password: '',
          confirmPassword: ''
        }
      };
      this.userData[`timeCreated`] = result.timeCreated;
      this.userData[`createdDate`] = result.createdDate;
      this.userData[`createdTime`] = result.createdTime;
      // to show profile image
      if (result.profileImg !== '' && result.profileImg !== undefined) {
        this.profilePath = `${this.Asseturl}/${result.carrierID}/${result.profileImg}`;
      } else {
        this.profilePath = '';
      }
    });
  }
}

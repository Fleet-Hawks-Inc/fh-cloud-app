import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { passwordStrength } from 'check-password-strength';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';


declare var $: any;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('driverF') driverF: NgForm;
  Asseturl = this.apiService.AssetUrl;
  contactID = '';
  contactsObject: any = {};
  vendor: any;
  sessionID: string;
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
    userType: '',
    corporationType: null,
    vendor: null,
    corporation: '',
    notes: '',
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
  user = { password: '', confirmPassword: '' };
  userName: any = '';
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  };
  newRoles = [];
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  errors: {};
  submitDisabled: boolean = false;
  hasSuccess: boolean;
  response: any = '';
  public userProfileSrc: any = 'assets/img/driver/driver.png';
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private toastr: ToastrService,
    private countryStateCity: CountryStateCityService,
    private routerMgmtService: RouteManagementServiceService
    ) { 
          this.sessionID = this.routerMgmtService.userSessionID;
    }

  ngOnInit() {
    this.contactID = this.route.snapshot.params[`contactID`];
    this.fetchUserByID();
    this.fetchAllContacts();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }

  pwdModalClose() {
    $('#userPasswordModal').modal('hide');
    this.user = {
      password: '',
      confirmPassword: '',
    }
  }

  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
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
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        $('[name="' + v + '"]')
          .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
          .addClass('error');
      });
  }

  validatePassword(password) {
    let passwordVerify = passwordStrength(password)
    if (passwordVerify.contains.includes('lowercase')) {
      this.passwordValidation.lowerCase = true;
    } else {
      this.passwordValidation.lowerCase = false;
    }

    if (passwordVerify.contains.includes('uppercase')) {
      this.passwordValidation.upperCase = true;
    } else {
      this.passwordValidation.upperCase = false;
    }
    if (passwordVerify.contains.includes('symbol')) {
      this.passwordValidation.specialCharacters = true;
    } else {
      this.passwordValidation.specialCharacters = false;
    }
    if (passwordVerify.contains.includes('number')) {
      this.passwordValidation.number = true;
    } else {
      this.passwordValidation.number = false;
    }
    if (passwordVerify.length >= 8) {
      this.passwordValidation.length = true
    } else {
      this.passwordValidation.length = false;
    }
    if (password.includes('.') || password.includes('-')) {
      this.passwordValidation.specialCharacters = true;
    }
  }


  fetchAllContacts() {
        this.apiService.getData('contacts/get/list')
            .subscribe((result: any) => {
                this.contactsObject = result;
            });
    }



  onChangePassword() {
    this.submitDisabled = false;
    const data = {
      userName: this.userName,
      password: this.user.password
    };
    this.apiService.postData('drivers/password', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.label] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.throwErrors();
              this.submitDisabled = false;
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        this.response = res;
        this.hasSuccess = true;
        this.submitDisabled = false;
        this.toastr.success('Password updated successfully');
        $('#userPasswordModal').modal('hide');
        this.user = {
          password: '',
          confirmPassword: '',
        }
      },
    });

  }

  fetchUserByID() {
    this.apiService.getData('contacts/detail/' + this.contactID).subscribe((result: any) => {
      result = result.Items[0];
      result.userLoginData.userRoles.map((v: any) => {
        const role = v.split('_');

        if (role.length > 2) {
          if (role[1] === 'view') {
            role.splice(2, 1, "only");
          }
          const newRole = `${role[1]} ${role[2]}`
          this.newRoles.push(newRole);
        }
        else {
          const newRole = role[1];
          this.newRoles.push(newRole);
        }
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
        notes: result.notes,
        userType: result.userType,
        corporationType: result.corporationType,
        vendor: result.vendor,
        corporation: result.corporation,
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
      this.userName = result.userLoginData.userName;
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ApiService } from '../../../../services';
import { passwordStrength } from 'check-password-strength';
import { ToastrService } from 'ngx-toastr'
import { Auth } from 'aws-amplify'
declare var $: any;
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
  fieldTextType: boolean;
  cpwdfieldTextType: boolean;
  oldFieldTextType: boolean;
  submitDisabled = false;
  public pwdData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  errors = {};
  response: any = '';
  hasSuccess = false;
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  };
  oldPassError = ''

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.companyID = this.route.snapshot.params[`companyID`];
    this.fetchCarrier();
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
    // this.vehicleForm.showErrors(this.errors);
  }
  pwdModalClose() {
    $('#changePasswordModal').modal('hide');
    this.pwdData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }
  onChangePassword() {
    let username = this.apiService.getCarrierUserName();
    this.submitDisabled = true;
    this.hideErrors();
    const data = {
      userName: username,
      oldPassword: this.pwdData.oldPassword,
      newPassword: this.pwdData.newPassword
    };
    try {
      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, data.oldPassword, data.newPassword);
        })
        .then(data => {
          if (data == 'SUCCESS') {
            this.response = data;
            this.hasSuccess = true;
            this.submitDisabled = false;
            this.toastr.success('Password updated successfully');
            this.pwdModalClose();
            this.pwdData = {
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            }
          }
        })
        .catch(err => {
          if (err._type = "NotAuthorizedException") {
            this.submitDisabled = false
            this.errors[err.code] = err.message
            this.throwErrors();
            this.oldPassError = "Incorrect Password";
          }
          else {
            this.submitDisabled = false
            this.errors[err.code] = err.message
            this.throwErrors();
            this.oldPassError = err.message;
          }
        })
    } catch (error) {
      this.errors["error"] = error
      this.throwErrors();

    }
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleOldFieldTextType() {
    this.oldFieldTextType = !this.oldFieldTextType
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }
  validatePassword(password) {
    let passwordVerify = passwordStrength(password);
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
      this.passwordValidation.length = true;
    } else {
      this.passwordValidation.length = false;
    }
    if (password.includes('.') || password.includes('-')) {
      this.passwordValidation.specialCharacters = true;
    }
  }
  onChangeHideErrors(fieldname = '') {
    $('[name="' + fieldname + '"]')
      .removeClass('error')
      .next()
      .remove('label');
  }
  fetchCarrier() {
    this.apiService.getData(`carriers/${this.companyID}`)
      .subscribe((result: any) => {
        this.carriers = result.Items[0];
        if (!this.carriers.referral && this.carriers.findingWay === 'Referral') {
          this.carriers.referral = {};
        }
        if (result.Items.length > 0) {
          this.showData = true;
        }
        if (this.carriers.uploadedLogo === '' || this.carriers.uploadedLogo === undefined) {
          this.logoSrc = 'assets/img/logo.png';
        } else {
          this.logoSrc = `${this.Asseturl}/${this.carriers.carrierID}/${this.carriers.uploadedLogo}`;
        }
      });
  }

}

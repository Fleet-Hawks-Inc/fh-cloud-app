import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { ApiService } from '../../../../services';
import { passwordStrength } from 'check-password-strength';
import { ToastrService } from 'ngx-toastr'
import { Auth } from 'aws-amplify'
import { FormGroup } from '@angular/forms';
import { alphaAsync, compare, numericAsync, password, pattern, prop, ReactiveFormConfig, required, RxFormBuilder } from '@rxweb/reactive-form-validators';
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
  oldPassError = '';
  showVerification: boolean = false;

  userVerificationFormGroup: FormGroup;
  verificationInfo: VerificationInfo;
  userInfo: UserInfo;
  userInfoFormGroup: FormGroup
  userErrorMessage: string;
  userNameExists = false;
  userNameExistsErr = '';
  carrierNameExists = false;
  carrierNameErr = '';
  emailExistsExists = false;
  emailExistsErr = '';
  subCompanies = [];
  showSubCompany = false;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private formBuilder: RxFormBuilder
  ) {
    ReactiveFormConfig.set({
      'validationMessage': {
        "required": "This field is required",
        "email": "Email is invalid.",
        "compare": "Passwords does not match."
      }
    })
  }

  ngOnInit() {
    this.userInfo = new UserInfo();
    this.companyID = this.route.snapshot.params[`companyID`];
    this.userInfoFormGroup = this.formBuilder.formGroup(this.userInfo);
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
        if(result.Items && result.Items.length > 0) {
          this.carriers = result.Items[0];
          console.log('this.carriers', this.carriers)
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
          if(this.carriers.subCompInfo && this.carriers.subCompInfo.length > 0) {
            this.subCompanies = this.carriers.subCompInfo;
          }
          if(!this.carriers.parentID) {
            this.showSubCompany = true;
          }
        }
      });
  }
  
  async addSubCompany() {
    const data = {
      userName: this.userInfo.username,
      email: this.userInfo.email,
      password: this.userInfo.compPassword,
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      carrierName: this.userInfo.carrierName
    }
    const result:any = await this.apiService.postData(`carriers/sub-company/add`, data).toPromise();
    if(result) {
      this.clearForm();
      this.toastr.success('Sub company added successfully');
      this.fetchCarrier();
    } else {
      this.toastr.error('Something went wrong!');
      return false;
    }
  }

  async validateUsername() {
    const data = {
      userName: this.userInfo.username
    }
    this.apiService.postData(`carriers/validate/username`, data).subscribe((result: any) => {
      console.log('result', result)
      if(!result) {
        this.userNameExists = true;
        this.userNameExistsErr = 'Username already exists';
      } else {
        this.userNameExists = false;
        this.userNameExistsErr = '';
      }
    })
  }

  async validateEmail() {
    const data = {
      email: this.userInfo.email
    }
    this.apiService.postData(`carriers/validate/email`, data).subscribe((result: any) => {
      console.log('result', result)
      if(!result) {
        this.emailExistsExists = true;
        this.emailExistsErr = 'Email already exists';
      } else {
        this.emailExistsExists = false;
        this.emailExistsErr = '';
      }
    })
  }

  async validateCompanyName() {
    const data = {
      carrierName: this.userInfo.carrierName
    }
    this.apiService.postData(`carriers/validate/carriername`, data).subscribe((result: any) => {
      console.log('result', result)
      if(!result) {
        this.carrierNameExists = true;
        this.carrierNameErr = 'Registered Company Name already exists';
      } else {
        this.carrierNameExists = false;
        this.carrierNameErr = '';
      }
    })
  }
  

  clearForm() {
    this.userInfoFormGroup.reset();
    $("#addCompanyModal").modal('hide')
  }
}


class VerificationInfo {
  @prop()
  @required({ message: "Verification code cannot be blank." })
  @numericAsync({ message: "Only numbers allowed.", allowDecimal: false })
  verificationCode: string;
}

class UserInfo {
  @required()
  @pattern({
    expression: { 'onlyAlpha': /^(?=[a-zA-Z0-9.]{6,20}$)(?!.*[.]{2})[^.].*[^.]$/ }, message: "Username should be at-least 6 characters long and can be a combination of numbers, letters  and dot(.)."
  })
  username: string;

  @required()
  @prop()
  email: string;

  @required()
  @prop()
  @password({ validation: { maxLength: 15, minLength: 8, upperCase: true, digit: true, alphabet: true, specialCharacter: true }, message: "Password must be of length 8 or more with combination of uppercase, lowercase, numbers & special characters." })
  compPassword: string;

  @required()
  @compare({ fieldName: 'password', message: "Password does not match." })
  confirmPassword: string;

  @required()
  firstName: string;

  @required()
  lastName: string;

  @required()
  carrierName: string
}

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { compare, numericAsync, password, pattern, prop, ReactiveFormConfig, required, RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Auth } from 'aws-amplify';
import { passwordStrength } from 'check-password-strength';
import { ToastrService } from 'ngx-toastr';
import * as QRCode from 'qrcode';
import { from } from 'rxjs';
import { InvokeHeaderFnService } from 'src/app/services/invoke-header-fn.service';
import { ApiService, AuthService } from '../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
declare var $: any;
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
  providers: [ConfirmationService, MessageService]

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

  accountSettings = [];
  userAttributes;

  verficationError = '';
  showVerifyEmail = false;
  verifyButton = false;
  otpCode: string;
  showVerifyPhone = false;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private formBuilder: RxFormBuilder,
    private headerFnService: InvokeHeaderFnService,
    private auth: AuthService,
    private confirmSvc: ConfirmationService,
    private messageService: MessageService,
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

  subscriptions: ISubscriptionInfo[];
  async fetchCarrier() {
    let result = await this.apiService.getData(`carriers/${this.companyID}`).toPromise()
    if (result.Items && result.Items.length > 0) {
      this.carriers = result.Items[0];

      if (this.carriers.accountSettings && this.carriers.accountSettings != undefined) {
        this.accountSettings = this.carriers.accountSettings;
      }

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

      if (this.carriers.subCompInfo && this.carriers.subCompInfo.length > 0) {
        this.subCompanies = this.carriers.subCompInfo;
      }
      if (!this.carriers.parentID) {
        this.showSubCompany = true;
      }
      if (result.subscriptions && result.subscriptions.length > 0) {
        this.subscriptions = result.subscriptions as ISubscriptionInfo[];
      } else {
        this.subscriptions = [];
      }
      // Get current users attributes
      this.userAttributes = await this.auth.isUserAttributesVerified();
    }
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
    const result: any = await this.apiService.postData(`carriers/sub-company/add`, data).toPromise();
    if (result) {
      this.clearForm();
      localStorage.setItem("subCompany", 'yes');
      this.headerComponentFunction();
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
    if (this.userInfo.username) {
      this.apiService.postData(`carriers/validate/username`, data).subscribe((result: any) => {

        if (!result) {
          this.userNameExists = true;
          this.userNameExistsErr = 'Username already exists';
        } else {
          this.userNameExists = false;
          this.userNameExistsErr = '';
        }
      })
    }
  }

  async validateEmail() {
    const data = {
      email: this.userInfo.email
    }
    if (this.userInfo.email) {
      this.apiService.postData(`carriers/validate/email`, data).subscribe((result: any) => {

        if (!result) {
          this.emailExistsExists = true;
          this.emailExistsErr = 'Email already exists';
        } else {
          this.emailExistsExists = false;
          this.emailExistsErr = '';
        }
      })
    }
  }

  async validateCompanyName() {
    const data = {
      carrierName: this.userInfo.carrierName
    }
    if (this.userInfo.carrierName) {
      this.apiService.postData(`carriers/validate/carriername`, data).subscribe((result: any) => {

        if (!result) {
          this.carrierNameExists = true;
          this.carrierNameErr = 'Registered Company Name already exists';
        } else {
          this.carrierNameExists = false;
          this.carrierNameErr = '';
        }
      })
    }
  }

  headerComponentFunction() {
    this.headerFnService.callHeaderFn();
  }

  clearForm() {
    this.userInfoFormGroup.reset();
    $("#addCompanyModal").modal('hide')
  }

  async verifyEmail() {
    try {
      this.verficationError = '';
      await Auth.verifyCurrentUserAttribute('email');

    } catch (error) {
      this.verficationError = error
    }

  }

  async verifyPhone() {
    try {
      this.verficationError = '';
      await Auth.verifyCurrentUserAttribute('phone_number');

    } catch (error) {
      this.verficationError = error
    }

  }

  async verifyAttribute(attr: string) {
    try {

      await Auth.verifyCurrentUserAttributeSubmit(attr, this.otpCode);
      await this.auth.logout();
    } catch (error) {
      this.verficationError = error
    }
  }


  async onOtpChange(code: any) {
    try {
      if (code.length === 6) {
        this.verifyButton = true;
        this.otpCode = code;

      } else {
        this.verifyButton = false;
      }
    } catch (error) {
      // console.log(error)
    }
  }

  // Multi Factor Authentication

  showMFA = false;
  mfa: string;
  mfaError = '';
  totpCode = ';'
  qrcodeImage;
  isSMS = false;
  smsMFA;
  totpMFA = false;
  async setSmsOTP(event) {
    try {

      if (event.checked === true) {
        let user = await Auth.currentAuthenticatedUser();
        if (this.userAttributes && this.userAttributes.phoneVerified === false) {
          throw new Error('Phone number is not verified. Please update or verify your phone number from Company Detail page.')
        } else {
          await Auth.setPreferredMFA(user, 'SMS_MFA');
        }
      }

    } catch (error) {
      this.mfaError = error;
    }
  }

  /**
   * Generates Time based OTP for QR code and Apps like Google Authenticator, Microsoft or Authy
   * @param event 
   */
  async generateTOTPCode() {
    try {
      this.mfaError = '';
      await this.getCurrentStatusMFA();
      let user = await Auth.currentAuthenticatedUser();
      let userdetails = await this.auth.getUserDetails();
      const code = await Auth.setupTOTP(user)
      const str = "otpauth://totp/FleetHawksDashboard:" + userdetails.userName + "?secret=" + code + "&issuer=fleethawks"
      this.totpCode = code;
      this.generateQRCode(str);


    } catch (error) {
      this.mfaError = error;
    }
  }
  currentStatus = 'NOMFA';
  userTotpCode: string;
  totpSuccess = false;
  mfaStatus = '';
  async setupVerifyTOTPCode() {
    try {
      if (!this.userTotpCode || this.userTotpCode.toString() == '') {
        throw new Error("Verification code is required.");

      }
      this.mfaError = '';
      let user = await Auth.currentAuthenticatedUser();
      await Auth.verifyTotpToken(user, this.userTotpCode.toString())
      const result = await Auth.setPreferredMFA(user, 'TOTP');
      this.messageService.add({
        severity: "info",
        summary: "Confirmed",
        detail: "MFA has been enabled."
      });
      this.showMFA = false;
    } catch (error) {
      this.mfaError = error;
    }
  }


  /**
   * Generates QR Code for Apps
   * @param code returns QR Code image
   */
  generateQRCode(code: string) {
    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 1.0,
      margin: 1,

    }
    QRCode.toDataURL(code, opts, (err, url) => {
      if (err) throw err
      this.totpMFA = true
      this.qrcodeImage = url;


    })
  }

  /**
   * Disables the MFA
   */
  async disableMFA(event: Event) {
    try {
      this.confirmSvc.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          let user = await Auth.currentAuthenticatedUser();
          const result = await Auth.setPreferredMFA(user, 'NOMFA');

          this.messageService.add({
            severity: "info",
            summary: "Confirmed",
            detail: "MFA has been disabled."
          });
        },
        reject: () => {
          //reject action
        }
      });

    } catch (error) {
      this.mfaError = error;
    }

  }

  async getCurrentStatusMFA() {
    try {
      let user = await Auth.currentAuthenticatedUser();
      const result = await Auth.getPreferredMFA(user, { bypassCache: false })
      if (result && result === 'NOMFA') {
        this.currentStatus = "There is no MFA registered";
      } else if (result === 'SOFTWARE_TOKEN_MFA') {
        this.currentStatus = "Currently MFA is set to TOTP";
      }
    } catch (error) {
      this.mfaError = error;
    }
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


interface ISubscriptionInfo {
  name: string,
  activated_at: string;
  plan_code: string;
  last_billing_at: string;
  next_billing_at: string;
  amount: number
}
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ListService } from '../../services';
import { AuthService } from '../../services';
import { Role, User } from '../../models/objects';
import { Auth } from 'aws-amplify';
import { from, Subject, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { passwordStrength } from 'check-password-strength'
import { map } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "./../../../environments/environment";
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild("SignInModal", { static: true })
  SignInModal: TemplateRef<any>;

  userName: string = null;
  errors = {};
  email: string;
  password: string = null;
  response: any = '';
  hasError = false;
  Error = '';
  showSigupCode = true;
  signUpCode = '';
  error = '';
  fieldTextType: boolean;
  fieldTextType1: boolean;
  cpwdfieldTextType: boolean;

  referral: any = {
    name: '',
    company: '',
    email: '',
    phone: ''
  };
  submitDisabled = false;
  submitCarrierDisabled = false;
  passwordValidation = {
    upperCase: false,
    lowerCase: false,
    number: false,
    specialCharacters: false,
    length: false
  }
  firstName: any;
  lastName: any;
  newUserName: any;
  newPassword: any;
  phone: any;
  fax: any;
  newEmail: any;
  findingWay: any;
  confirmPassword: any;
  signInRef: any;
  showLogin = false;
  whiteListCarriers = environment.whiteListCarriers;
  ifMFA = false;
  loggedInUser;
  userTOTPCode;

  constructor(private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private listService: ListService,
    private routMgmtService: RouteManagementServiceService) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/Map-Dashboard']);
    } else {
      this.router.navigate(['/login']);
    }

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  /** Cognito user action */
  resendSignUpCode = async () => {
    try {
      await Auth.resendSignUp(this.userName);

    } catch (err) {
      this.hasError = true;
      this.error = `Error occured while sending code ${err}`;
      this.showSigupCode = true;
    }
  }

  /**
   * Login with Auth
   */

  async signIn() {
    this.hasError = false;
    this.submitDisabled = true;
    if (!this.authService.isTokenExpired) {
      this.router.navigate(['/Map-Dashboard']);
    }
    if ((this.userName) && (this.password)) {
      try {
        this.userName = this.userName.trim();
        let loginResponse = await Auth.signIn(this.userName, this.password);
        this.loggedInUser = loginResponse;
        if (
          loginResponse.challengeName === 'SMS_MFA' ||
          loginResponse.challengeName === 'SOFTWARE_TOKEN_MFA'
        ) {
          this.ifMFA = true;
        } else {
          await this.processPostLogin(loginResponse);
        }
      } catch (error) {
        this.submitDisabled = false;
        this.hasError = true;
        this.Error = error.message || 'Error during login';
      }

    } else {
      this.submitDisabled = false;
      this.hasError = true;
      this.Error = 'Username and password is required'

    }
    this.routMgmtService.resetAllCache();
  }

  /**
   * Validate MFA if enabled.
   */
  async validateMFA() {
    try {

      const loggedUser = await Auth.confirmSignIn(
        this.loggedInUser, // Return object from Auth.signIn()
        this.userTOTPCode, // Confirmation code
        'SOFTWARE_TOKEN_MFA' // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
      );
      await this.processPostLogin(loggedUser);
    }
    catch (error) {
      this.hasError = true;
      this.Error = error || 'Error during login';

    }
  }

  /** Cognito user action */
  processPostLogin = async (loginResponse) => {
    try {

      if (loginResponse) {
        const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
        const jwt = (await Auth.currentSession()).getIdToken().getJwtToken();
        const at = (await Auth.currentSession()).getAccessToken().getJwtToken();
        var decodedToken: any = jwt_decode(jwt);
        let allow = await this.apiService.checkIfUserActive();
        await this.apiService.checkAccess()
        if (!allow) {
          this.submitDisabled = false
          this.hasError = true;
          this.Error = this.userName + " is not Approved. Please contact support@fleethawks.com | +1 (855)208 7575"
          Auth.signOut();

          return
        }
        else {
          // check if customer subscribes any plan and if check carrier exist in our whitelist category like DOT. if not then throw an error
          let isAuthorize = false;
          if (decodedToken.subCustomerID && decodedToken.subCustomerID === 'NA') {
            if (this.whiteListCarriers.includes(decodedToken.carrierID)) {
              isAuthorize = true;
            } else {
              isAuthorize = false;
            }
          } else {
            isAuthorize = true;
          }
          if (!isAuthorize) {
            this.submitDisabled = false;
            Auth.signOut();
            localStorage.clear();
            this.hasError = true;
            this.Error = 'No valid subscriptions found. Please subscribe one of the plans or contact support@fleethawks.com';
          }
          let carrierID = await this.apiService.getCarrierID();
          localStorage.setItem('xfhCarrierId', carrierID);
          if (isActivatedUser.userRoles != "orgAdmin") {
            this.router.navigate(['/Map-Dashboard'])
            localStorage.setItem("subCompany", 'no')
          } else {
            this.apiService.getData(`carriers/${carrierID}`).subscribe((res) => {
              if (res.Items.length > 0) {
                if ('isProfileComplete' in res.Items[0]) {
                  if (res.Items[0].isProfileComplete) {
                    if (res.Items[0].subCompIDs && res.Items[0].subCompIDs.length > 0) {
                      this.router.navigate(['/organizations'])
                      localStorage.setItem("subCompany", 'yes')
                    } else {
                      this.router.navigate(['/Map-Dashboard'])
                      localStorage.setItem("subCompany", 'no')
                    }

                  } else {
                    this.router.navigate(['/onboard'])
                  }
                  localStorage.setItem("isProfileComplete", res.Items[0].isProfileComplete)
                } else {
                  if (res.Items[0].subCompIDs && res.Items[0].subCompIDs.length > 0) {
                    this.router.navigate(['/organizations'])
                    localStorage.setItem("subCompany", 'yes')
                  } else {
                    this.router.navigate(['/Map-Dashboard'])
                    localStorage.setItem("subCompany", 'no')
                  }
                }
              }
            })
          }

        }
        localStorage.setItem('congnitoAT', at);
        if (decodedToken.userType == 'driver') {
          this.submitDisabled = false;
          Auth.signOut();
          localStorage.clear();
          this.hasError = true;
          this.Error = 'You are not authorized to perform this action';

        } else {
          this.submitDisabled = false;
          localStorage.setItem('currentLoggedUserName', this.userName);

          if (!isActivatedUser.carrierID) {
            this.hasError = true;
            this.Error = 'Unable to find carrier information';
            localStorage.setItem('signOut', 'true'); //trigger flag
          } else {

            /**
             * For the Role Management
             * @type {{id: string; username: string; firstName: string; lastName: string; role: Role}}
             */
            const user: User = {
              id: '1',
              username: 'admin',
              firstName: 'Admin',
              lastName: 'User',
              role: Role.FleetManager
            };
            localStorage.setItem('LoggedIn', 'true');
            localStorage.setItem('signOut', 'false'); //trigger flag
            localStorage.setItem('accessToken', jwt);//save token in session storage
            // await this.router.navigate(['/Map-Dashboard']);

            this.listService.triggerModal('');
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      }
    } catch (err) {

      this.submitDisabled = false;
      this.hasError = true;
      this.Error = err.message || 'Error during login';
    }

  }
  // Show password
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
  togglecpwdfieldTextType() {
    this.cpwdfieldTextType = !this.cpwdfieldTextType;
  }
  submitConfirmationCode = async () => {
    if (this.signUpCode !== '') {
      await Auth.verifyCurrentUserAttributeSubmit('email', this.signUpCode);
    } else {
      this.Error = 'Invalid Sigup Code';
    }
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
      this.passwordValidation.length = true;
    } else {
      this.passwordValidation.length = false;


    }
    if (password.includes('.') || password.includes('-')) {
      this.passwordValidation.specialCharacters = true;
    }


  }

  onAddCarrier() {
    this.submitCarrierDisabled = true;
    const data: any = {
      entityType: 'carrier',
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.newUserName,
      password: this.newPassword,
      phone: this.phone,
      email: this.newEmail,
      fax: this.fax,
      findingWay: this.findingWay
    }
    if (this.findingWay == "Referral") {
      data.referral = this.referral
    }
    try {
      this.apiService.postData('carriers/onBoard', data).subscribe({
        complete: () => {

        },
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {

                // val.message = val.message.replace(/".*"/, 'This Field');
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {

                this.throwErrors();
                this.submitCarrierDisabled = false;
              },
              error: () => { },
              next: () => { this.submitCarrierDisabled = false; },
            });
        },
        next: (res) => {
          $('#signUpMessage').modal('show');
          this.cancel();
          this.submitCarrierDisabled = false;
          this.firstName = null;
          this.lastName = null;
          this.newUserName = null;
          this.newPassword = null;
          this.phone = null;
          this.fax = null;
          this.newEmail = null;
          this.findingWay = null;
          this.confirmPassword = null;
        }
      });
    } catch (error) {
      this.errors[error.context.key] = error.message;
    }

  }
  cancel() {
    $('#userSignUp').modal('hide');
  }
  throwErrors() {
    from(Object.keys(this.errors))
      .subscribe((v) => {
        if (v === 'userName' || v === 'email' || v === 'carrierName') {
          $('[name="' + v + '"]')
            .after('<label id="' + v + '-error" class="error" for="' + v + '">' + this.errors[v] + '</label>')
            .addClass('error');
        }
        if (v === 'cognito') {
          this.toaster.error(this.errors[v]);
        }
      });
  }

  openLogin() {
    this.showLogin = true;
  }


}

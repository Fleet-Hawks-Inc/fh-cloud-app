import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ListService } from '../../services';
import { AuthService } from '../../services';
import { Role, User } from '../../models/objects';
import { Auth } from 'aws-amplify';
import { from, Subject, throwError } from 'rxjs';
import jwt_decode from "jwt-decode";
import { passwordStrength } from 'check-password-strength'
import {map} from 'rxjs/operators'
import {ToastrService} from 'ngx-toastr'
import { RouteManagementServiceService } from 'src/app/services/route-management-service.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
  cpwdfieldTextType:boolean;

  referral:any={
    name:'',
    company:'',
    email:'',
    phone:''
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
  firstName:any;
  lastName:any;
  newUserName:any;
  newPassword:any;
  phone:any;
  fax:any;
  newEmail:any;
  findingWay:any;
confirmPassword:any;



  constructor(private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private toaster: ToastrService,
    private listService: ListService,
    private routMgmtService:RouteManagementServiceService) { }

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

  //   LoginAction() {
  //     this.hasError = false;

  //     const data = JSON.stringify({
  //       'userName': this.email,
  //       'password': this.password
  //     });
  //     this.apiService.getJwt('auth', data).
  //       subscribe({
  //         complete: () => { },
  //         error: (err) => {
  //           this.hasError = true;
  //           this.Error = err.error;

  //         },
  //         next: (res) => {
  //           const user: User = {
  //             id: '1',
  //             username: 'admin',
  //             firstName: 'Admin',
  //             lastName: 'User',
  //             role: Role.FleetManager
  //           };

  //           this.response = res;
  //           localStorage.setItem('jwt', this.response.jwt);
  //           localStorage.setItem('LoggedIn', 'true');
  //           /************set the role from server **********/
  //           localStorage.setItem('user', JSON.stringify(user));
  //           this.router.navigate(['/Map-Dashboard']);
  //         }
  //       });
  //   }
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

  /** Cognito user action */
  loginAction1 = async () => {
    this.submitDisabled = true;
    if (!this.authService.isTokenExpired) {
      this.router.navigate(['/Map-Dashboard']);
    }
    if ((this.userName) && (this.password)) {
      try {
        this.userName = this.userName.trim();
        let loginResponse=await Auth.signIn(this.userName, this.password);
        if(loginResponse){
        
        let allow=await this.apiService.checkIfUserActive();
        await this.apiService.checkAccess()
        if(!allow){
          this.submitDisabled=false
          this.hasError=true;
          this.Error=this.userName+" is not Approved. Please contact support@fleethawks.com | +1 (855)208 7575"
          Auth.signOut();
         
         return
        }
        else{
        let carrierID=await this.apiService.getCarrierID();

        this.apiService.getData(`carriers/${carrierID}`).subscribe((res)=>{
          if('isProfileComplete' in res.Items[0]){
            if(res.Items[0].isProfileComplete){

              this.router.navigate(['/Map-Dashboard'])
            }
            else{
              this.router.navigate(['/onboard'])
            }
            localStorage.setItem("isProfileComplete",res.Items[0].isProfileComplete)
          }else{
            this.router.navigate(['/Map-Dashboard'])
          }

        })
        }
        const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
        const jwt = (await Auth.currentSession()).getIdToken().getJwtToken();
        const at = (await Auth.currentSession()).getAccessToken().getJwtToken()
        localStorage.setItem('congnitoAT', at);
        var decodedToken:any = jwt_decode(jwt);

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
            await this.router.navigate(['/Map-Dashboard']);
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
    else {
      this.submitDisabled = false;
      this.hasError = true;
      this.Error = 'Username and password is required'

    }
    this.routMgmtService.resetAllCache();
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

  onAddCarrier(){
    this.submitCarrierDisabled = true;
    const data:any={
      entityType:'carrier',
      firstName:this.firstName,
      lastName:this.lastName,
      userName:this.newUserName,
      password:this.newPassword,
      phone:this.phone,
      email:this.newEmail,
      fax:this.fax,
      findingWay:this.findingWay
    }
    if(this.findingWay=="Referral"){
      data.referral=this.referral
    }
    try{
    this.apiService.postData('carriers/onBoard',data).subscribe({
      complete:()=>{

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
      next:(res)=>{
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
}
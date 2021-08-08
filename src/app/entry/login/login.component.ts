import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services';
import { AuthService } from '../../services';
import { Role, User } from '../../models/objects';
import { Auth } from 'aws-amplify';
import jwt_decode from "jwt-decode";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string = null;
  email: string;
  password: string = null;
  response: any = '';
  hasError = false;
  Error = '';
  showSigupCode = true;
  signUpCode = '';
  error = '';
  fieldTextType: boolean;
  submitDisabled = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private authService: AuthService) { }

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
        await Auth.signIn(this.userName, this.password);
        const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
        const jwt = (await Auth.currentSession()).getIdToken().getJwtToken();
        const at = (await Auth.currentSession()).getAccessToken().getJwtToken()
        localStorage.setItem('congnitoAT', at);
        var decodedToken = jwt_decode(jwt);

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
            localStorage.setItem('user', JSON.stringify(user));
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
  }
  submitConfirmationCode = async () => {
    if (this.signUpCode !== '') {
      await Auth.verifyCurrentUserAttributeSubmit('email', this.signUpCode);
    } else {
      this.Error = 'Invalid Sigup Code';
    }
  }
}
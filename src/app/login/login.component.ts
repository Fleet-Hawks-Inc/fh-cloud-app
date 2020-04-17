import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { AuthService } from "../auth.service";
import { CognitoUtility } from '../services/cognito.utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  response: any = '';
  hasError = false;
  error = '';
  showSigupCode = false;

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cognitoUtility: CognitoUtility) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/Dashboard']);
    }
  }

  /** Cognito user action */
  resendSignUpCode = async () => {
    try {
      await this.cognitoUtility.resendSignUpCode(this.email);
      this.showSigupCode = false;
    } catch (err) {
      this.hasError = true;
      this.error = `Error occured while sending code ${err}`;
      this.showSigupCode = true;
    }

  }
  /** Cognito user action */
  loginAction1 = async () => {
    try {
      const signInResponse = await this.cognitoUtility.signInUser(this.email, this.password);
      console.log(signInResponse);
      this.response = signInResponse;
      localStorage.setItem('jwt', this.response.jwt);
      localStorage.setItem('LoggedIn', 'true');
      this.router.navigate(['/Dashboard']);
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        this.hasError = true;
        this.error = 'User is not Confirmed';
        this.showSigupCode = true;
      } else if (err.code === 'PasswordResetRequiredException') {
        this.hasError = true;
        this.error = 'Please reset your password';
      } else if (err.code === 'NotAuthorizedException') {
        this.hasError = true;
        this.error = 'Incorrect Password';
      } else if (err.code === 'UserNotFoundException') {
        this.hasError = true;
        this.error = 'User does not exist\'s';
      } else {
        console.log(err);
      }

    }

  }
  loginAction() {
    this.hasError = false;
    const data = JSON.stringify({
      'userName': this.email,
      'password': this.password
    });
    this.apiService.getJwt('auth', data).
      subscribe({
        complete: () => { },
        error: (err) => {
          this.hasError = true;
          this.error = err.error;
          console.log(this.error);
          // console.log("clickes");
        },
        next: (res) => {
          this.response = res;
          localStorage.setItem('jwt', this.response.jwt);
          localStorage.setItem('LoggedIn', 'true');
          this.router.navigate(['/Dashboard']);
        }
      });
  }

}

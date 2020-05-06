import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Auth } from 'aws-amplify';
import { ApiService } from "../api.service";

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
  showSigupCode = true;
  signUpCode = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router) { }

  ngOnInit() {

  }

  /** Cognito user action */
  resendSignUpCode = async () => {
    try {
      await Auth.resendSignUp(this.email);

    } catch (err) {
      this.hasError = true;
      this.error = `Error occured while sending code ${err}`;
      this.showSigupCode = true;
    }

  }
  /** Cognito user action */
  loginAction1 = async () => {
    try {

      await Auth.signIn(this.email, this.password);
      const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
      if (!isActivatedUser.carrier_id) {
        this.hasError = true;
        this.error = 'User has not active devices';

      } else {
        localStorage.setItem('LoggedIn', 'true');
        await this.router.navigate(['/Dashboard']);
      }
    } catch (err) {


      this.hasError = true;
      this.error = err.message || 'Error during login';
    }

  }
  submitConfirmationCode = async () => {
    if (this.signUpCode !== '') {
      await Auth.verifyCurrentUserAttributeSubmit('email', this.signUpCode);
    } else {
      this.error = 'Invalid Sigup Code';
    }
  }

  // loginAction() {
  //   this.hasError = false;
  //   const data = JSON.stringify({
  //     'userName': this.email,
  //     'password': this.password
  //   });
  //   this.apiService.getJwt('auth', data).
  //     subscribe({
  //       complete: () => { },
  //       error: (err) => {
  //         this.hasError = true;
  //         this.error = err.error;
  //         console.log(this.error);
  //         // console.log("clickes");
  //       },
  //       next: (res) => {
  //         this.response = res;
  //         localStorage.setItem('jwt', this.response.jwt);
  //         localStorage.setItem('LoggedIn', 'true');
  //         this.router.navigate(['/Dashboard']);
  //       }
  //     });
  // }

}

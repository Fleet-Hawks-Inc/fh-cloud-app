import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services';
import {AuthService} from '../../services';
import {Role, User} from '../../models/objects';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string;
  email: string;
  password: string;
  response: any = '';
  hasError  = false;
  Error = '';
  showSigupCode = true;
  signUpCode = '';
  error  = '';

  constructor(private apiService: ApiService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/Map-Dashboard']);
    }
  }

  LoginAction() {
    this.hasError = false;
    const data = JSON.stringify({'userName': this.email ,
      'password': this.password });
    this.apiService.getJwt('auth', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
        console.log(this.Error);
       // console.log("clickes");
      },
      next: (res) => {
        const user: User =   { id: '1',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          role: Role.FleetManager };

        this.response = res;
        localStorage.setItem('jwt', this.response.jwt);
        localStorage.setItem('LoggedIn', 'true');
        /************set the role from server **********/
        localStorage.setItem('user', JSON.stringify(user) );
        this.router.navigate(['/Map-Dashboard']);
      }
    });
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
  /** Cognito user action */
  loginAction1 = async () => {
    try {
      // This should go in Register component
      // await Auth.signUp({
      //   password: this.password,
      //   username: this.userName,
      //   attributes: {
      //     email: 'kunal@fleethawks.com',
      //     phone_number: '+919860766659'
      //   }
      // });
      await Auth.signIn(this.userName, this.password);
      const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
      // if (!isActivatedUser.carrierID) {
      if (!isActivatedUser.carrierID) {
        this.hasError = true;
        this.Error = 'User has not active devices';

      } else {
        console.log('user logged In');

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
        localStorage.setItem('user', JSON.stringify(user));



        /**
         * set local and redirect
         **/
        localStorage.setItem('LoggedIn', 'true');
        await this.router.navigate(['/Map-Dashboard']);
      }
    } catch (err) {


      this.hasError = true;
      this.Error = err.message || 'Error during login';
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

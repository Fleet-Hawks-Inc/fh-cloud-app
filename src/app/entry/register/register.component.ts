import { Component, OnInit } from '@angular/core';
import {Auth} from 'aws-amplify';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  password = '';
  username = '';
  email = '';
  phone_number = '';
  error : string = '';
  Error: string = '';
  showSigupCode = true;
  signUpCode = '';
  hasError ;

  constructor() { }

  ngOnInit() {
  }


  register = async () => {
    try {
      // This should go in Register component
      await Auth.signUp({
        password: this.password,
        username: this.username ,
        attributes: {
          email: this.email,
          phone_number: this.phone_number
        }
      });

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

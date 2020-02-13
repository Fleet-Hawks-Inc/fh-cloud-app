import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  response : any ='';
  hasError : boolean = false;
  Error : string = '';
  constructor(private apiService: ApiService,
              private router: Router,
  private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/Dashboard']);
    }
  }

  LoginAction() {
    this.hasError = false;

    const data = {'userName': this.email ,
      'password': this.password };
    this.apiService.postData('auth', data).
    subscribe({
      complete : () => {},
      error : (err) => {
        this.hasError = true;
        this.Error = err.error;
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

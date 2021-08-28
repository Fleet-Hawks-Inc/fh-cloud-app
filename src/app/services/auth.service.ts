import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private readonly router: Router) { }

  /**
   * this is used to clear anything that needs to be removed
   */
  clear(): void {
    localStorage.clear();
  }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthenticated();
  }

  public isAuthenticated = () => {
    return Auth.currentAuthenticatedUser().then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  // simulate jwt token is valid
  public isTokenExpired(): boolean {
    let token = localStorage.getItem('accessToken');
    let decodedToken = jwt_decode(token);
    let tokenExpiry = decodedToken.exp;
    let currentTimestamp = new Date().getTime();
    if(tokenExpiry < currentTimestamp) {
      return true;
    } else {
      return false;
    }
  }

  loginAdmin(): void {

    this.router.navigate(['/Dashboard']);
  }

  login(): void {

    this.router.navigate(['/Dashboard']);

  }

  /**
   * this is used to clear local storage and also the route to login
   */
  logout(): void {
    this.clear();
    this.router.navigate(['/Login']);
  }

}

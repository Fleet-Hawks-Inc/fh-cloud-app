import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/index';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoGuardService implements CanActivate {

  constructor(private __authService: AuthService,
              private _router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.__authService.isAuthenticated()) {
      return true;
    }

    // navigate to login page
    this._router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}

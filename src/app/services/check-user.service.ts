import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckUserService {

  constructor(private readonly router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess();
  }

  public canAccess = async () => {
    const isActivatedUser = (await Auth.currentSession()).getIdToken().payload;
    let isCarrierID = localStorage.getItem('carrierID')
    if(isActivatedUser.userType == 'Cloud Admin' && isCarrierID == undefined && !isCarrierID) {
      this.router.navigate(['/carriers']);
      return false
    } else {
      
      return true
    }
  }
}

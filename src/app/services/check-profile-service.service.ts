import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckProfileServiceService {

  constructor(private readonly router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess();
  }
  public canAccess=()=>{
    if(localStorage.getItem("isProfileComplete")){
    let isProfileComplete=localStorage.getItem("isProfileComplete")
    
    if(isProfileComplete=="true"){
      
      return true;
    }
    else{
      
      return false;
    }
  }
  else{
    return true
  }
}

}

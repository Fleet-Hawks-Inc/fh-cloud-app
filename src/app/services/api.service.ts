import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from 'aws-amplify';
import { EMPTY, from } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators';
import { NGX_LOADING_BAR_IGNORED } from '@ngx-loading-bar/http-client';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public jwt = '';
  public jwtDecoded;
  public carrierID = '';
  public BaseUrl = environment.BaseUrl;
  public AssetUrl = environment.AssetURL;
  public AccountService = environment.AccountServiceUrl;
  public isUserRoles = environment.isUserRoles
  private httpOptions;

  private httpOptionsOld = {
    headers: new HttpHeaders({
      'Accept': 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    responseType: 'text'
  };


  constructor(private http: HttpClient) {
    this.jwt = localStorage.getItem('jwt');
    //
    // from(Auth.currentSession())
    //     .pipe(
    //         switchMap((auth: any) => { // switchMap() is used instead of map().
    //
    //           const jwt = auth.accessToken.jwtToken;
    //           // this.httpOptions = {
    //           //   headers: new HttpHeaders({
    //           //     'Authorization': `Bearer ${jwt}`,
    //           //     'Content-Type': 'application/json'
    //           //   })
    //           // }
    //         })
    //     ).subscribe();


  }

  getJwt(url: string, data) {
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.BaseUrl + url, data, this.httpOptions);

  }


  postData(url: string, data, formData: boolean = false) {
    let headers: object;
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    if (formData) {
      headers = { headers: new HttpHeaders({ 'x-fleethawks-carrier-id': selectedCarrier }) }
    }
    else {
      headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-fleethawks-carrier-id': selectedCarrier }) };
    }

    return this.http.post(this.BaseUrl + url, data, headers);

  }

  putData(url: string, data, formData: boolean = false) {
    let headers: object;
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    if (formData) {
      headers = { headers: new HttpHeaders({ 'x-fleethawks-carrier-id': selectedCarrier }) };
    }
    else {
      headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-fleethawks-carrier-id': selectedCarrier }) };
    }

    return this.http.put<any>(this.BaseUrl + url, data, headers);

  }
  getData(url: string, ignoreLoadingBar = false) {
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    let isCarrier = localStorage.getItem('carrierID') != null ? localStorage.getItem('carrierID') : '';
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'fh-carrier-id': isCarrier, 'x-fleethawks-carrier-id': selectedCarrier })
    };
    if (ignoreLoadingBar === true) {
      options['context'] = new HttpContext().set(NGX_LOADING_BAR_IGNORED, true)
    }
    return this.http.get<any>(this.BaseUrl + url, options);
  }

  deleteData(url: string) {
    // this.getHeaders();
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-fleethawks-carrier-id': selectedCarrier })
    };
    return this.http.delete<any>(this.BaseUrl + url, headers);
  }


  getHeaders() {
    from(Auth.currentSession())
      .pipe(
        switchMap((auth: any) => { // switchMap() is used instead of map().

          const jwt = auth.accessToken.jwtToken;

          this.httpOptions = {
            headers: new HttpHeaders({
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            })
          };
          return EMPTY;

        })
      ).subscribe();
  }

  /*
    * Getting CarrierId from current LoggedIn User
  */
  getCarrierID = async () => {
    try {
      const response: any = await Auth.currentSession();
      if (response) {
        return response.idToken.payload.carrierID;
      } else {
        return undefined;
      }

    } catch (error) {
      return undefined;

    }
  }

  checkIfUserActive = async () => {
    try {
      const response: any = await Auth.currentSession();
      if (response) {

        if (response.idToken.payload.isUserActive == 0) {
          return false
        }
        else {
          return true
        }
      }
    } catch (error) {
      return false

    }

  }

  async checkAccess() {
    if (this.isUserRoles) {
      const user = (await Auth.currentSession()).getIdToken().payload;
      console.log(user.userRoles)
      user.userRoles = user.userRoles.split(',')

      if (user.userRoles.includes("orgAdmin") || user.userRoles.includes("role_view_admin") || user.userRoles.includes("role_super_admin")) {
        localStorage.setItem("isDispatchEnabled", "true")
        localStorage.setItem("isComplianceEnabled", "false")
        localStorage.setItem("isSafetyEnabled", "true")
        localStorage.setItem("isAccountsEnabled", "true")
        localStorage.setItem("isManageEnabled", "true")
        localStorage.setItem("isAddressBook", "true")
        localStorage.setItem("isOrderPriceEnabled", "true")
        return
      }
      localStorage.setItem("isAddressBook", "false")
      localStorage.setItem("isOrderPriceEnabled", "false")

      if (user.userRoles.includes("role_safety")) {
        localStorage.setItem("isComplianceEnabled", "false")
        localStorage.setItem("isSafetyEnabled", "true")
      }
      if (user.userRoles.includes("role_dispatch")) {
        localStorage.setItem("isDispatchEnabled", "true")
      }
      if (user.userRoles.includes("role_accounts")) {
        localStorage.setItem("isAccountsEnabled", "true")
      }
      if (user.userRoles.includes("role_address_book")) {
        localStorage.setItem("isAddressBook", "true")
      }
      if (user.userRoles.includes("role_order_price")) {
        localStorage.setItem("isOrderPriceEnabled", "true")
      }

    }
    else {
      localStorage.setItem("isDispatchEnabled", "true")
      localStorage.setItem("isComplianceEnabled", "false")
      localStorage.setItem("isSafetyEnabled", "true")
      localStorage.setItem("isAccountsEnabled", "true")
      localStorage.setItem("isManageEnabled", "true")
      localStorage.setItem("isAddressBook", "true")
    }
    // switch(true){
    //   case user.userRoles.includes("role_safety"):
    //     environment.isSafetyEnabled= true;
    //     environment.isComplianceEnabled=true;
    //     break;
    //   case user.userRoles.includes("role_dispatch"):
    //     environment.isDispatchEnabled= true;
    //     break;
    //   case user.userRoles.includes("role_accounts"):
    //     environment.isAccountsEnabled=true;
    //     break;
    //       }
  }
  getDatatablePostData(url: string, data) {
    // this.getHeaders();
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    return this.http.post(this.BaseUrl + url, data, headers);

  }

  getCarrierUserName() {
    return localStorage.getItem('currentLoggedUserName')
  }
}

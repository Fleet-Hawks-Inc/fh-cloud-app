import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Auth } from 'aws-amplify';
import {EMPTY, from} from 'rxjs';
import {switchMap} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  public jwt = '';
  
  public safetyServiceUrl = environment.SafetyServiceUrl;
  private httpOptions;

  constructor(private http: HttpClient) {
    this.jwt = localStorage.getItem('jwt');
   }

  getJwt(url: string, data) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post(this.safetyServiceUrl + url , data , this.httpOptions);

  }

  postData(url: string, data, formData: boolean = false) {
    let headers: object;
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    if (formData) {
      headers = { headers: new HttpHeaders({'x-fleethawks-carrier-id': selectedCarrier }) }
    }
    else {
      headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-fleethawks-carrier-id': selectedCarrier }) };
    }
    
    return this.http.post(this.safetyServiceUrl + url , data , headers);

  }

  putData(url: string, data, formData: boolean = false) {
    let headers: object;
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    if (formData) {
      headers = { headers: new HttpHeaders({'x-fleethawks-carrier-id': selectedCarrier }) };
    }
    else {
      headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-fleethawks-carrier-id': selectedCarrier }) };
    }

    return this.http.put<any>(this.safetyServiceUrl + url , data , headers);

  }
  getData(url: string) {
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    let isCarrier = localStorage.getItem('carrierID') !=null ? localStorage.getItem('carrierID') : '';
    let selectedCarrier = localStorage.getItem('xfhCarrierId') != null ? localStorage.getItem('xfhCarrierId') : '';
    const headers = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'fh-carrier-id': isCarrier, 'x-fleethawks-carrier-id': selectedCarrier })
    };
    
    return this.http.get<any>(this.safetyServiceUrl + url , headers);
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
    return this.http.delete<any>(this.safetyServiceUrl + url , headers);
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

  getDatatablePostData(url: string, data) {
    // this.getHeaders();
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    return this.http.post(this.safetyServiceUrl + url , data , headers);

  }
}

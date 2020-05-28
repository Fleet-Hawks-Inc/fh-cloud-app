import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import { Auth } from 'aws-amplify';
import {from} from "rxjs/index";
import {catchError, map, switchMap} from "rxjs/internal/operators";
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public jwt = '';
  public jwtDecoded;
  public carrierID = '';
  public BaseUrl = environment.BaseUrl;
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
    console.log('auth session');
    console.log(Auth.currentSession());
    // from(Auth.currentSession())
    //     .pipe(
    //         switchMap((auth: any) => { // switchMap() is used instead of map().
    //           //console.log(auth);
    //           console.log(auth);
    //           const jwt = auth.accessToken.jwtToken;
    //           // this.httpOptions = {
    //           //   headers: new HttpHeaders({
    //           //     'Authorization': `Bearer ${jwt}`,
    //           //     'Content-Type': 'application/json'
    //           //   })
    //           // }
    //         })
    //     ).subscribe();



    from(Auth.currentSession())
        .pipe(
            map((auth: any) => { // switchMap() is used instead of map().
              console.log('auth');
              console.log(auth);

              const jwt = auth.accessToken.jwtToken;
              //console.log('jwt' , jwt);
              this.httpOptions = {
                          headers: new HttpHeaders({
                            'Authorization': `Bearer ${jwt}`,
                            'Content-Type': 'application/json'
                          })
                        };

            })
        ).subscribe();




  }

  getJwt(url: string, data) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post(this.BaseUrl + url , data , headers);

  }


  postData(url: string, data) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
      'x-auth-token': this.jwt})
    };
    return this.http.post(this.BaseUrl + url , data , this.httpOptions);

  }

  putData(url: string, data) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
      'x-auth-token': this.jwt})
    };
    return this.http.put<any>(this.BaseUrl + url , data , this.httpOptions);

  }
  getData(url: string) {
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    console.log(this.httpOptions);
    return this.http.get<any>(this.BaseUrl + url , this.httpOptions);
  }

  deleteData(url: string) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
      'x-auth-token': this.jwt})
    };
    return this.http.delete<any>(this.BaseUrl + url , this.httpOptions);
  }





}

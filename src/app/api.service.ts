import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public jwt = '';
  public jwtDecoded;
  public carrierID = '';
  public BaseUrl = environment.BaseUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    responseType: 'text'
  };
  constructor(private http: HttpClient) {
    this.jwt = localStorage.getItem('jwt');
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
    return this.http.post(this.BaseUrl + url , data , headers);

  }

  putData(url: string, data) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
      'x-auth-token': this.jwt})
    };
    return this.http.put<any>(this.BaseUrl + url , data , headers);

  }

  getData(url: string) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
      'x-auth-token': this.jwt})
    };
    return this.http.get<any>(this.BaseUrl + url , headers);
  }

  deleteData(url: string) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
      'x-auth-token': this.jwt})
    };
    return this.http.delete<any>(this.BaseUrl + url , headers);
  }





}

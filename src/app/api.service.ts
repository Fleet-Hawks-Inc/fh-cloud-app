import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public jwt = '';
  public jwtDecoded;
  public carrierID = '';
  public BaseUrl = environment.BaseUrl;

  constructor(private readonly http: HttpClient) {

  }

  postData(url: string, data) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.BaseUrl + url, data, headers);
  }

  putData(url: string, data) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<any>(this.BaseUrl + url, data, headers);

  }

  getData(url: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(this.BaseUrl + url, headers);
  }

  deleteData(url: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': this.jwt
      })
    };
    return this.http.delete<any>(this.BaseUrl + url, headers);
  }

}

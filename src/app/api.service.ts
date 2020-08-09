import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import { Auth } from 'aws-amplify';
import {EMPTY, from} from 'rxjs/index';
import {catchError, map, switchMap} from 'rxjs/internal/operators';
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
   // console.log('auth session');
   // console.log(Auth.currentSession());
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


  }

  getJwt(url: string, data) {
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post(this.BaseUrl + url , data , this.httpOptions);

  }


  postData(url: string, data) {
    // this.getHeaders();
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    'Authorization':'Bearer eyJraWQiOiJTckFiVlJZREp1RHF1SUxueHBvd2JcLzI3K1NWeVAwbkdXWkFYWDZlZ3hRWT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4N2Y3MDkxNy1lNTBhLTRjNGEtYjViNC1lMzZhMDNlNDI0NGYiLCJldmVudF9pZCI6ImE5ZmQ5NmE0LTgyMzUtNDliNi04MTA0LWIwZDViZjhlODE4NSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1OTY2MTEyODUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0yX2VHRGdGS0tNNyIsImV4cCI6MTU5NjYxNDg4NSwiaWF0IjoxNTk2NjExMjg2LCJqdGkiOiI4MjE1ZjUwNS00NzAyLTRhZDktOWE2Ni01MGFlNDQzMTRjODIiLCJjbGllbnRfaWQiOiI3Nmw4OGcyODl2Y2dyZDhqZjU0cGJlZGdxcSIsInVzZXJuYW1lIjoicGFyYW0ifQ.UYRbGefnlXJX7opqnE0VHqD5RhmN8Oe5bqoSoXtmhEl5XQHproanBLEqmzzPyWrQ7qjknOgsf8fmRCnkCCUHscL4U1OA6kXW-3liOjvyvrfjIS3xCsV6AT9umRM9g4ToLRA7Mu55mQA39BABAnjn6q6avfmJeGE-yqdd49wWxgrh82lu7YO--bCUJITbxcWfk1Dr1gWlrnRIbXS84QwT_QKTKCzSJKXlLHqvjxi0irfEgxM5YlB5N8EAbhyueRTz2YrgE5vhCDMSzIAySKFKXeWQmUQU2E0Kc30h7CD1Ne-ta7Av2tp7dBQIuAxH4tS863LIJuR13AFpaQnliDKm4A'})
 };
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    return this.http.post(this.BaseUrl + url, data, headers);

  }

  putData(url: string, data) {
    // this.getHeaders();
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    return this.http.put<any>(this.BaseUrl + url , data , headers);

  }
  getData(url: string) {
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get<any>(this.BaseUrl + url , headers);
  }

  deleteData(url: string) {
    // this.getHeaders();
    // const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    //   'x-auth-token': this.jwt})
    // };
    const headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.delete<any>(this.BaseUrl + url , headers);
  }


  getHeaders() {
    from(Auth.currentSession())
        .pipe(
            switchMap((auth: any) => { // switchMap() is used instead of map().
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
              return EMPTY;

            })
        ).subscribe();
  }




}

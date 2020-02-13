import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BaseUrl} from "../objects/objects";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public jwt = '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    responseType: 'text'
  };
  constructor(private http: HttpClient) {}

  postData(url: string, data) {
    let headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/json',
    'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBmbGVldGhhd2tzLmNvbSIsImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InRlc3RsYXN0IiwidXNlclR5cGUiOiJBRE1JTiIsImNhcnJpZXJJRCI6ImZsZWV0LWhhd2tzIiwiY3VycmVudFN0YXR1cyI6ImRjIiwidXNlclByaXZpbGVnZXMiOnsidXNlck1hbmFnZW1lbnQiOnRydWUsImFkZFVzZXIiOnRydWV9LCJpYXQiOjE1ODA3MzY3Nzd9.zUhjMtlOuffP72RPhwq2j9TS2OlHu0VRkeeBuZ6vsoA'})
    };
    return this.http.post(BaseUrl + url , data , headers);

  }
}

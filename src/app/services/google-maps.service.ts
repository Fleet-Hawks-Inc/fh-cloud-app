import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private readonly apiKey = environment.googleConfig.apiKey;
  public pcMiles = new BehaviorSubject(false);
  // public pcMiles$ = this.pcMiles.asObservable();
  
  constructor(private http: HttpClient) { }

  googleDistance(origin, destination) {
    let headers = new HttpHeaders();
    headers = headers.set(
      'Content-Type', 'application/json, charset=utf-8',
    );
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': '*',
    //   'dataType': 'jsonp',
    // });

    const URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    return this.http.post(URL + '?units=imperial&origins=' + origin + '&destinations=' + destination + '&key=' + this.apiKey, headers)
    .pipe(map(res => {
      console.log('google res', res);
      return res;
    }))
    
  }

  pcMilesDistance(stops){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: '73DBE97231D737488E722DDFB8D1D0BB'
    });
    const URL = "https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/route/routeReports?authToken=73DBE97231D737488E722DDFB8D1D0BB";
    return this.http.get(URL + '&stops=' + stops + '&reports=CalcMiles').pipe(map(res => {
      return res[0].TMiles;
    }))
    
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {} from "googlemaps";
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private readonly apiKey = environment.googleConfig.apiKey;
  public pcMiles = new BehaviorSubject(false);
  // public pcMiles$ = this.pcMiles.asObservable();
  
  constructor(private http: HttpClient) { }

googleDistance(origin, destination) {
  const matrix = new google.maps.DistanceMatrixService();
 
  return new Promise((resolve, reject) => {matrix.getDistanceMatrix({
    origins: [new google.maps.LatLng(25.7694708, -80.259947)],
    destinations: [new google.maps.LatLng(25.768915, -80.254659)],
    travelMode: google.maps.TravelMode.DRIVING,
  }, function(response, status) {
    console.log(response);
    resolve(response);
  })});
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

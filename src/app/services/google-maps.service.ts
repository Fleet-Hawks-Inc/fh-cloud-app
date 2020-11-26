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
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': 'Bearer eyJraWQiOiJ3SEx5UVBQd1NhdjlhRTlJWnlkaHVkc0ZwR0RHOTl3ZFRJWUxSMWNGTlUwPSIsImFsZyI6IlJTMjU2In0.eyJsYXN0TmFtZSI6IkJodWxsbGFyIiwic3ViIjoiODdmNzA5MTctZTUwYS00YzRhLWI1YjQtZTM2YTAzZTQyNDRmIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9lR0RnRktLTTciLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjb2duaXRvOnVzZXJuYW1lIjoicGFyYW0iLCJmaXJzdE5hbWUiOiJQYXJhbWJpciIsImF1ZCI6Ijc2bDg4ZzI4OXZjZ3JkOGpmNTRwYmVkZ3FxIiwiZXZlbnRfaWQiOiI5ZTdmMjRmYy1jMmMxLTQ0N2ItODUxYy00YjAxZWVjYTI2ZTciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYwMzA3OTQxNywicGhvbmVfbnVtYmVyIjoiKzkxOTg2MDc2NjY1OSIsInVzZXJUeXBlIjoiQ2xvdWQgQWRtaW4iLCJjYXJyaWVySUQiOiJkYmNmMzRiMC01YzQ1LTExZWEtODNhOS1kM2MzZDcwZWM5ZGEiLCJleHAiOjE2MDM4OTIwOTMsImlhdCI6MTYwMzg4ODQ5MywiZW1haWwiOiJwYXJhbUBmbGVldGhhd2tzLmNvbSJ9.YMrMFE005yGwHlX9yuI1iNrWCpVc97-a_con0V77pWVBctU6R0PjDagArXrXiHmSp34CBdpq1eM8sq4WoYg2xMn4NzO-E39T711M6i7jcQU9PXTgcM1aKkzIvEm-gT7mbRjDVdN4X35aT69iL0PyiKXlegV4Oz-3cIBVWQc8PjVfy004ZyayRKoF29zVTVcbNHvkzmMfRpcrskJdR_G4KKx8pQShN3EnEaGN0oH1jewvZcsDgNE17aBXgjVT4jEOCikH-qYEOfdUZ7fPeLEwlRyDjGwcxI0UGGcLC2LnuCUglv15dTwHec7h7qv2KJvw7JuIJxMnzSsaONP8XRJ0YA'}
    );

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

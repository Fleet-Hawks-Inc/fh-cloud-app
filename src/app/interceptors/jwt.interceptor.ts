import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


/**
 * This will append jwt token for the http requests.
 *
 * @export
 * @class JwtInterceptor
 * @implements {HttpInterceptor}
 */
const whiteListedUrls = [
  'countries',
  'states/country/',
  'cities/state/',
  'carriers/add',
  'carriers/onBoard',
  'pcMiles/onboard/suggestions/'];
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  headers;
  withRequest;
  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // let arr = request.url.split('/');

    // if((arr[5] == 'countries' || arr[5] == 'states' || arr[5] == 'cities') && request.method != 'POST') return next.handle(request);
    // if(arr[5] == 'carriers' && request.method == 'POST') return next.handle(request);
    for (let i = 0; i < whiteListedUrls.length; i++) {
      if (request.url.includes(whiteListedUrls[i])) {
        return next.handle(request);
      }
    }
    return from(Auth.currentSession())
      .pipe(
        switchMap((auth: any) => { // switchMap() is used instead of map().

          const jwt = auth.accessToken.jwtToken;
          let isCarrier = localStorage.getItem('carrierID') != null ? localStorage.getItem('carrierID') : '';
          const withAuthRequest = request.clone({
            setHeaders: {
              //'Content-Type': 'application/json',  //API Service decides the type
              Authorization: `Bearer ${jwt}`,
              'fh-carrier-id': isCarrier
            }
          });
          return next.handle(withAuthRequest);
        })
      );
  }
}


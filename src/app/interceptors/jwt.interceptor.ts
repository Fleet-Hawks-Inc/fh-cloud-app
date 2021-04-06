import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../services/google-maps.service';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * This will append jwt token for the http requests.
 *
 * @export
 * @class JwtInterceptor
 * @implements {HttpInterceptor}
 */
const whiteListedUrls = ['carriers/carrierIDFromName/',
  'countries',
  'states/country/',
  'cities/state/',
  'carriers/onboard/',
  'carriers/get/list'];
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  headers;
  withRequest;
  constructor(private router: Router, private googleMap: GoogleMapsService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    for (let i = 0; i < whiteListedUrls.length; i++) {
      if (request.url.includes(whiteListedUrls[i])) {
        return next.handle(request);
      }
    }

    return from(Auth.currentSession()).pipe(
      switchMap((auth: any) => {
        // switchMap() is used instead of map().

        const jwt = auth.accessToken.jwtToken;
        let isCarrier =
          localStorage.getItem('carrierID') != null
            ? localStorage.getItem('carrierID')
            : '';
        const withAuthRequest = request.clone({
          setHeaders: {
            //'Content-Type': 'application/json',  //API Service decides the type
            Authorization: this.googleMap.pcMiles.value
              ? '73DBE97231D737488E722DDFB8D1D0BB'
              : `Bearer ${jwt}`,
            'fh-carrier-id': isCarrier,
          },
        });
        this.googleMap.pcMiles.next(false);
        return next.handle(withAuthRequest);
      })
    );
  }
}

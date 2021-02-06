import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import {Router} from '@angular/router';
import {GoogleMapsService} from '../services/google-maps.service';

import {EMPTY, from, Observable, throwError} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';


/**
 * This will append jwt token for the http requests.
 *
 * @export
 * @class JwtInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    headers;
    withRequest;
    constructor(private router: Router, private googleMap: GoogleMapsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        return from(Auth.currentSession())
            .pipe(
                switchMap((auth: any) => { // switchMap() is used instead of map().
                  
                    const jwt = auth.accessToken.jwtToken;
                    const withAuthRequest = request.clone({
                        setHeaders: {
                            //'Content-Type': 'application/json',  //API Service decides the type
                            Authorization: (this.googleMap.pcMiles.value) ? '73DBE97231D737488E722DDFB8D1D0BB' : `Bearer ${jwt}`
                        }
                    });
                    this.googleMap.pcMiles.next(false);
                    return next.handle(withAuthRequest);
                }),
                catchError((e: any) =>{
                    return next.handle(request);
                }),
            );
    }
}


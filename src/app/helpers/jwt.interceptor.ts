import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

import { from, Observable } from 'rxjs';
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

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return from(Auth.currentSession())
            .pipe(
                switchMap((auth: any) => { // switchMap() is used instead of map().
                    console.log(auth);
                    const jwt = auth.accessToken.jwtToken;

                    const withAuthRequest = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${jwt}`
                        }
                    });
                    console.log('JST', jwt);
                    console.log('Cloned', withAuthRequest);
                    return next.handle(withAuthRequest);
                }),
                catchError((err) => {
                    console.log('Error ', err);
                    return next.handle(request);
                })
            );

    }

}
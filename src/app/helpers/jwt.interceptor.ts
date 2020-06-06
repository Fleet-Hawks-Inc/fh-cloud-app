import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

import {EMPTY, from, Observable} from 'rxjs';
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
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return from(Auth.currentSession())
            .pipe(
                switchMap((auth: any) => { // switchMap() is used instead of map().
                    //console.log(auth);
                    const jwt = auth.accessToken.jwtToken;
                    console.log(auth);

                    const withAuthRequest = request.clone({
                        setHeaders: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${jwt}`
                        }
                    });

                    // const withAuthRequest = request.clone({
                    //     headers: request.headers.set('Authorization', `Bearer ${jwt}`),
                    // });

                    //console.log('JST', jwt);
                    console.log('Cloned', withAuthRequest);
                    //return next.handle(withAuthRequest);

                    return false;
                })
                // ,
                // catchError((err) => {
                //     console.log('Error ', err);
                //     //return EMPTY;
                //     return next.handle(request);
                // })
            );



        // from(Auth.currentSession())
        //     .pipe(
        //         switchMap((auth: any) => { // switchMap() is used instead of map().
        //             console.log(auth);
        //             const jwt = auth.accessToken.jwtToken;
        //             console.log("auth from jwt ntercepter" + jwt);
        //
        //             const withAuthRequest = request.clone({
        //                 setHeaders: {
        //                     Authorization: `Bearer ${jwt}`
        //                 }
        //             });
        //             this.headers = {
        //                 setHeaders: {
        //                     Authorization: `Bearer ${jwt}`
        //                 }
        //             };
        //
        //             console.log('JST', jwt);
        //             console.log('Cloned', withAuthRequest);
        //             //return next.handle(withAuthRequest);
        //         })
        //         // ,
        //         // catchError((err) => {
        //         //     console.log('Error ', err);
        //         //     return next.handle(request);
        //         // })
        //     );
        //
        //
        // console.log('request reached');
        // this.withRequest = request.clone(this.headers);
        //
        // return next.handle(request).pipe(
        //     map((event: HttpEvent<any>) => {
        //         if (event instanceof HttpResponse) {
        //             console.log('event--->>>', event);
        //         }
        //         return event;
        //     }));

        // return next.handle(this.withRequest);

    }



}


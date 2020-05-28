import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Auth } from 'aws-amplify';


/**
 * This is used to logout the user, when the server responds with an unathorized status code.
 * Especially when the session token expires
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor() { }

    /**
     * Intercepter intercepts the responses, and then process based on the received status code
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401) {

                // auto logout if 401 response returned from api
                Auth.signOut({ global: true })
                    .then(data => console.log(data))
                    .catch(err => console.log(err));
            }

            // err.error is not null, if the Response Entity contains an Exception
            // err.error.message will give the custom message send from the server
            const error = err.error.message || err.statusText;
            return throwError(error);

        }));
    }
}
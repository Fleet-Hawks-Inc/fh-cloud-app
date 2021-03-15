import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { HandleErrorService } from "../services/handle-error-service.service";

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(private error: HandleErrorService) {}

  // intercept function
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // returning an observable to complete the request cycle
    return next
      .handle(req)
      .pipe(
        catchError((err) => {
          this.error.handleError(err);
          return throwError(err);
        })
      )
      .pipe(
        map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          return evt;
        })
      );
  }
}

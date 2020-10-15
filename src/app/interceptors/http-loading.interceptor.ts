import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {EMPTY, from, Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpLoadingService} from '../services';


@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  constructor(
    private httpLoadingService: HttpLoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.httpLoadingService.setLoading(true, request.url);
    return next.handle(request)
      .pipe(catchError((err) => {
        this.httpLoadingService.setLoading(false, request.url);
        return throwError(err);
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.httpLoadingService.setLoading(false, request.url);
        }
        return evt;
      }));
  }
}

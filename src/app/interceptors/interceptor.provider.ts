import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import {HttpLoadingInterceptor} from './http-loading.interceptor';
import {ServerErrorsInterceptor} from './server-errors-Interceptor';

export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorsInterceptor, multi:true }
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];

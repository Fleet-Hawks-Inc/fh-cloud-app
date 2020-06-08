import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Rx";
import {catchError, publishReplay, share, shareReplay} from "rxjs/internal/operators";
import {EMPTY} from "rxjs/index";
import {ApiService} from "./api.service";
import * as url from "url";

@Injectable({
  providedIn: 'root'
})
export class CachedService {

  cache = {};
  constructor(private apiSrevice: ApiService) { }

  resolveDriver(url: string, type: string): Observable<any> {
   // console.log("result " + this.cache[type]);
    if (this.cache[type]) {
      console.log('Returning cached value!');
      return this.cache[type];
    } else {
      console.log('Request Sent');
      this.cache[type] = this.apiSrevice.getData(url).pipe(
          shareReplay(1),
          catchError(err => {
            console.log("errors" , err);
            delete this.cache[type];
            return EMPTY;
          }));
      return this.cache[type];
    }

  }

}

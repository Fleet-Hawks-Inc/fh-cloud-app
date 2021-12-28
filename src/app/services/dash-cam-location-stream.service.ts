import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, pipe, Subject } from 'rxjs';
import { catchError, delay, filter, map, retryWhen, switchAll, switchMap, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashCamLocationStreamService {
  connection$: WebSocketSubject<any>;
  RETRY_SECONDS = 10;
  connect(username: string, usage: string, token: string): Observable<any> {
    return of(environment.VSSServerWSS).pipe(
      filter(apiUrl => !!apiUrl),
      // https becomes wws, http becomes ws
      map(apiUrl => apiUrl.replace(/^http/, 'ws') + '/stream'),
      switchMap(wsUrl => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(environment.VSSServerWSS);
          this.send(username, usage, token);
          return this.connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(this.RETRY_SECONDS)))
    );
  }

  send(username: string, usage: string, token: string) {
    if (this.connection$) {
      const payload = {
        action: '80000',
        payload: {
          username: username,
          pid: usage,
          token: token,
        },
      };
      this.connection$.next(payload);
      const payload1 = {
        "action": "80001",
        "payload": ""
      }
      this.connection$.next(payload1);
    }
  }

  closeConnection() {
    if (this.connection$) {
      this.connection$.complete();
      this.connection$ = null;
    }
  }
  ngOnDestroy() {
    this.closeConnection();
  }
}

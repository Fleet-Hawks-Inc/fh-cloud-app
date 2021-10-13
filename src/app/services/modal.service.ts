import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public urlToRedirect: BehaviorSubject<string> = new BehaviorSubject('');
  public urlToRedirect$ = this.urlToRedirect.asObservable();
  public triggerRedirect: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public triggerRedirect$ = this.triggerRedirect.asObservable();
  constructor(private http: HttpClient) { }

  setUrlToNavigate(url: string) {
    this.urlToRedirect.next(url);
  }

}

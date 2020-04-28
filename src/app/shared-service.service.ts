import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  activeParentNav = new BehaviorSubject('fleet');
  activeSubNav = new BehaviorSubject('');
  constructor() { }
}

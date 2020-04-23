import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  activeParentNav = new BehaviorSubject('fleet');
  constructor() { }
}

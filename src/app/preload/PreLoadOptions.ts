import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

export class PreLoadOptions {
  constructor(public routePath: string, public preload = true) {}
}

@Injectable({ providedIn: 'root' })
export class PreLoadOptionsService {
  private subject = new Subject<PreLoadOptions>();
  state = this.subject.asObservable();
  startPreload(routePath: string) {
    const message = new PreLoadOptions(routePath, true);
    this.subject.next(message);
  }
}

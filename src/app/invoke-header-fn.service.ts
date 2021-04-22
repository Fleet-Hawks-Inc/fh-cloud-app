import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
@Injectable({
  providedIn: 'root'
})
export class InvokeHeaderFnService {

  constructor() { }
  invokeHeaderComponentFunction = new EventEmitter();
  subsVar: Subscription;

  callHeaderFn() {
    this.invokeHeaderComponentFunction.emit();
  }
}

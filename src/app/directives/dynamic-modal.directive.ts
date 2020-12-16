import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamic-modal-component-host]',
})
export class DynamicModalDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

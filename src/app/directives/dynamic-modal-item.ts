import { Type } from '@angular/core';

export class DynamicModalItem {
  constructor(public component: Type<any>, public data: any) {}
}

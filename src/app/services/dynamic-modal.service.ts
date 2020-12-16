import { Injectable } from '@angular/core';
import {DynamicModalItem} from '../directives/dynamic-modal-item';
import {AddDriverComponent} from '../pages/fleet';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {
  getDriverModal() {
    return [
      new DynamicModalItem(AddDriverComponent , {content: 'testing'}),
    ];
  }
}

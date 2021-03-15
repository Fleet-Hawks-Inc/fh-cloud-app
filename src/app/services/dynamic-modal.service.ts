import { Injectable } from '@angular/core';
import {DynamicModalItem} from '../directives/dynamic-modal-item';
import {AddDriverComponent} from '../pages/fleet/drivers/add-driver/add-driver.component';

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

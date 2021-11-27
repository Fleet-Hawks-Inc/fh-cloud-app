import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RouteManagementServiceService {
  public orderUpdateSessionID: string;
  public tripUpdateSessionID: string;

  constructor() {
    this.orderUpdateSessionID = uuidv4();
    this.tripUpdateSessionID = uuidv4();
  }

  orderUpdated() {
    return this.orderUpdateSessionID = uuidv4();
  }

  tripUpdated() {
    return this.tripUpdateSessionID = uuidv4();
  }
}

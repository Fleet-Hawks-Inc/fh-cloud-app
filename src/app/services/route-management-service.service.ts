import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RouteManagementServiceService {
  public orderUpdateSessionID: string;
  public tripUpdateSessionID: string;
  public driverUpdateSessionID: string;
  public vehicleUpdateSessionID: string;
  

  constructor() {
    this.orderUpdateSessionID = uuidv4();
    this.tripUpdateSessionID = uuidv4();
    this.driverUpdateSessionID = uuidv4();
    this.vehicleUpdateSessionID = uuidv4();
  }

  driverUpdated() {
    return this.driverUpdateSessionID = uuidv4();
  }

  orderUpdated() {
    return this.orderUpdateSessionID = uuidv4();
  }

  tripUpdated() {
    return this.tripUpdateSessionID = uuidv4();
  }
 vehicleUpdated() {
    return this.vehicleUpdateSessionID = uuidv4();
  }
  resetAllCache() {
    this.tripUpdateSessionID = uuidv4();
    this.orderUpdateSessionID = uuidv4();
    this.driverUpdateSessionID = uuidv4();
    this.vehicleUpdateSessionID = uuidv4();
  }
}

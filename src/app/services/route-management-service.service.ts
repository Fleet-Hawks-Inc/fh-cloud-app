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
  public assetUpdateSessionID: string;
  public fuelUpdateSessionID: string;
  public maintainanceSessionID: string;
  public serviceLogSessionID: string;
  

  constructor() {
    this.orderUpdateSessionID = uuidv4();
    this.tripUpdateSessionID = uuidv4();
    this.driverUpdateSessionID = uuidv4();
    this.vehicleUpdateSessionID = uuidv4();
    this.assetUpdateSessionID = uuidv4();
    this.fuelUpdateSessionID=uuidv4();
    this.maintainanceSessionID = uuidv4();
    this.serviceLogSessionID = uuidv4();
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
  assetUpdated() {
    return this.assetUpdateSessionID = uuidv4();
  }
  fuelUpdated(){
    return this.fuelUpdateSessionID=uuidv4();
  }
  
  maintainanceUpdated(){
    return this.maintainanceSessionID = uuidv4();
  }
   
  serviceLogUpdated(){
   return this.serviceLogSessionID = uuidv4();
  }
  
  resetAllCache() {
    this.tripUpdateSessionID = uuidv4();
    this.orderUpdateSessionID = uuidv4();
    this.driverUpdateSessionID = uuidv4();
    this.vehicleUpdateSessionID = uuidv4();
    this.assetUpdateSessionID = uuidv4();
    this.fuelUpdateSessionID=uuidv4();
    this.maintainanceSessionID = uuidv4();
    this.serviceLogSessionID = uuidv4();
  }
}

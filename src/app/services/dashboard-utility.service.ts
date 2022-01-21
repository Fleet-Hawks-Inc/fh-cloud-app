import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class DashboardUtilityService {
  public refreshDrivers = true;
  public refreshAssets = true;
  public refreshVehicles = true;
  public refreshContacts = true;
  public refreshInternalCarriers = true;
  public refreshOwnerOperators = true;
  public refreshEmployees = true;
  public refreshVendors = true;
  carriers: any = {};
  drivers: any = {};
  assets: any = {};
  vehicles: any = {};
  contacts: any = {};
  internalCarriers: any = {};
  ownerOperators: any = {};
  employees: any = {};
  vendors: any = {};

  constructor(private apiService: ApiService) { }

  public getCarriers = async (): Promise<any[]> => {
    var size = Object.keys(this.carriers).length;
    if (size === 0) {
      const result = await this.apiService
        .getData("carriers/getCarrier")
        .toPromise();
      this.carriers = result;
    }
    return this.carriers;
  };

  public getDrivers = async (): Promise<any[]> => {
    if (this.refreshDrivers) {
      const result = await this.apiService
        .getData("drivers/get/list")
        .toPromise();
      this.drivers = result;
      this.refreshDrivers = false;
    }
    return this.drivers;
  };

  public getAssets = async (): Promise<any[]> => {
    if (this.refreshAssets) {
      const result = await this.apiService
        .getData("assets/get/list")
        .toPromise();
      this.assets = result;
      this.refreshAssets = false;
    }
    return this.assets;
  };

  public getVehicles = async (): Promise<any[]> => {
    if (this.refreshVehicles) {
      const result = await this.apiService
        .getData("vehicles/get/list")
        .toPromise();
      this.vehicles = result;
      this.refreshVehicles = false;
    }
    return this.vehicles;
  };

  public getCustomers = async (): Promise<any[]> => {
    if (this.refreshContacts) {
      const result = await this.apiService
        .getData("contacts/get/list")
        .toPromise();
      this.contacts = result;
      this.refreshContacts = false;
    }
    return this.contacts;
  };

  public getContactsCarriers = async (): Promise<any[]> => {
    if (this.refreshInternalCarriers) {
      const result = await this.apiService
        .getData("contacts/get/list/carrier")
        .toPromise();
      this.internalCarriers = result;
      this.refreshInternalCarriers = false;
    }
    return this.internalCarriers;
  };

  public getOwnerOperators = async (): Promise<any[]> => {
    if (this.refreshOwnerOperators) {
      const result = await this.apiService
        .getData("contacts/get/list/owner_operator")
        .toPromise();
      this.ownerOperators = result;
      this.refreshOwnerOperators = false;
    }
    return this.ownerOperators;
  };

  public getVendors = async (): Promise<any[]> => {
    if (this.refreshVendors) {
      const result = await this.apiService
        .getData("contacts/get/list/vendor")
        .toPromise();
      this.vendors = result;
      this.refreshVendors = false;
    }
    return this.vendors;
  };

  public getEmployees = async (): Promise<any[]> => {
    if (this.refreshEmployees) {
      const result = await this.apiService
        .getData("contacts/get/emp/list")
        .toPromise();
      this.employees = result;
      this.refreshEmployees = false;
    }
    return this.employees;
  };
}

import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CountryStateCityService } from "src/app/services/country-state-city.service";
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from "rxjs";
import { MessageService } from "primeng/api";
type Severities = 'success' | 'info' | 'warn' | 'error';
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
  public refreshCountries = true;
  public refreshPlans = true;
  public refreshCarrier = true;
  public refreshVehCount = true;
  public refreshAstCount = true;
  public refreshDrvCount = true;
  public refreshDeviceCount = true;
  vehCount: number;
  carriers: any = {};
  drivers: any = {};
  assets: any = {};
  vehicles: any = {};
  contacts: any = {};
  internalCarriers: any = {};
  ownerOperators: any = {};
  employees: any = {};
  vendors: any = {};
  countries: any = {};
  carrierData: any = [];
  subscriptionPlans: any = [];
  deviceCount: any = [];
  driverCount: any = [];
  astCount: any;
  notificationChange: BehaviorSubject<any> =
    new BehaviorSubject([]);
  notificationRes = this.notificationChange.asObservable();

  constructor(private apiService: ApiService, private messageService: MessageService, private countryStateCity: CountryStateCityService, private http: HttpClient) { }

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
  public fetchCountries = async (): Promise<any[]> => {
    if (this.refreshCountries) {
      const result = await this.countryStateCity.GetAllCountries();
      this.countries = result;
      this.refreshCountries = false;
    }
    return this.countries;
  }

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

  public getSubscriptionPlans = async () => {
    if (this.refreshPlans) {
      let result = await this.http.get("assets/jsonFiles/subscriptionPlans.json").toPromise()
      this.subscriptionPlans = result;
      this.refreshPlans = false;
      return this.subscriptionPlans;
    }
  };

  public getCarrierByID = async (ID: string) => {
    console.log('carrier count')
    if (this.refreshCarrier) {
      let result = await this.apiService.getData(`carriers/${ID}`).toPromise()
      this.carrierData = result;
      this.refreshCarrier = false;
    }
    return this.carrierData;
  };


  async fetchVehiclesCount() {
    if (this.refreshVehCount) {
      let result = await this.apiService.getData(`vehicles/fetch/vehicleCount`).toPromise()
      this.vehCount = result.total ? result.total : null;
      this.refreshVehCount = false;
    }
    return this.vehCount;

  }

  async fetchAssetsCount() {
    if (this.refreshAstCount) {
      let result = await this.apiService.getData(`assets/fetch/assetCount`).toPromise()
      this.astCount = result.total ? result.total : null;
      this.refreshAstCount = false;
    }
    return this.astCount;

  }

  async fetchDriversCount() {
    if (this.refreshDrvCount) {
      let result = await this.apiService.getData(`drivers/fetch/driverCount`).toPromise()
      this.driverCount = result.total ? result.total : null;
      this.refreshDrvCount = false;
    }
    return this.driverCount;

  }

  async fetchDevicesCount(type) {
    if (this.refreshDeviceCount) {
      let deviceType = type;
      let result = await this.apiService.getData(`devices/fetch/getCount?type=${deviceType}`).toPromise();
      this.deviceCount = result;
      this.refreshDeviceCount = false;
    }
    return this.deviceCount;

  }

  notify(data) {
    this.messageService.clear();
    this.notificationChange.next(data);
  }

  clearToast() {
    this.messageService.clear();
  }
}

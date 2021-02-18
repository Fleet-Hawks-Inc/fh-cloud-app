import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable({
  providedIn: "root",
})
export class ListService {
  vendorDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  vendorList = this.vendorDataSource.asObservable();

  manufacturerDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  manufacturerList = this.manufacturerDataSource.asObservable();

  modelDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  modelList = this.modelDataSource.asObservable();

  countryDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  countryList = this.countryDataSource.asObservable();

  stateDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  stateList = this.stateDataSource.asObservable();


  assetManuDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  assetManufacturesList = this.assetManuDataSource.asObservable();


  assetModelsDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  assetModelsList = this.assetModelsDataSource.asObservable();

  ownerOperatorDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  ownerOperatorList = this.ownerOperatorDataSource.asObservable();

  serviceProgramDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  serviceProgramList = this.serviceProgramDataSource.asObservable();

  vehicleDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  vehicleDataList = this.vehicleDataSource.asObservable();

  constructor(private apiService: ApiService) {}

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      
      this.vendorDataSource.next(result.Items);
    });
  }

  fetchManufacturers() {
    this.apiService.getData('manufacturers').subscribe((result: any) => {
      this.manufacturerDataSource.next(result.Items);
    });
  }

  fetchCountries() {
    this.apiService.getData('countries').subscribe((result: any) => {
      this.countryDataSource.next(result.Items);
    });
  }

  fetchModels() {
    this.apiService
      .getData(`vehicleModels`)
      .subscribe((result: any) => {
        this.modelDataSource.next(result.Items);
      });
  }

  fetchStates() {
    this.apiService
      .getData(`states`)
      .subscribe((result: any) => {
        this.stateDataSource.next(result.Items);
      });
  }

  fetchOwnerOperators() {
    this.apiService
      .getData(`ownerOperators`)
      .subscribe((result: any) => {
        this.ownerOperatorDataSource.next(result.Items);
      });
  }
  
  fetchAssetManufacturers() {
    this.apiService
      .getData(`assetManufacturers`)
      .subscribe((result: any) => {
        this.assetManuDataSource.next(result.Items);
    });
  }

  fetchServicePrograms() {
    this.apiService
      .getData(`servicePrograms`)
      .subscribe((result: any) => {
        this.serviceProgramDataSource.next(result.Items);
    });
  }
  fetchAssetModels() {
    this.apiService
      .getData(`assetModels`)
      .subscribe((result: any) => {
        this.assetModelsDataSource.next(result.Items);
      });
  }

  fetchVehicles() {
    this.apiService
      .getData(`vehicles`)
      .subscribe((result: any) => {
        this.vehicleDataSource.next(result.Items);
      });
  }
}

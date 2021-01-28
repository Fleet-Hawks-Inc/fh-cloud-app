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

  constructor(private apiService: ApiService) {}

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      console.log('in new service');
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
}

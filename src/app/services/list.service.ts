import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable({
  providedIn: "root",
})
export class ListService {
  vendorDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  vendorList = this.vendorDataSource.asObservable();

  constructor(private apiService: ApiService) {}

  fetchVendors() {
    this.apiService.getData("vendors").subscribe((result: any) => {
      console.log('in new service');
      this.vendorDataSource.next(result.Items);
    });
  }
}

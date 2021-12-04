import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceUtilityService {

  carriers: any = {};

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
}

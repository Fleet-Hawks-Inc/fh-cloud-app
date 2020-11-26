import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';
import { HereMapService } from "../../../../../services/here-map.service";

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  private logID;
  programs;
  allServiceTasks;
  vehicleName;
  completionDate;
  odometer;
  reference;
  vendorName;
  description;
  constructor(
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private route: ActivatedRoute,
      private hereMap: HereMapService
  ) { }

  ngOnInit() {
    this.logID = this.route.snapshot.params['logID'];
    this.fetchProgramByID();
    this.hereMap.mapInit();
  }

  fetchProgramByID() {
    this.spinner.show(); // loader init
    this.apiService.getData(`serviceLogs/${this.logID}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        console.log(result);
        result = result.Items[0];
        this.fetchVendor(result.vendor);
        this.fetchVehicles(result.vehicle);
       
        this.completionDate = result.completionDate;
        this.odometer = result.odometer;
        this.reference = result.reference;
        this.description = result.description;
        this.allServiceTasks = result.allServiceTasks;
        this.spinner.hide(); // loader hide
      },
    });
  }

  /*
   * Get all vendor from api
   */
  fetchVendor(vendorID) {
    this.apiService.getData(`vendors/${vendorID}`).subscribe((result: any) => {
      this.vendorName = result.Items[0].vendorName;
      console.log('vendors', this.vendorName)
    });
  }

  /*
   * Get all vehicle from api
   */
  fetchVehicles(vehicleID) {
    this.apiService.getData(`vehicles/${vehicleID}`).subscribe((result: any) => {
      this.vehicleName = result.Items[0].vehicleIdentification;
      console.log('vehicleName', this.vehicleName)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-vehicle-service-logs',
  templateUrl: './vehicle-service-logs.component.html',
  styleUrls: ['./vehicle-service-logs.component.css']
})
export class VehicleServiceLogsComponent implements OnInit {

  title = 'Vehilce Service Logs List';
  vehicleServiceLogs;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchVehicleServiceLogs();

  }

  fetchVehicleServiceLogs() {
    this.apiService.getData('vehicleServiceLogs')
        .subscribe((result: any) => {
          console.log(result);
          this.vehicleServiceLogs = result.Items;
        });
  }



  deleteVehicleServiceLog(logID) {
    this.apiService.deleteData('vehicleServiceLogs/' + logID)
        .subscribe((result: any) => {
          this.fetchVehicleServiceLogs();
        })
  }

}

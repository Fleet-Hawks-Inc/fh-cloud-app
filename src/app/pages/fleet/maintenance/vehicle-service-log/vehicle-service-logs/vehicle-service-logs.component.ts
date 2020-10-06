import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-vehicle-service-logs',
  templateUrl: './vehicle-service-logs.component.html',
  styleUrls: ['./vehicle-service-logs.component.css'],
})
export class VehicleServiceLogsComponent implements OnInit {
  title = 'Vehicle Service Log List';
  vehicleServiceLogs;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchVehicleServiceLogs();
  }

  fetchVehicleServiceLogs() {
    this.apiService.getData('vehicleServiceLogs').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.vehicleServiceLogs = result.Items;
      },
    });
  }

  deleteVehicleServiceLog(logID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService
      .deleteData('vehicleServiceLogs/' + logID)
      .subscribe((result: any) => {
        this.fetchVehicleServiceLogs();
      });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  title = 'Vehicle List';
  vehicles;

  constructor(private apiService: ApiService) { }

  ngOnInit() {

      this.fetchVehicles();

  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.vehicles = result.Items;
      },
    });
  }



  deleteVehicle(vehicleId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
    $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData('vehicles/' + vehicleId)
        .subscribe((result: any) => {
            this.fetchVehicles();
        });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }

}

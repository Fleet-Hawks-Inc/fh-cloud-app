import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-stock-assignment-list',
  templateUrl: './stock-assignment-list.component.html',
  styleUrls: ['./stock-assignment-list.component.css'],
})
export class StockAssignmentListComponent implements OnInit {
  title = 'Stock Assignment List';
  stockAssignments = [];
  vehicles = [];
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchStockAssignments();
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.apiService.getData('vehicles').subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchStockAssignments() {
    this.apiService.getData('stockAssignments').subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.stockAssignments = result.Items;
      },
    });
  }

  deleteStockAssignment(assignmentID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
    }
    /******************************/
    this.apiService
      .deleteData('stockAssignments/' + assignmentID)
      .subscribe((result: any) => {
        this.fetchStockAssignments();
      });
  }

  getVehicleName(vehicleID) {
    let vehicle = this.vehicles.filter(
      (vehicle) => vehicle.vehicleID == vehicleID
    );
    return vehicle[0].vehicleName;
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $('#datatable-default').DataTable();
    });
  }
}

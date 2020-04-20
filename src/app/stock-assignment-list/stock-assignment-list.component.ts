import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-stock-assignment-list',
  templateUrl: './stock-assignment-list.component.html',
  styleUrls: ['./stock-assignment-list.component.css']
})
export class StockAssignmentListComponent implements OnInit {

  title = "Stock Assignment List";
  stockAssignments = [];
  vehicles = [];
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchStockAssignments();
    this.fetchVehicles();
  }

  fetchVehicles(){
    this.apiService.getData("vehicles").subscribe((result: any) => {
      this.vehicles = result.Items;
    });
  }

  fetchStockAssignments() {
    this.apiService.getData("stockAssignments").subscribe((result: any) => {
      this.stockAssignments = result.Items;
    });
  }

  deleteStockAssignment(assignmentID) {
    this.apiService
      .deleteData("stockAssignments/" + assignmentID)
      .subscribe((result: any) => {
        this.fetchStockAssignments();
      });
  }

  getVehicleName(vehicleID) {
    let vehicle = this.vehicles.filter((vehicle) => vehicle.vehicleID == vehicleID);
    return vehicle[0].vehicleName;
  }

}




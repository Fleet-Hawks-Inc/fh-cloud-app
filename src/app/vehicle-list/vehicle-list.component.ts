import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {map} from "rxjs/internal/operators";

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  title = 'Vehicle List';
  vehicles;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

      this.fetchVehicles();

  }

  fetchVehicles() {
      this.apiService.getData('vehicles')
          .subscribe((result: any) => {
              this.vehicles = result.Items;
          });
  }



  deleteVehicle(vehicleId) {
    this.apiService.deleteData('vehicles/' + vehicleId)
        .subscribe((result: any) => {
            this.fetchVehicles();
        })
  }

}

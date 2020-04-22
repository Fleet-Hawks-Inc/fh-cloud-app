import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrls: ['./manufacturer-list.component.css']
})
export class ManufacturerListComponent implements OnInit {
  title = "Manufacturer List";
  manufacturers = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchManufacturers();
  }

  fetchManufacturers() {
    this.apiService.getData("manufacturers").subscribe((result: any) => {
      this.manufacturers = result.Items;
    });
  }

  deleteManufacturer(manufacturerID) {
    this.apiService
      .deleteData("manufacturers/" + manufacturerID)
      .subscribe((result: any) => {
        this.fetchManufacturers();
      });
  }


}

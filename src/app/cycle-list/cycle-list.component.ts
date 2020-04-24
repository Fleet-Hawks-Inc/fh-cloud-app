import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-cycle-list",
  templateUrl: "./cycle-list.component.html",
  styleUrls: ["./cycle-list.component.css"],
})
export class CycleListComponent implements OnInit {
  title = "Cycles List";
  cycles = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchCycles();
  }

  fetchCycles() {
    this.apiService.getData("cycles").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.cycles = result.Items;
      },
    });
  }

  deleteCycle(cycleID) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("cycles/" + cycleID).subscribe((result: any) => {
      this.fetchCycles();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}

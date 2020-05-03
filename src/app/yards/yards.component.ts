import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-yards",
  templateUrl: "./yards.component.html",
  styleUrls: ["./yards.component.css"],
})
export class YardsComponent implements OnInit {
  title = "Yards List";
  yards;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchyards();
  }

  fetchyards() {
    this.apiService.getData("yards").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.yards = result.Items;
      },
    });
  }

  deleteYard(YardId) {
    /******** Clear DataTable ************/
    if ($.fn.DataTable.isDataTable("#datatable-default")) {
      $("#datatable-default").DataTable().clear().destroy();
    }
    /******************************/

    this.apiService.deleteData("yards/" + YardId).subscribe((result: any) => {
      this.fetchyards();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}

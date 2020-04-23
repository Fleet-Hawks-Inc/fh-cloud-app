import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;


@Component({
  selector: "app-alert-list",
  templateUrl: "./alert-list.component.html",
  styleUrls: ["./alert-list.component.css"],
})
export class AlertListComponent implements OnInit {
  title = "Alert List";
  alerts = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchAlerts();
  }

  fetchAlerts() {
    this.apiService.getData("alerts").subscribe({
      complete: () => {
        this.initDataTable();
      },
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.alerts = result.Items;
      },
    });

  }

  deleteAlert(alertID) {
      /******** Clear DataTable ************/
      if ($.fn.DataTable.isDataTable("#datatable-default")) {
        $("#datatable-default").DataTable().clear().destroy();
      }
      /******************************/

    this.apiService.deleteData("alerts/" + alertID).subscribe((result: any) => {
      this.fetchAlerts();
    });
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }
}

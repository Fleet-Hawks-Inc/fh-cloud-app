import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

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
    this.apiService.getData("alerts").subscribe((result: any) => {
      this.alerts = result.Items;
    });
  }

  deleteAlert(alertID) {
    this.apiService.deleteData("alerts/" + alertID).subscribe((result: any) => {
      this.fetchAlerts();
    });
  }
}

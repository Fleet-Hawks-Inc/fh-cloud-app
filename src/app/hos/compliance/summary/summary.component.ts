import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.css"],
})
export class SummaryComponent implements OnInit {
  title = "Logs";
  logs = [];
  drivers = [];
  userName = "";
  fromDate = "";
  toDate = "";
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.apiService.getData("users/userType/driver").subscribe((result: any) => {
      this.drivers = result.Items;
    });
    //console.log(this.drivers);
  }

  getLogs() {
    let from  = moment(this.fromDate).format('DD-MM-YYYY');
    let to = moment(this.toDate).format('DD-MM-YYYY');
    console.log(from);

    this.apiService.getData(`eventLogs/HOSSummary?userName=${this.userName}&fromDate=${from}&toDate=${to}`).subscribe((result: any) => {
      this.logs = result;
    });
    console.log(this.logs);
  }
}

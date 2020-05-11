import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.component.html",
  styleUrls: ["./detailed.component.css"],
})
export class DetailedComponent implements OnInit {
  title = "Logs";
  logDetails = [];
  lastEvent = {};
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
    this.apiService
      .getData("users/userType/driver")
      .subscribe((result: any) => {
        this.drivers = result.Items;
      });
  }

  getLogs() {
    let from = moment(this.fromDate).format("DD-MM-YYYY");
    let to = moment(this.toDate).format("DD-MM-YYYY");

    this.apiService
      .getData(
        `eventLogs/HOSSummary?userName=${this.userName}&fromDate=${from}&toDate=${to}`
      )
      .subscribe((result: any) => {
        this.logs = result;
      });
    console.log(this.logs);
  }

  getGraphData(date: string) {
    $(".toggle-content").hide("slow");
    if ($("#" + date).is(":visible")) {
      $("#" + date).hide("slow");
    } else {
      $("#" + date).show("slow");
    }

    this.apiService
    .getData(
      `eventLogs/HOSLastEvent?userName=${this.userName}&eventDate=${date}`
    )
    .subscribe((result: any) => {
      this.lastEvent = result;
    });

    this.apiService
      .getData(
        `eventLogs/HOSDetail?userName=${this.userName}&eventDate=${date}`
      )
      .subscribe((result: any) => {
        this.logDetails = result;
      });
  }
}

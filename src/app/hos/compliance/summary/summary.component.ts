import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../api.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.css"],
})
export class SummaryComponent implements OnInit {
  title = "Logs";
  logs = [];
  constructor() {}

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {}
}

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../../api.service";
import { from, of } from "rxjs";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit {
  userName = "";
  eventDate = "";
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.userName = this.route.snapshot.params["userName"];
    this.eventDate = this.route.snapshot.params["eventDate"];

    this.fetchDetail();
  }

  fetchDetail() {
    this.apiService
      .getData(
        `eventLogs/HOSDetail?userName=${this.userName}&eventDate=${this.eventDate}`
      )
      .subscribe((result: any) => {
        console.log(result);
      });
  }
}

import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { ActivatedRoute } from "@angular/router";

import * as moment from "moment";
import * as _ from "lodash";
import { ELDService } from "src/app/services/eld.service";

declare var $: any;

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.component.html",
  styleUrls: ["./detailed.component.css"],
})
export class DetailedComponent implements OnInit {
  isCanada = true;
  selectedDate = new Date();
  title = "Driver Logs";
  logs = [];
  loaded = true;
  hosDriverId = "";
  eventDate = "";
  duties = [];
  eventList = [];
  accumulatedOFF = 0;
  accumulatedSB = 0;
  accumulatedD = 0;
  accumulatedON = 0;
  currentDate = moment().utc().format("DD-MM-YYYY");
  get = _.get;
  eventID = "";
  fromTime = "";
  toTime = "";
  eventType = "";

  /**
   * Driver props
   */
  driverID = "";
  driverName = "";
  driverLicense = "";
  driverCycle = "";
  /**
   * Carrier Props
   */
  carrierName = "";
  carrierAddress = "";
  carrierDot = "";
  carrierMainOffice = "";
  carrierHomeTerminalName = "";
  carrierHomeTerminalAddress = "";

  ELDProvider = "";

  dataColumns = [
    {
      field: "Date",
      header: "Date",
      type: "text",
    },
    {
      field: "OriginalDutyStatus",
      header: "Duty Status",
      type: "text",
    },
    {
      field: "Location",
      header: "Location",
      type: "text",
    },
    {
      field: "Odometer",
      header: "Odometer (Miles)",
      type: "text",
    },
    {
      field: "DrivenMiles",
      header: "Distance (Miles)",
      type: "text",
    },
    {
      field: "EventDuration",
      header: "Duration (hh:mm:ss)",
      type: "text",
    },
    {
      field: "Status",
      header: "Certified (MDT)",
      type: "text",
    },
    {
      field: "Remark",
      header: "Remark",
      type: "text",
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private eldService: ELDService
  ) {}

  async ngOnInit() {
    this.hosDriverId = this.route.snapshot.params["hosDriverId"];
    await this.fetchEvents();
  }

  logBook: any;
  async fetchEvents() {
    let compliance = "can";
    if (this.isCanada) {
      compliance = "can";
    } else {
      compliance = "us";
    }
    const response: any = await this.eldService
      .postData(`hos/${compliance}/driver/logBook`, {
        HOSDriverId: this.hosDriverId,
        FromDate: Math.floor(this.selectedDate.getTime() / 1000),
      })
      .toPromise();
    this.logBook = response.data;
    this.logs = response.data.Points;

    this.logs = _.filter(this.logs, function (currentObject) {
      return currentObject.EventOrigin !== -1;
    });
    console.log(this.logs);
    this.logs = _.sortBy(this.logs, ["EpochTimestamp"]);
    this.logs.forEach((element) => {
      element.Date = new Date(
        parseInt(element.EpochTimestamp) * 1000
      ).toLocaleDateString();
    });

    console.log(this.logBook);
  }
  async nextDate() {
    this.selectedDate = moment(this.selectedDate).add(1, "day").toDate();
    await this.fetchEvents();
  }
  async previousDate() {
    this.selectedDate = moment(this.selectedDate).subtract(1, "day").toDate();

    await this.fetchEvents();
  }
  complianceText = "Canada";
  async switchCompliance(e: any) {
    let isChecked = e.checked;
    this.complianceText = this.isCanada ? "Canada" : "USA";
    await this.fetchEvents();
  }
}

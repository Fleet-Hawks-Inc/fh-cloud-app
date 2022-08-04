import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import { ActivatedRoute } from "@angular/router";

import * as moment from "moment";
import * as _ from "lodash";
import { ELDService } from "src/app/services/eld.service";
import { Subject } from "rxjs";

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

  base64: any;
  showUsaLogs = false;
  downloadFileName = "download_file";
  async downloadUSAFile() {
    const response: any = await this.eldService
      .postData("reports/usa/printLogs", {
        HOSDriverId: 77400,
        FromDate: 1634156520,
        EndDate: 1634156520,
      })
      .toPromise();
    if (response && response.data) {
      console.log(response.data.File);
      this.base64 = this._base64ToArrayBuffer(response.data.File);
      this.showUsaLogs = true;

      this.downloadFileName = response.data.FileName;
    }
  }

  async downloadCANFile() {
    const response: any = await this.eldService
      .postData("reports/can/printLogs", {
        HOSDriverId: 77400,
        FromDate: 1634156520,
        EndDate: 1634156520,
      })
      .toPromise();
    if (response && response.data) {
      const data = response.data[0];
      console.log(data);
      this.base64 = this._base64ToArrayBuffer(data.File);
      this.showUsaLogs = true;

      this.downloadFileName = data.FileName;
    }
  }

  downLoadFile() {
    const file = new Blob([this.base64], { type: "application/pdf" });
    const navigator = window.navigator as any;
    if (navigator && navigator.msSaveOrOpenBlob) {
      // for IE
      navigator.msSaveOrOpenBlob(file, this.downloadFileName);
    } else {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      var csvUrl = URL.createObjectURL(file);
      a.href = csvUrl;
      a.download = this.downloadFileName;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    }
  }

  _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

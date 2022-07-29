import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../../../services/api.service";
import * as moment from "moment";
declare var $: any;
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Table } from "primeng/table";
import * as _ from "lodash";
import { ELDService } from "src/app/services/eld.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-logs",
  templateUrl: "./logs.component.html",
  styleUrls: ["./logs.component.css"],
  providers: [DatePipe],
})
export class LogsComponent implements OnInit {
  @ViewChild("dt") table: Table;

  title = "Logs";
  logs = [];
  drivers = [];
  userName = "";
  fromDate: any = moment().format("YYYY-MM-DD");
  toDate: any = moment().format("YYYY-MM-DD");
  loaded = false;

  // Ruleset codes
  ruleSets = [
    {
      code: 0,
      value: "USA_60H",
    },
    {
      code: 1,
      value: "USA_70H",
    },
    {
      code: 2,
      value: "CALIFORNIA_80H",
    },
    {
      code: 3,
      value: "OILFIELD_60H",
    },
    {
      code: 4,
      value: "OILFIELD_70H",
    },
    {
      code: 5,
      value: "CANADA_70H",
    },
    {
      code: 6,
      value: "CANADA_120H",
    },
    {
      code: 7,
      value: "TEXAS_70H",
    },
    {
      code: 8,
      value: "MEXICO",
    },
    {
      code: 9,
      value: "PASSENGER_60H",
    },
    {
      code: 10,
      value: "PASSENGER_70H",
    },
    {
      code: 11,
      value: "FLORIDA_70H",
    },
    {
      code: 12,
      value: "FLORIDA_80H",
    },
    {
      code: 13,
      value: "ASPHALT_60H",
    },
    {
      code: 14,
      value: "ASPHALT_70H",
    },
    {
      code: 15,
      value: "CALIFORNIA_TANKER_60H",
    },
    {
      code: 16,
      value: "TEXAS_OILFIELD_70H",
    },
    {
      code: 17,
      value: "ALASKA_70H",
    },
    {
      code: 18,
      value: "ALASKA_80H",
    },
  ];
  // columns of data table
  dataColumns = [
    {
      field: "DriverName",
      header: "Driver Name",
      type: "text",
    },
    {
      field: "HOSRuleSetId",
      header: "Rule Set",
      type: "text",
    },
    {
      field: "CurrentDutyStatus",
      header: "Current Duty Status",
      type: "text",
    },
    {
      field: "DrivingString",
      header: "Driving Hours",
      type: "text",
    },
    {
      field: "OnDutyString",
      header: "ON Duty Hours",
      type: "text",
    },
    {
      field: "OnDutyWeekString",
      header: "Cycle On Duty",
      type: "text",
    },
    {
      field: "Next30BreakTimestamp",
      header: "Next 30min Break",
      type: "text",
    },

    {
      field: "LastLocation",
      header: "Last Location",
      type: "text",
    },
    {
      field: "LastUpdateTimestamp",
      header: "Last Updated",
      type: "text",
    },
  ];
  get = _.get;
  _selectedColumns: any[];
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter((col) => val.includes(col));
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }
  constructor(
    private apiService: ApiService,
    private eldService: ELDService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.selectedColumns = this.dataColumns;
    await this.getInitialLogs();
  }

  fetchDrivers() {
    this.apiService.getData("drivers").subscribe((result: any) => {
      this.drivers = result.Items;
    });
  }

  getInitialLogs() {
    this.getLogs();
  }

  async refreshData() {}
  clear(dt) {}
  async getLogs() {
    const response = await this.eldService
      .getData(`dashboards/driverHosSummary`)
      .toPromise();

    this.logs = response.data;
    console.log(this.logs);
    this.logs.forEach((element) => {
      const date = new Date(
        parseInt(element.LastUpdateTimestamp) * 1000
      ).toLocaleDateString();
      const time = new Date(
        parseInt(element.LastUpdateTimestamp) * 1000
      ).toLocaleTimeString();
      element.LastUpdateTimestamp = `${date} ${time}`;
      element.Next30BreakTimestamp =
        element.Next30BreakTimestamp === 0
          ? "NA"
          : new Date(
              parseInt(element.Next30BreakTimestamp) * 1000
            ).toLocaleDateString();

      element.HOSRuleSetId = this.ruleSets.find(
        (o) => o.code === element.HOSRuleSetId
      ).value;
    });
    this.loaded = true;
  }

  getHosDetails(hosLog: any) {
    this.router.navigate([`/compliance/hos/detailed/${hosLog.HOSDriverId}`]);
  }
}

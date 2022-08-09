import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Table } from 'primeng/table';
import { AccountService, DashboardUtilityService } from "src/app/services";
import { ApiService } from "src/app/services/api.service";
import Constants from "../../../fleet/constants";

@Component({
  selector: "app-settlements-list",
  templateUrl: "./settlements-list.component.html",
  styleUrls: ["./settlements-list.component.css"],
})
export class SettlementsListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;

  settlements = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    searchValue: null,
    startDate: null,
    endDate: null,
    type: null,
  };
  lastItemSK = "";
  loaded = false;
  disableSearch = false;

  driversObject: any = {};
  carriersObject: any = {};
  ownerOpObjects: any = {};
  _selectedColumns: any[];
  get = _.get;
  find = _.find;
  dataColumns = [
    { width: '8%', field: 'setNo', header: 'Settlement#', type: "text" },
    { width: '10%', field: 'txnDate', header: 'Settlement Date', type: "text" },
    { width: '10%', field: 'entityType', header: 'Settlement Type', type: "text" },
    { width: '13%', field: 'tripNames', header: 'Trip#', type: "text" },
    { width: '8%', field: 'finalTotal', header: 'Settled Amount', type: "text" },
    { width: '15%', field: 'paidAmount', header: 'Paid Amount', type: "text" },
    { width: '15%', field: 'pendingPayment', header: 'Balance', type: "text" },
    { width: '15%', field: 'status', header: 'Status', type: "text" },
  ];
  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private dashboardUtilityService: DashboardUtilityService
  ) { }

  async ngOnInit() {
    this.setToggleOptions()
    this.fetchSettlements();
    this.driversObject = await this.dashboardUtilityService.getDrivers();
    this.carriersObject = await this.dashboardUtilityService.getContactsCarriers();
    this.ownerOpObjects = await this.dashboardUtilityService.getOwnerOperators();
  }

  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }

  unitTypeChange() {
    this.filter.searchValue = null;
  }

  fetchSettlements(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.settlements = [];
    }
    if (this.lastItemSK !== "end") {
      if (
        this.filter.searchValue !== null &&
        this.filter.searchValue !== ""
      ) {
        searchParam = this.filter.type === 'settlementNo' ? encodeURIComponent(`"${this.filter.searchValue}"`) : `${this.filter.searchValue}`;
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `settlement/paging?type=${this.filter.type}&searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe((result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.disableSearch = false;
            this.loaded = true
          }
          if (result.length > 0) {
            this.disableSearch = false;
            if (result[result.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                result[result.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            result.map((v) => {
              v.url = `/accounts/settlements/detail/${v.sttlID}`;
              v.entityType = v.type.replace("_", " ");
              v.status = v.status.replace("_", " ");
              if (v.status == undefined) {
                v.status = "unpaid";
              }

              v.paidAmount = v.finalTotal - v.pendingPayment;
              v.paidAmount = v.paidAmount.toFixed(2);
              this.settlements.push(v);
            });
            this.loaded = true;
          }
        }, err => {
          this.disableSearch = false;
        });
    }
  }

  searchFilter() {
    if (
      this.filter.type !== null ||
      this.filter.searchValue !== null ||
      this.filter.endDate !== null ||
      this.filter.startDate !== null
    ) {
      this.disableSearch = true;
      // if (this.filter.type != '' && (this.filter.searchValue == null || this.filter.searchValue == '')) {
      //   this.toaster.error("Please select any value");
      //   this.disableSearch = false;
      //   return false;
      // }
      if (this.filter.startDate != "" && this.filter.endDate == "") {
        this.toaster.error("Please select both start and end dates.");
        this.disableSearch = false;
        return false;
      } else if (this.filter.startDate == "" && this.filter.endDate != "") {
        this.toaster.error("Please select both start and end dates.");
        this.disableSearch = false;
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
        this.disableSearch = false;
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.settlements = [];
        this.lastItemSK = "";
        this.fetchSettlements();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      searchValue: null,
      startDate: null,
      endDate: null,
      type: null,
    };
    this.settlements = [];
    this.lastItemSK = "";
    this.fetchSettlements();
  }

  deleteSettlement(settlementID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`settlement/delete/${settlementID}`)
        .subscribe((result: any) => {
          this.lastItemSK = "";
          this.settlements = [];
          this.fetchSettlements();
          this.toaster.success("Settlement deleted successfully.");
        });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.filter = {
        searchValue: null,
        startDate: null,
        endDate: null,
        type: null,
      };
      this.fetchSettlements();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      searchValue: null,
      startDate: null,
      endDate: null,
      type: null,
    };
    this.settlements = [];
    this.lastItemSK = "";
    this.fetchSettlements();
  }
  clear(table: Table) {
    table.clear();
  }
}

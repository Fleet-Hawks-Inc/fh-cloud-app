import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
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
    settlementNo: "",
  };
  lastItemSK = "";
  loaded = false;
  disableSearch = false;

  driversObject: any = {};
  carriersObject: any = {};
  ownerOpObjects: any = {};

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private dashboardUtilityService: DashboardUtilityService
  ) { }

  async ngOnInit() {

    this.fetchSettlements();
    this.driversObject = await this.dashboardUtilityService.getDrivers();
    this.carriersObject = await this.dashboardUtilityService.getContactsCarriers();
    this.ownerOpObjects = await this.dashboardUtilityService.getOwnerOperators();
  }

  UnitTypeChange() {
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
        this.filter.settlementNo !== null &&
        this.filter.settlementNo !== ""
      ) {
        searchParam = encodeURIComponent(`"${this.filter.settlementNo}"`);
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `settlement/paging?type=${this.filter.type}&searchValue=${this.filter.searchValue}&settlementNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe((result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.disableSearch = false;
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
        });
    }
  }

  searchFilter() {
    if (
      this.filter.type !== null ||
      this.filter.settlementNo !== null ||
      this.filter.endDate !== null ||
      this.filter.startDate !== null
    ) {
      this.disableSearch = true;
      if (this.filter.startDate != "" && this.filter.endDate == "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate == "" && this.filter.endDate != "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
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
      settlementNo: null,
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
      settlementNo: null,
    };
    this.settlements = [];
    this.lastItemSK = "";
    this.fetchSettlements();
  }
}

import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, DashboardUtilityService, ListService } from "src/app/services";
import * as _ from "lodash";
import { Table } from 'primeng/table';
import { OverlayPanel } from "primeng/overlaypanel";


@Component({
  selector: "app-driver-payments-list",
  templateUrl: "./driver-payments-list.component.html",
  styleUrls: ["./driver-payments-list.component.css"],
})
export class DriverPaymentsListComponent implements OnInit {
  @ViewChild("op") overlaypanel: OverlayPanel;
  dataMessage: string = Constants.FETCHING_DATA;

  payments = [];
  settlementIds = [];
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    searchValue: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastItemSK = "";
  loaded = false;
  disableSearch = false;
  driversObject: any = {};
  carriersObject: any = {};
  ownerOpObjects: any = {};
  voidedRecID = '';
  voidSubs: Subscription;
  _selectedColumns: any[];
  get = _.get;
  find = _.find;
  dataColumns = [
    { field: 'paymentNo', header: 'Payment#', type: "text" },
    { field: 'txnDate', header: 'Date', type: "text" },
    { field: 'payMode', header: 'Payment Mode', type: "text" },
    { field: 'payModeNo', header: 'Reference No.', type: "text" },
    { field: 'settlData', header: 'Settlement#', type: "text" },
    { field: 'paymentTo', header: 'Paid To', type: "text" },
    { field: 'finalAmount', header: 'Amount', type: "text" },
    { field: 'status', header: 'Status', type: "text" },

  ];
  constructor(
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService,
    private dashboardUtilityService: DashboardUtilityService,
    private listService: ListService,
  ) { }

  async ngOnInit() {
    this.setToggleOptions()
    this.fetchDriverPayments();
    this.driversObject = await this.dashboardUtilityService.getDrivers();
    this.carriersObject = await this.dashboardUtilityService.getContactsCarriers();
    this.ownerOpObjects = await this.dashboardUtilityService.getOwnerOperators();

    this.voidSubs = this.listService.voidStatus.subscribe(
      async (res: any) => {
        if (res === true) {
          for (const iterator of this.payments) {
            if (iterator.paymentID === this.voidedRecID) {
              iterator.status = 'voided';
            }
          }
        }
      })

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

  fetchDriverPayments(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.payments = [];
    }
    if (this.lastItemSK !== "end") {
      if (this.filter.searchValue !== null && this.filter.searchValue !== "") {
        searchParam = this.filter.type === 'paymentNo' ? encodeURIComponent(`"${this.filter.searchValue}"`) : `${this.filter.searchValue}`;
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `driver-payments/paging?type=${this.filter.type}&searchValue=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
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
              v.currency = v.currency ? v.currency : "CAD";
              v.url = `/accounts/payments/driver-payments/detail/${v.paymentID}`;
              if (v.payMode) {
                v.payMode = v.payMode.replace("_", " ");
              } else {
                v.payMode = "-";
              }
              v.paymentTo = v.paymentTo.replace("_", " ");
              v.settlData.map((k) => {
                k.status = k.status.replace("_", " ");
              });
              this.payments.push(v);
            });
            this.loaded = true;
          }
        });
    }
  }


  searchFilter() {
    if (
      this.filter.type !== null ||
      this.filter.searchValue !== "" ||
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
        this.payments = [];
        this.lastItemSK = "";
        this.fetchDriverPayments();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.payments = [];
    this.filter = {
      startDate: null,
      endDate: null,
      type: null,
      searchValue: null,
    };
    this.lastItemSK = "";
    this.fetchDriverPayments();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchDriverPayments();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.payments = [];
    this.filter = {
      startDate: null,
      endDate: null,
      type: null,
      searchValue: null,
    };
    this.lastItemSK = "";
    this.fetchDriverPayments();
  }

  async voidPayment(payData) {
    let payObj = {
      showModal: true,
      page: "list",
      paymentNo: payData.paymentNo,
      paymentID: payData.paymentID
    };
    this.voidedRecID = payData.paymentID;
    this.listService.triggerVoidDriverPayment(payObj);
  }
  clear(table: Table) {
    table.clear();
  }
}

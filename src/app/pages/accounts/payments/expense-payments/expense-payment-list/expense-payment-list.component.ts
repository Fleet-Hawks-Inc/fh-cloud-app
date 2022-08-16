import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService } from "src/app/services/account.service";
import { DashboardUtilityService } from "src/app/services/dashboard-utility.service";
import * as _ from "lodash";
import { Table } from 'primeng/table';
@Component({
  selector: "app-expense-payment-list",
  templateUrl: "./expense-payment-list.component.html",
  styleUrls: ["./expense-payment-list.component.css"],
})
export class ExpensePaymentListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    searchValue: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  payments = [];
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
    { field: 'paymentNo', header: 'Payment#', type: "text" },
    { field: 'txnDate', header: 'Date', type: "text" },
    { field: 'payMode', header: 'Payment Mode', type: "text" },
    { field: 'payModeNo', header: 'Reference No.', type: "text" },
    { field: 'paymentTo', header: 'Paid To', type: "text" },
    { field: 'finalAmount', header: 'Amount', type: "text" },
  ];
  constructor(private accountService: AccountService, private toaster: ToastrService, private dashboardUtilityService: DashboardUtilityService) { }

  async ngOnInit() {
    this.setToggleOptions();
    this.getList();
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

  async getList() {
    let searchParam = "";
    if (this.filter.searchValue !== null && this.filter.searchValue !== "") {
      searchParam = (this.filter.type === 'amount' || this.filter.type === 'paymentNo') ? encodeURIComponent(`"${this.filter.searchValue}"`) : `${this.filter.searchValue}`;
    } else {
      searchParam = null;
    }

    if (this.lastItemSK !== "end") {
      const result: any = await this.accountService
        .getData(
          `expense-payments/paging?type=${this.filter.type}&searchValue=${searchParam}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .toPromise();
      this.lastItemSK = "end";
      this.disableSearch = false;
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
        this.loaded = true
      } else {
        if (result[result.length - 1].sk !== undefined) {
          this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
        }
        this.loaded = true;
      }

      // this.payments = result;
      result.map((v) => {
        v.payMode = v.payMode.replace("_", " ");
        v.paymentTo = v.paymentTo.replace("_", " ");
        v.url = `/accounts/payments/expense-payments/detail/${v.paymentID}`;

        this.payments.push(v);
      });
    }
  }

  unitTypeChange() {
    this.filter.searchValue = null;
  }


  searchFilter() {
    if (this.filter.type != null && this.filter.searchValue == null) {
      this.toaster.error('Please type value')
      this.disableSearch = false;
      return;
    }
    if (
      this.filter.startDate !== null ||
      this.filter.endDate !== null || this.filter.searchValue !== null || this.filter.type !== null
    ) {

      this.disableSearch = true;
      this.dataMessage = Constants.FETCHING_DATA;
      this.payments = [];
      this.lastItemSK = "";
      this.getList();
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.filter.startDate = null;
    this.filter.endDate = null;
    this.filter.searchValue = null;
    this.filter.type = null;
    this.lastItemSK = "";
    this.dataMessage = Constants.FETCHING_DATA;
    this.payments = [];
    this.getList();
  }

  onScroll() {
    if (this.loaded) {
      this.getList();
    }
    this.loaded = false;
  }
  clear(table: Table) {
    table.clear();
  }
}

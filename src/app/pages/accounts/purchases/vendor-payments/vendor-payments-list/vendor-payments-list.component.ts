import { Component, Input, OnInit } from "@angular/core";
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import Constants from "src/app/pages/fleet/constants";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-vendor-payments-list",
  templateUrl: "./vendor-payments-list.component.html",
  styleUrls: ["./vendor-payments-list.component.css"],
})
export class VendorPaymentsListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    amount: null,
    startDate: null,
    endDate: null,
  };
  disableSearch = true;
  lastItemSK = "";
  loaded = false;
  payments = [];
  vendors = [];
  get = _.get;
  find = _.find;
  _selectedColumns: any[];
  dataColumns = [
    { field: 'txnDate', header: 'Date', type: "text" },
    { field: 'paymentNo', header: 'Payment#', type: "text" },
    { field: 'refNo', header: 'Reference#', type: "text" },
    { field: 'vendorID', header: 'Vendor', type: "text" },
    { field: 'payMode', header: 'Payment Mode', type: "text" },
    { field: 'payModeNo', header: 'Payment Mode Reference No.', type: "text" },
    { field: 'total.finalTotal', header: 'Amount', type: "text" },
  ];
  constructor(
    private apiService: ApiService,
    private accountService: AccountService
  ) { }

  async ngOnInit() {
    this.setToggleOptions();
    await this.fetchVendor();
    this.fetchPayments();
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
  
  async fetchPayments() {
    if (this.lastItemSK !== "end") {
      this.disableSearch = false;
      let filterAmount = null;
      if (this.filter.amount) {
        filterAmount = encodeURIComponent(`"${this.filter.amount}"`);
      }
      let result: any = await this.accountService
        .getData(
          `purchase-payments/paging?amount=${filterAmount}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .toPromise();
      // this.payments = result;
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.lastItemSK = "end";
      if (result.length > 0 && result[result.length - 1].sk !== undefined) {
        this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
      } else {
        this.lastItemSK = "end";
      }

      result.map((v) => {
        v.payMode = v.payMode.replace("_", " ");
        v.url = `/accounts/purchases/vendor-payments/detail/${v.paymentID}`;
        this.payments.push(v);
      });
    }
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/get/list/vendor`)
      .toPromise();
    this.vendors = result;
  }

  searchFilter() {
    if (
      this.filter.amount !== null ||
      this.filter.startDate !== null ||
      this.filter.endDate !== null
    ) {
      this.payments = [];
      this.disableSearch = true;
      this.lastItemSK = "";
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchPayments();
    }
  }

  resetFilter() {
    this.filter = {
      amount: null,
      startDate: null,
      endDate: null,
    };
    this.payments = [];
    this.disableSearch = true;
    this.lastItemSK = "";
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchPayments();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchPayments();
    }
    this.loaded = false;
  }
  clear(table: Table) {
    table.clear();
  }
}

import { Component, OnInit } from "@angular/core";
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

  constructor(
    private apiService: ApiService,
    private accountService: AccountService
  ) {}

  async ngOnInit() {
    await this.fetchVendor();
    this.fetchPayments();
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
}

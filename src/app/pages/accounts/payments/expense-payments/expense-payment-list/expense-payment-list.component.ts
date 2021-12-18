import { Component, OnInit } from "@angular/core";
import Constants from "src/app/pages/fleet/constants";
import { AccountService } from "src/app/services/account.service";

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
    amount: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  payments = [];
  lastItemSK = "";
  loaded = false;
  disableSearch = false;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.getList();
  }

  async getList() {
    let filterAmount = "";
    if (this.filter.amount) {
      filterAmount = encodeURIComponent(`"${this.filter.amount}"`);
    }
    if (this.lastItemSK !== "end") {
      const result: any = await this.accountService
        .getData(
          `expense-payments/paging?amount=${filterAmount}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .toPromise();
      this.lastItemSK = "end";
      this.disableSearch = false;
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      } else {
        if (result[result.length - 1].sk !== undefined) {
          this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
        }
        this.loaded = true;
      }

      // this.payments = result;
      result.map((v) => {
        v.payMode = v.payMode.replace("_", " ");
        v.url = `/accounts/payments/expense-payments/detail/${v.paymentID}`;

        this.payments.push(v);
      });
    }
  }

  searchFilter() {
    if (
      this.filter.amount != null ||
      this.filter.startDate !== null ||
      this.filter.endDate !== null
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
    this.filter.amount = null;
    this.filter.startDate = null;
    this.filter.endDate = null;
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
}

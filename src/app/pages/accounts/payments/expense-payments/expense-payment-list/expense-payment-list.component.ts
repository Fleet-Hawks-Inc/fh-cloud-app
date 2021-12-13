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
    type: null,
    paymentNo: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  payments = [];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.getList();
  }

  async getList() {
    const result: any = await this.accountService
      .getData(`expense-payments/paging`)
      .toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
    this.payments = result;
    console.log("result", result);
  }
}

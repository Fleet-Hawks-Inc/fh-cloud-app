import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { AccountService } from "src/app/services/account.service";
import { ListService } from "src/app/services/list.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-expense-payment-detail",
  templateUrl: "./expense-payment-detail.component.html",
  styleUrls: ["./expense-payment-detail.component.css"],
})
export class ExpensePaymentDetailComponent implements OnInit {
  paymentData = {
    paymentTo: null,
    entityId: null,
    paymentNo: "",
    txnDate: moment().format("YYYY-MM-DD"),
    fromDate: null,
    toDate: null,
    settlementIds: [],
    advancePayIds: [],
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    currency: "CAD",
    finalAmount: 0,
    accountID: null,
    advData: [],
    transactionLog: [],
    expData: [],
    expIds: [],
    advTotal: 0,
    expTotal: 0,
  };
  showModal = false;
  paymentID = "";

  constructor(
    private accountService: AccountService,
    private listService: ListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    this.fetchPayment();
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.finalAmount,
      type: "expensePayment",
      paymentTo: this.paymentData.paymentTo,
      chequeNo: this.paymentData.payModeNo,
      currency: this.paymentData.currency,
      showModal: this.showModal,
      fromDate: this.paymentData.fromDate,
      toDate: this.paymentData.toDate,
      finalAmount: this.paymentData.finalAmount,
      txnDate: this.paymentData.txnDate,
    };
    this.listService.openPaymentChequeModal(obj);
  }

  async fetchPayment() {
    const result: any = await this.accountService
      .getData(`expense-payments/detail/${this.paymentID}`)
      .toPromise();
    this.paymentData = result;
  }
}

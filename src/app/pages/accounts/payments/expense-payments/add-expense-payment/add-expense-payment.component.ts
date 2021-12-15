import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { ApiService } from "src/app/services/api.service";
import Constants from "src/app/pages/fleet/constants";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/services/account.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ListService } from "src/app/services/list.service";

@Component({
  selector: "app-add-expense-payment",
  templateUrl: "./add-expense-payment.component.html",
  styleUrls: ["./add-expense-payment.component.css"],
})
export class AddExpensePaymentComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  dataMessageAdv: string = Constants.NO_RECORDS_FOUND;
  dataMessageExp: string = Constants.NO_RECORDS_FOUND;
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
  drivers = [];
  carriers = [];
  ownerOperators = [];
  payModeLabel = "";
  editDisabled = true;
  settlements = [];
  advancePayments = [];
  searchDisabled = false;
  accList: any = {};
  expenses = [];
  submitDisabled = false;
  errors = {};
  response: any = "";
  showModal = false;

  constructor(
    private apiService: ApiService,
    private toaster: ToastrService,
    private accountService: AccountService,
    private router: Router,
    private listService: ListService
  ) {}

  ngOnInit() {
    this.fetchAccounts();
  }

  emptyPrevSelection() {
    this.settlements = [];
    this.advancePayments = [];
    this.expenses = [];
    this.paymentData.finalAmount = 0;
    this.paymentData.advTotal = 0;
    this.paymentData.expTotal = 0;
    this.dataMessage = Constants.NO_RECORDS_FOUND;
    this.dataMessageAdv = Constants.NO_RECORDS_FOUND;
    this.dataMessageExp = Constants.NO_RECORDS_FOUND;
  }
  getEntityData(type = "") {
    this.emptyPrevSelection();
    if (type === "driver") {
      this.carriers = [];
      this.ownerOperators = [];
      this.fetchDrivers();
    } else if (type === "carrier") {
      this.drivers = [];
      this.ownerOperators = [];
      this.fetchCarriers();
    } else if (type === "owner_operator") {
      this.drivers = [];
      this.carriers = [];
      this.fetchOwnerOperators();
    }
  }

  fetchDrivers() {
    this.apiService
      .getData(`drivers/get/all/active`)
      .subscribe((result: any) => {
        result.Items.forEach((element) => {
          if (element.isDeleted === 0) {
            this.drivers.push(element);
          }
        });
      });
  }

  fetchCarriers() {
    this.apiService
      .getData("contacts/get/type/carrier")
      .subscribe((result: any) => {
        result.forEach((element) => {
          if (element.isDeleted === 0) {
            this.carriers.push(element);
          }
        });
      });
  }

  fetchOwnerOperators() {
    this.apiService
      .getData(`contacts/get/type/ownerOperator`)
      .subscribe((result: any) => {
        result.forEach((element) => {
          if (element.isDeleted === 0) {
            this.ownerOperators.push(element);
          }
        });
      });
  }

  async fetchSearchData() {
    this.settlements = [];
    this.advancePayments = [];
    this.expenses = [];
    if (this.paymentData.entityId != null) {
      if (
        this.paymentData.fromDate !== null &&
        this.paymentData.toDate == null
      ) {
        this.toaster.error("Please select to date");
        return false;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.searchDisabled = true;
      this.fetchAdvancePayments();
      const result: any = await this.accountService
        .getData(
          `settlement/expenses/entity/${this.paymentData.entityId}?from=${this.paymentData.fromDate}&to=${this.paymentData.toDate}&type=${this.paymentData.paymentTo}&curr=${this.paymentData.currency}`
        )
        .toPromise();
      // .subscribe((result: any) => {
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.searchDisabled = false;
      result.map((u) => {
        u.selected = false;
      });
      this.settlements = result;
      // });
    } else {
      return false;
    }
  }

  fetchAdvancePayments() {
    this.dataMessageAdv = Constants.FETCHING_DATA;
    this.accountService
      .getData(
        `advance/entity/${this.paymentData.entityId}?from=${this.paymentData.fromDate}&to=${this.paymentData.toDate}&curr=${this.paymentData.currency}&type=expense`
      )
      .subscribe((result: any) => {
        if (result.length === 0) {
          this.dataMessageAdv = Constants.NO_RECORDS_FOUND;
        }
        this.advancePayments = result;
        this.advancePayments.map((v) => {
          v.selected = false;
          if (v.payMode) {
            v.payMode = v.payMode.replace("_", " ");
          }
          v.fullPayment = false;
          v.paidAmount = 0;
          v.paidStatus = false;
          v.status = v.status.replace("_", " ");
          v.errText = "";
          v.prevPaidAmount = Number(v.amount) - Number(v.pendingPayment);
          v.prevPaidAmount = v.prevPaidAmount.toFixed(2);
        });
      });
  }

  fetchAccounts() {
    this.accountService
      .getData(`chartAc/get/all/list`)
      .subscribe((result: any) => {
        this.accList = result;
      });
  }

  selectedSettlements() {
    let tripIDs = [];
    this.paymentData.settlementIds = [];
    this.settlements.map((p) => {
      if (p.selected) {
        this.paymentData.settlementIds.push(p.sttlID);
        tripIDs = tripIDs.concat(p.tripIds);
      }
    });
    if (tripIDs.length > 0) {
      let selTrips = encodeURIComponent(JSON.stringify(tripIDs));
      this.fetchExpenses(selTrips);
    }
  }

  fetchExpenses(tripIDs) {
    this.dataMessageExp = Constants.FETCHING_DATA;
    this.accountService
      .getData(`expense/getBy/trips/${tripIDs}`)
      .subscribe((result: any) => {
        if (result.length === 0) {
          this.dataMessageExp = Constants.NO_RECORDS_FOUND;
        }
        result.map((exp) => {
          exp.prevPaidAmount = Number(exp.finalTotal) - Number(exp.balance);
          exp.status = exp.status ? exp.status : "pending";
          exp.paidStatus = false;
          exp.errText = "";
        });
        this.expenses = result;
      });
  }

  assignFullPayment(type, index, data) {
    if (type === "expense") {
      if (data.fullPayment) {
        this.expenses[index].paidAmount = data.balance;
        this.expenses[index].selected = true;
        this.expenses[index].paidStatus = true;
      } else {
        this.expenses[index].paidAmount = 0;
        this.expenses[index].paidStatus = false;
      }
      this.selectedExpenses();
    } else {
      if (data.fullPayment) {
        this.advancePayments[index].paidAmount = data.pendingPayment;
        this.advancePayments[index].selected = true;
        this.advancePayments[index].paidStatus = true;
      } else {
        this.advancePayments[index].paidAmount = 0;
        this.advancePayments[index].paidStatus = false;
      }
      this.selectedAdvancepayments();
    }
  }

  selectedExpenses() {
    this.paymentData.expData = [];
    this.paymentData.expIds = [];
    this.paymentData.expTotal = 0;
    for (const element of this.expenses) {
      if (
        element.selected &&
        !this.paymentData.expIds.includes(element.expenseID)
      ) {
        let status = "deducted";
        if (Number(element.paidAmount) < Number(element.balance)) {
          status = "partially_deducted";
        }
        const obj = {
          expID: element.expenseID,
          amount: element.paidAmount,
          status: status,
          pendingAmount: Number(element.balance) - Number(element.paidAmount),
          tripID: element.tripID,
        };
        this.paymentData.expTotal += Number(element.paidAmount);
        this.paymentData.expData.push(obj);
        this.paymentData.expIds.push(element.expenseID);
      }
    }
    this.paymentCalculation();
  }

  checkInput(type, index = "") {
    if (type == "expense") {
      let expenseAmount = Number(this.expenses[index]["balance"]);
      let enteredAmount = Number(this.expenses[index]["paidAmount"]);
      if (enteredAmount < 0 || enteredAmount > expenseAmount) {
        this.expenses[index]["errText"] = "Please enter valid amount";
        // this.submitDisabled = true;
      } else {
        this.expenses[index]["errText"] = "";
        // this.submitDisabled = false;
      }
    } else if (type == "advance") {
      let advAmount = Number(this.advancePayments[index]["pendingPayment"]);
      let enteredAmount = Number(this.advancePayments[index]["paidAmount"]);

      if (enteredAmount < 0 || enteredAmount > advAmount) {
        this.advancePayments[index]["errText"] = "Please enter valid amount";
        // this.submitDisabled = true;
      } else {
        this.advancePayments[index]["errText"] = "";
        // this.submitDisabled = false;
      }

      this.selectedAdvancepayments();
    }
  }

  selectedAdvancepayments() {
    this.paymentData.advancePayIds = [];
    this.paymentData.advData = [];
    this.paymentData.advTotal = 0;
    for (const element of this.advancePayments) {
      if (
        element.selected &&
        !this.paymentData.advancePayIds.includes(element.paymentID)
      ) {
        let status = "deducted";
        if (Number(element.paidAmount) < Number(element.pendingPayment)) {
          status = "partially_deducted";
        }
        const obj = {
          paymentID: element.paymentID,
          amount: element.paidAmount,
          status: status,
          pendingAmount:
            Number(element.pendingPayment) - Number(element.paidAmount),
        };
        this.paymentData.advTotal += Number(element.paidAmount);
        this.paymentData.advancePayIds.push(element.paymentID);
        this.paymentData.advData.push(obj);
      }
    }
    this.paymentCalculation();
  }

  paymentCalculation() {
    this.paymentData.finalAmount = Math.abs(
      Number(this.paymentData.advTotal) - Number(this.paymentData.expTotal)
    );
  }

  addRecord() {
    if (this.paymentData.expTotal === 0) {
      this.toaster.error("Please enter expense amount");
      return false;
    }

    if (this.paymentData.advTotal === 0) {
      this.toaster.error("Please entter advance amount");
      return false;
    }

    for (const element of this.advancePayments) {
      if (element.selected && element.paidAmount == "") {
        this.toaster.error("Please enter valid advance payment");
        return false;
      }
    }

    this.submitDisabled = true;
    this.accountService
      .postData("expense-payments", this.paymentData)
      .subscribe({
        complete: () => {},
        error: (err: any) => {
          from(err.error)
            .pipe(
              map((val: any) => {
                val.message = val.message.replace(/".*"/, "This Field");
                this.errors[val.context.key] = val.message;
              })
            )
            .subscribe({
              complete: () => {
                this.submitDisabled = false;
                // this.throwErrors();
              },
              error: () => {
                this.submitDisabled = false;
              },
              next: () => {},
            });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.response = res;
          this.toaster.success("Expense payment added successfully.");
          this.router.navigateByUrl("/accounts/payments/expense-payments/list");
        },
      });
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
}

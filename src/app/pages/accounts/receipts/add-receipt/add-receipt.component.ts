import { AccountService, ApiService } from "./../../../../services";
import { ListService } from "./../../../../services/list.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { Router } from "@angular/router";
import { from } from "rxjs";
import { elementAt, map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
declare var $: any;
@Component({
  selector: "app-add-receipt",
  templateUrl: "./add-receipt.component.html",
  styleUrls: ["./add-receipt.component.css"],
})
export class AddReceiptComponent implements OnInit {
  pageTitle = "Add Receipt";
  public recID: string;
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  dataMessageAdv: string = Constants.NO_RECORDS_FOUND;
  customers: any = [];
  customersObjects = {};
  invoices = [];
  accounts: any = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  receiptData = {
    customerID: [],
    txnDate: moment().format("YYYY-MM-DD"),
    recNo: null,
    recAmount: 0,
    totalAmount: 0,
    discount: 0,
    recAmountCur: "CAD",
    accountID: null,
    // advAmt: 0,
    // advAmtCur: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    charges: {
      addition: [],
      deduction: [],
      addTotal: 0,
      dedTotal: 0,
      addAccountID: null,
      dedAccountID: null,
    },
    paidInvoices: [],
    transactionLog: [],
  };
  paymentMode = [
    {
      name: "Cash",
      value: "cash",
    },
    {
      name: "Cheque",
      value: "cheque",
    },
    {
      name: "EFT",
      value: "eft",
    },
    {
      name: "Credit Card",
      value: "creditCard",
    },
    {
      name: "Debit Card",
      value: "debitCard",
    },
    {
      name: "Demand Draft",
      value: "demandDraft",
    },
  ];
  advancePayments = [];
  paymentLabel = "";
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error = "";
  Success = "";
  submitDisabled = false;
  orderInvoices = [];
  totalReceivedAmt = 0;
  accList = [];
  advErr = "";
  newTotal = 0;
  totalErr = false;
  paidAmtErr = false;
  currency = "CAD";
  totalCur = "CAD";
  curError: true;
  rate = 0;
  searchDisabled = false;
  additionFields = {
    charge: "",
    desc: "",
    amount: 0,
  };
  dedFields = {
    charge: "",
    desc: "",
    amount: 0,
  };
  constructor(
    private listService: ListService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.listService.fetchCustomers();
    // this.customers = this.listService.customersList;
    this.fetchCustomersByIDs();
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.recID = this.route.snapshot.params[`recID`];
    if (this.recID) {
      this.pageTitle = "Edit Receipt";
    } else {
      this.pageTitle = "Add Receipt";
    }

    let customerList = new Array<any>();
    this.getValidCustomers(customerList);
    this.customers = customerList;
  }

  private getValidCustomers(customerList: any[]) {
    let ids = [];
    this.listService.customersList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          customerList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  recCurFn(e) {
    this.totalCur = e;
  }
  async getInvoices() {
    if (this.receiptData.customerID.length > 0) {
      this.searchDisabled = true;
      this.newTotal = 0;
      this.advancePayments = [];
      this.orderInvoices = [];
      this.invoices = [];

      this.dataMessage = Constants.FETCHING_DATA;
      const customerIDs = encodeURIComponent(
        JSON.stringify(this.receiptData.customerID)
      );
      this.accountService
        .getData(
          `order-invoice/customer/${customerIDs}?currency=${this.receiptData.recAmountCur}`
        )
        .subscribe((res: any) => {
          if (res.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (res !== undefined) {
            this.orderInvoices = res;
            this.orderInvoices.map((v: any) => {
              v.payDisable = false;
              v.discount = 0;
              v.invStatus = v.invStatus ? v.invStatus.replace("_", " ") : "";
            });
            // if (this.orderInvoices.length > 0) {
            //   this.receiptData.recAmountCur =
            //     this.orderInvoices[0].charges.freightFee.currency;
            // }
            for (const op of this.orderInvoices) {
              this.newTotal += op.balance;
              this.receiptData.totalAmount = this.newTotal;
            }
          }
        });
      this.accountService
        .getData(
          `invoices/customer/${customerIDs}?currency=${this.receiptData.recAmountCur}`
        )
        .subscribe((result) => {
          this.searchDisabled = false;
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result !== undefined) {
            this.invoices = result;
            this.invoices.map((v: any) => {
              v.payDisable = false;
              v.discount = 0;
              v.invStatus = v.invStatus.replace("_", " ");
            });
            // if (this.invoices.length > 0) {
            //   this.receiptData.recAmountCur = this.invoices[0].invCur;
            //   // this.receiptData.advAmtCur = this.invoices[0].invCur;
            // }
            for (const op of this.invoices) {
              this.newTotal += op.balance;
              this.receiptData.totalAmount = this.newTotal;
            }
          }
        });
    }
  }
  getConvertedCur(e) {
    this.accountService
      .getData(
        `receipts/convert/${this.currency}/${e}/${this.receiptData.recAmount}`
      )
      .subscribe((res) => {
        this.rate = res.rate.toFixed(2);
        this.receiptData.recAmount = res.result.toFixed(2);
      });
  }
  refreshAccount() {
    this.listService.fetchChartAccounts();
  }
  fetchAdvancePayments() {
    this.dataMessageAdv = Constants.FETCHING_DATA;
    const fromDate = null;
    const toDate = null;
    this.accountService
      .getData(
        `advance/entity/${this.receiptData.customerID}?from=${fromDate}
          &to=${toDate}`
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
          v.payDisable = false;
          v.paidAmount = 0;
          v.paidStatus = false;

          v.status = v.status.replace("_", " ");
          v.errText = "";

          v.prevPaidAmount = Number(v.amount) - Number(v.pendingPayment);
          v.prevPaidAmount = v.prevPaidAmount.toFixed(2);
        });
      });
  }
  /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByIDs() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.customersObjects = result;
    });
  }
  showPaymentFields(type) {
    if (type === "creditCard") {
      this.paymentLabel = "Credit Card";
    } else if (type === "debitCard") {
      this.paymentLabel = "Debit Card";
    } else if (type === "demandDraft") {
      this.paymentLabel = "Demand Card";
    } else if (type === "eft") {
      this.paymentLabel = "EFT";
    } else if (type === "cash") {
      this.paymentLabel = "Cash";
    } else if (type === "cheque") {
      this.paymentLabel = "Cheque";
    }
  }

  getAmountOrder(j: any) {
    if (this.orderInvoices[j].fullPayment === true) {
      this.orderInvoices[j].payDisable = true;
      this.orderInvoices[j].amountPaid =
        Number(this.orderInvoices[j].balance) -
        Number(this.orderInvoices[j].discount);
    } else {
      this.orderInvoices[j].payDisable = false;
      this.orderInvoices[j].amountPaid = 0;
    }

    this.applyDiscount(j, "order");

    // if (this.orderInvoices[j].fullPayment === true) {
    //   this.orderInvoices[j].amountPaid = this.orderInvoices[j].balance;
    // } else if (
    //   this.orderInvoices[j].fullPayment === true &&
    //   this.orderInvoices[j].invStatus === "partially_paid"
    // ) {
    //   this.orderInvoices[j].amountPaid = this.orderInvoices[j].balance;
    // } else {
    //   this.orderInvoices[j].amountPaid = 0;
    // }

    this.findReceivedAmtFn();
  }
  getAmountManual(k: any) {
    if (this.invoices[k].fullPayment === true) {
      this.invoices[k].amountPaid =
        Number(this.invoices[k].balance) - Number(this.invoices[k].discount);
    } else {
      this.invoices[k].amountPaid = 0;
    }
    this.applyDiscount(k, "inv");
    // if (this.invoices[k].fullPayment === true) {
    //   this.invoices[k].amountPaid = this.invoices[k].balance;
    // } else if (
    //   this.invoices[k].fullPayment === true &&
    //   this.invoices[k].invStatus === "partially_paid"
    // ) {
    //   this.invoices[k].amountPaid = this.invoices[k].balance;
    // } else {
    //   this.invoices[k].amountPaid = 0;
    // }
    this.findReceivedAmtFn();
  }
  async getPaidInvoices() {
    const paidInvoices = [];
    for (const element of this.orderInvoices) {
      if (element.amountPaid !== 0 && element.amountPaid !== undefined) {
        const obj = {
          invID: element.invID,
          invNo: element.invNo,
          // amountReceived: element.amountReceived,
          fullPayment: element.fullPayment,
          invType: "orderInvoice",
          amountPaid: element.amountPaid,
          balance: element.balance,
          invCur: element.charges.freightFee.currency,
          discount: element.discount,
          invBalance: element.invBalance,
        };
        paidInvoices.push(obj);
      }
    }
    for (const element of this.invoices) {
      if (element.amountPaid !== 0 && element.amountPaid !== undefined) {
        const obj = {
          invID: element.invID,
          invNo: element.invNo,
          // amountReceived: element.amountReceived,
          fullPayment: element.fullPayment,
          invType: "manual",
          amountPaid: element.amountPaid,
          balance: element.balance,
          invCur: element.invCur,
          discount: element.discount,
          invBalance: element.invBalance,
        };
        paidInvoices.push(obj);
      }
    }
    this.receiptData[`paidInvoices`] = paidInvoices;
  }

  matchPayment() {
    for (const element of this.invoices) {
      if (element.amountPaid === element.balance) {
        element.fullPayment = true;
      } else {
        element.fullPayment = false;
      }
    }
    for (const element of this.orderInvoices) {
      if (element.amountPaid === element.balance) {
        element.fullPayment = true;
      } else {
        element.fullPayment = false;
      }
    }
  }

  async addReceipt() {
    if (this.receiptData.recAmount === 0) {
      this.toastr.error("Select invoice");
    } else {
      this.submitDisabled = true;
      this.errors = {};
      this.hasError = false;
      this.hasSuccess = false;
      await this.getPaidInvoices();
      this.accountService.postData("receipts", this.receiptData).subscribe({
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
          this.toastr.success("Receipt added successfully.");
          this.router.navigateByUrl("/accounts/receipts/list");
        },
      });
    }
  }
  findReceivedAmtFn() {
    this.matchPayment();
    this.totalReceivedAmt = 0;
    for (const element of this.invoices) {
      this.totalReceivedAmt += element.amountPaid;
    }
    for (const element of this.orderInvoices) {
      this.totalReceivedAmt += element.amountPaid;
    }
    this.receiptData.recAmount = this.totalReceivedAmt;
    if (this.receiptData.recAmount > this.receiptData.totalAmount) {
      this.totalErr = true;
    } else {
      this.totalErr = false;
    }
  }

  addAdditionRow() {
    if (this.additionFields.charge != "" && this.additionFields.amount > 0) {
      this.receiptData.charges.addition.push(this.additionFields);
      this.additionFields = {
        charge: "",
        desc: "",
        amount: 0,
      };
      this.calcAdditionTotal();
    }
  }

  calcAdditionTotal() {
    this.receiptData.charges.addTotal = 0;
    this.receiptData.charges.addition.forEach((element) => {
      this.receiptData.charges.addTotal += Number(element.amount);
    });
  }

  delAddData(index) {
    this.receiptData.charges.addition.splice(index, 1);
    this.calcAdditionTotal();
  }

  addDeductionRow() {
    if (this.dedFields.charge != "" && this.dedFields.amount > 0) {
      this.receiptData.charges.deduction.push(this.dedFields);
      this.dedFields = {
        charge: "",
        desc: "",
        amount: 0,
      };
      this.calcDedTotal();
    }
  }

  calcDedTotal() {
    this.receiptData.charges.dedTotal = 0;
    this.receiptData.charges.deduction.forEach((element) => {
      this.receiptData.charges.dedTotal += Number(element.amount);
    });
  }

  delDedData(index) {
    this.receiptData.charges.deduction.splice(index, 1);
    this.calcDedTotal();
  }

  calDiscountTotal() {
    this.receiptData.discount = 0;

    this.invoices.map((v) => {
      if (v.amountPaid > 0) {
        this.receiptData.discount += Number(v.discount);
      }
    });

    this.orderInvoices.map((v) => {
      if (v.amountPaid > 0) {
        this.receiptData.discount += Number(v.discount);
      }
    });
  }

  applyDiscount(index, type) {
    if (type === "order") {
      let userPay =
        Number(this.orderInvoices[index].discount) +
        Number(this.orderInvoices[index].amountPaid);
      if (userPay < 0 || userPay > this.orderInvoices[index].balance) {
        this.orderInvoices[index].discount = 0;
      }
      userPay =
        Number(this.orderInvoices[index].discount) +
        Number(this.orderInvoices[index].amountPaid);
      this.orderInvoices[index]["invBalance"] =
        this.orderInvoices[index].balance - userPay;

      if (this.orderInvoices[index]["invBalance"] < 0) {
        this.totalErr = true;
      } else {
        this.totalErr = false;
      }
    } else if (type === "inv") {
      let userPay =
        Number(this.invoices[index].discount) +
        Number(this.invoices[index].amountPaid);

      if (userPay < 0 || userPay > this.invoices[index].balance) {
        this.invoices[index].discount = 0;
      }

      userPay =
        Number(this.invoices[index].discount) +
        Number(this.invoices[index].amountPaid);

      this.invoices[index]["invBalance"] =
        this.invoices[index].balance - userPay;

      if (this.invoices[index]["invBalance"] < 0) {
        this.totalErr = true;
      } else {
        this.totalErr = false;
      }
    }

    this.calDiscountTotal();
  }
}

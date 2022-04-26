import { Component, OnInit } from "@angular/core";
import Constants from "src/app/pages/fleet/constants";
import * as moment from "moment";
import { Location } from "@angular/common";
import { ListService } from "src/app/services/list.service";
import { AccountService } from "src/app/services/account.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { v4 as uuidv4 } from "uuid";
@Component({
  selector: "app-add-vendor-payment",
  templateUrl: "./add-vendor-payment.component.html",
  styleUrls: ["./add-vendor-payment.component.css"],
})
export class AddVendorPaymentComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  dataMessageAdv: string = Constants.NO_RECORDS_FOUND;

  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  paymentData = {
    txnDate: moment().format("YYYY-MM-DD"),
    vendorID: null,
    refNo: "",
    currency: "CAD",
    accountID: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    billIds: [],
    billData: [],
    advIds: [],
    advData: [],
    total: {
      subTotal: 0,
      advTotal: 0,
      finalTotal: 0,
      detailTotal: 0
    },
    detail: [{
      comm: "",
      qty: "",
      qtyTyp: null,
      rate: "",
      rateTyp: null,
      amount: 0,
      accountID: null,
      description: "",
      rowID: "",
    },]
  };
  quantityTypes = [];
  vendors = [];
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
      value: "credit_card",
    },
    {
      name: "Debit Card",
      value: "debit_card",
    },
    {
      name: "Demand Draft",
      value: "demand_draft",
    },
  ];
  paymentLabel = "";
  accounts;
  bills = [];
  advancePayments = [];
  submitDisabled = false;
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";

  showModal = false;

  constructor(
    private listService: ListService,
    private accountService: AccountService,
    private location: Location,
    private toaster: ToastrService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.listService.fetchVendors();
    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;

    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchQuantityTypes();
  }


  private getValidVendors(vendorList: any[]) {
    let ids = [];
    this.listService.vendorList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          vendorList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  showPaymentFields(type) {
    if (type === "credit_card") {
      this.paymentLabel = "Credit Card";
    } else if (type === "debit_card") {
      this.paymentLabel = "Debit Card";
    } else if (type === "demand_draft") {
      this.paymentLabel = "Demand Draft";
    } else if (type === "eft") {
      this.paymentLabel = "EFT";
    } else if (type === "cash") {
      this.paymentLabel = "Cash";
    } else if (type === "cheque") {
      this.paymentLabel = "Cheque";
    }
    this.paymentData.payModeNo = "";
    this.paymentData.payModeDate = null;
  }

  fetchVendorData() {
    this.bills = [];
    this.advancePayments = [];
    this.dataMessage = Constants.FETCHING_DATA;
    this.dataMessageAdv = Constants.FETCHING_DATA;
    this.fetchVendorBills();
    this.fetchVendorAdvance();
  }

  async fetchVendorBills() {
    if (this.paymentData.vendorID) {
      let result: any = await this.accountService
        .getData(
          `bills/vendor/all/${this.paymentData.vendorID}?currency=${this.paymentData.currency}`
        )
        .toPromise();
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;

      }
      if (result.length > 0) {

        result.map((v) => {
          v.selected = false;
          v.prevPaidAmount = Number(v.total.finalTotal) - Number(v.balance);
          v.paidStatus = false;
          v.fullPayment = false;
          v.paidAmount = 0;
          v.newStatus = v.status.replace("_", " ");
        });
        this.bills = result;
      }
    } else {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
  }

  async fetchVendorAdvance() {
    if (this.paymentData.vendorID) {
      let result: any = await this.accountService
        .getData(
          `advance/allPayments/entity/${this.paymentData.vendorID}/${this.paymentData.currency}`
        )
        .toPromise();
      if (result.length === 0) {
        this.dataMessageAdv = Constants.NO_RECORDS_FOUND;
      }
      result.map((v) => {
        v.selected = false;
        v.prevPaidAmount = Number(v.amount) - Number(v.pendingPayment);
        v.paidStatus = false;
        v.fullPayment = false;
        v.paidAmount = 0;
        v.newStatus = v.status.replace("_", " ");
      });
      this.advancePayments = result;
    } else {
      this.dataMessageAdv = Constants.NO_RECORDS_FOUND;
    }
  }

  assignFullPayment(index, data) {
    if (data.fullPayment) {
      this.bills[index].paidAmount = this.bills[index].balance;
      this.bills[index].status = "deducted";
    } else {
      this.bills[index].paidAmount = 0;
      this.bills[index].status = "open";
    }
    this.billsTotal();
  }

  assignFullPaymentAdv(index, data) {
    if (data.fullPayment) {
      this.advancePayments[index].paidAmount =
        this.advancePayments[index].pendingPayment;
      this.advancePayments[index].status = "deducted";
    } else {
      this.advancePayments[index].paidAmount = 0;
      this.advancePayments[index].status = "not_deducted";
    }
    this.advanceTotal();
  }

  billsTotal() {
    let subtotal = 0;
    this.paymentData.billIds = [];
    this.paymentData.billData = [];

    for (let i = 0; i < this.bills.length; i++) {
      const element = this.bills[i];
      if (element.selected) {
        subtotal += Number(element.paidAmount);

        let status = "";
        if (Number(element.paidAmount) === Number(element.balance)) {
          status = "paid";
        } else if (
          Number(element.paidAmount) > 0 &&
          Number(element.paidAmount) < Number(element.balance)
        ) {
          status = "partially_paid";
        } else {
          status = "open";
        }

        element.status = status;
        if (!this.paymentData.billIds.includes(element.billID)) {
          this.paymentData.billIds.push(element.billID);
          let obj = {
            billID: element.billID,
            status: status,
            paidAmount: element.paidAmount,
            totalAmount: element.balance,
            pendingAmount: Number(element.balance) - Number(element.paidAmount),
          };
          this.paymentData.billData.push(obj);
        }
      }
    }
    this.paymentData.total.subTotal = subtotal + this.paymentData.total.detailTotal;
    this.calculateFinalTotal();
  }

  calculateFinalTotal() {

    this.paymentData.total.finalTotal =
      this.paymentData.total.subTotal - this.paymentData.total.advTotal;
  }

  advanceTotal() {
    this.paymentData.total.advTotal = 0;
    this.paymentData.advIds = [];
    this.paymentData.advData = [];
    for (let i = 0; i < this.advancePayments.length; i++) {
      const element = this.advancePayments[i];
      if (element.selected) {
        this.paymentData.total.advTotal += Number(element.paidAmount);

        let status = "";
        if (Number(element.paidAmount) === Number(element.pendingPayment)) {
          status = "deducted";
        } else if (
          Number(element.paidAmount) > 0 &&
          Number(element.paidAmount) < Number(element.pendingPayment)
        ) {
          status = "partially_deducted";
        } else {
          status = "not_deducted";
        }

        element.status = status;
        if (!this.paymentData.advIds.includes(element.paymentID)) {
          this.paymentData.advIds.push(element.paymentID);
          let obj = {
            paymentID: element.paymentID,
            status: status,
            paidAmount: element.paidAmount,
            totalAmount: element.pendingPayment,
            pendingAmount:
              Number(element.pendingPayment) - Number(element.paidAmount),
          };
          this.paymentData.advData.push(obj);
        }
      }
    }
    this.calculateFinalTotal();
  }

  addRecord() {
    this.submitDisabled = true;
    this.accountService
      .postData("purchase-payments", this.paymentData)
      .subscribe({
        complete: () => { },
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
              next: () => { },
            });
        },
        next: (res) => {
          this.submitDisabled = false;
          this.response = res;
          this.toaster.success("Payment added successfully.");
          this.cancel();
        },
      });
  }

  cancel() {
    this.location.back();
  }

  setQuanType(val: string, index: number) {
    this.paymentData.detail[index].qtyTyp = val;
    this.paymentData.detail[index].rateTyp = val;
  }

  addDetail() {
    let obj = {
      comm: "",
      qty: "",
      qtyTyp: null,
      rate: "",
      rateTyp: null,
      amount: 0,
      accountID: null,
      description: "",
      rowID: uuidv4(),
    };
    const lastAdded = this.paymentData.detail[this.paymentData.detail.length - 1];
    if (
      lastAdded.comm !== "" &&
      lastAdded.qty !== "" &&
      lastAdded.qtyTyp !== null &&
      lastAdded.rate !== "" &&
      lastAdded.rateTyp !== null &&
      lastAdded.amount !== 0 &&
      lastAdded.accountID !== null
    ) {
      this.paymentData.detail.push(obj);
    }
  }

  delDetail(index) {
    if (this.paymentData.detail.length > 1) {
      this.paymentData.detail.splice(index, 1);
    }
    this.detailsTotal();
  }


  detailsTotal() {
    this.paymentData.total.detailTotal = 0;
    this.paymentData.detail.forEach((element) => {
      this.paymentData.total.detailTotal += Number(element.amount);
    });
    this.billsTotal();
  }

  calcDetailAmount(index: number) {
    if (!this.paymentData.detail[index].rate) {
      this.paymentData.detail[index].rate = "0";
    }
    if (!this.paymentData.detail[index].qty) {
      this.paymentData.detail[index].qty = "0";
    }
    if (this.paymentData.detail[index].qty && this.paymentData.detail[index].rate) {
      this.paymentData.detail[index].amount =
        Number(this.paymentData.detail[index].qty) *
        Number(this.paymentData.detail[index].rate);
    }
    this.detailsTotal();

  }

  fetchQuantityTypes() {
    this.httpClient
      .get("assets/jsonFiles/quantityTypes.json")
      .subscribe((data: any) => {
        this.quantityTypes = data;
      });
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.vendorID,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.total.finalTotal,
      type: "purchasePayment",
      paymentTo: 'vendor',
      chequeNo: this.paymentData.payModeNo,
      currency: this.paymentData.currency,
      showModal: this.showModal,
      fromDate: this.paymentData.txnDate,
      finalAmount: this.paymentData.total.finalTotal,
      txnDate: this.paymentData.txnDate,
      page: "addForm",
      advance: this.paymentData.total.advTotal
    };

    this.listService.openPaymentChequeModal(obj);
  }

}

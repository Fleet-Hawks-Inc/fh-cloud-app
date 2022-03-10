import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import * as moment from "moment";
import { AccountService } from "src/app/services/account.service";
import { ListService } from "src/app/services/list.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as html2pdf from "html2pdf.js";
@Component({
  selector: "app-expense-payment-detail",
  templateUrl: "./expense-payment-detail.component.html",
  styleUrls: ["./expense-payment-detail.component.css"],
})
export class ExpensePaymentDetailComponent implements OnInit {
  @ViewChild("previewExpPayment", { static: true })
  previewExpPayment: TemplateRef<any>;

  paymentData = {
    entityName: "",
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
    isFeatEnabled: false,
  };
  showModal = false;
  paymentID = "";
  accountsObjects = {};
  expPayRef: any;
  downloadDisabled = true;
  companyLogo: string;
  tagLine: string;
  carrierName: string;

  constructor(
    private accountService: AccountService,
    private listService: ListService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    // this.fetchAccountsByIDs();
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
      page: "detail",
    };
    this.listService.openPaymentChequeModal(obj);
  }

  async fetchPayment() {
    this.downloadDisabled = true;
    const result: any = await this.accountService
      .getData(`expense-payments/detail/${this.paymentID}`)
      .toPromise();
    this.paymentData = result;
    this.companyLogo = result.carrierDtl.logo;
    this.tagLine = result.carrierDtl.tagLine;
    this.carrierName = result.carrierDtl.carrierName;
    this.downloadDisabled = false;
    if (!this.paymentData.isFeatEnabled) {
      this.fetchAccountsByIDs();
    }
  }

  async fetchAccountsByIDs() {
    this.accountsObjects = await this.accountService
      .getData("chartAc/get/all/list")
      .toPromise();
  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "preview-sale-order",
    };
    this.expPayRef = this.modalService.open(this.previewExpPayment, ngbModalOptions)
  }

  generatePaymentPDF() {
    let data = document.getElementById("print-exp-pay");
    html2pdf(data, {
      margin: 0.5,
      pagebreak: { mode: "avoid-all", before: 'print-exp-pay' },
      filename: `expense-payment-${this.paymentData.paymentNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, logging: true, dpi: 192, letterRendering: true, allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    this.expPayRef.close();
    this.downloadDisabled = false;
  }
}

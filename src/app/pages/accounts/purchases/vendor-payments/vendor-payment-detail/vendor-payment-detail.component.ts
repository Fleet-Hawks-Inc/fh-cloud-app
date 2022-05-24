import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, ListService } from "src/app/services";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import * as html2pdf from "html2pdf.js";
@Component({
  selector: "app-vendor-payment-detail",
  templateUrl: "./vendor-payment-detail.component.html",
  styleUrls: ["./vendor-payment-detail.component.css"],
})
export class VendorPaymentDetailComponent implements OnInit {
  @ViewChild("previewVenPayment", { static: true })
  previewVenPayment: TemplateRef<any>;
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  paymentData = {
    paymentNo: "",
    txnDate: null,
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
    },
    transactionLog: [],
  };
  vendorName = "";
  paymentID;
  bills = {};
  downloadDisabled = true;
  downloadDisabledpdf = true;
  venPayRef: any;
  pendingAmt: any;
  companyLogo: string;
  tagLine: string;
  carrierName: string;
  showModal = false;

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private listService: ListService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    await this.fetchPayments();
    this.fetchVendor();
    this.fetchBills();
  }

  async fetchPayments() {
    let result: any = await this.accountService
      .getData(`purchase-payments/details/${this.paymentID}`)
      .toPromise();
    this.downloadDisabled = false;
    this.downloadDisabledpdf = false;
    this.paymentData = result[0];
    this.pendingAmt = this.paymentData.total.finalTotal - this.paymentData.total.advTotal;
    this.companyLogo = result[0].carrierDtl.logo;
    this.tagLine = result[0].carrierDtl.tagLine;
    this.carrierName = result[0].carrierDtl.carrierName;
    this.paymentData.payMode = this.paymentData.payMode.replace("_", " ");
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/minor/detail/${this.paymentData.vendorID}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.vendorName = result.Items[0].cName;
    }
  }

  async fetchBills() {
    let result: any = await this.accountService
      .getData(`bills/get/list`)
      .toPromise();
    this.bills = result;
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
      page: "detail",
      advance: this.paymentData.total.advTotal
    };
    this.listService.openPaymentChequeModal(obj);
  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "preview-adv-pay",
    };
    this.venPayRef = this.modalService.open(this.previewVenPayment, ngbModalOptions)
  }

  generatePaymentPDF() {
    let data = document.getElementById("print-adv-pay");
    html2pdf(data, {
      margin: 0.5,
      pagebreak: { mode: "avoid-all", before: 'print-adv-pay' },
      filename: `advance-payment-${this.paymentData.paymentNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, logging: true, dpi: 192, letterRendering: true, allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    this.venPayRef.close();
    this.downloadDisabled = false;
  }

}

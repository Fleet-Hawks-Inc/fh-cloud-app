import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, ListService } from "src/app/services";
import * as html2pdf from "html2pdf.js";

@Component({
  selector: "app-advance-payments-detail",
  templateUrl: "./advance-payments-detail.component.html",
  styleUrls: ["./advance-payments-detail.component.css"],
})
export class AdvancePaymentsDetailComponent implements OnInit {
  @ViewChild("previewAdvPayment", { static: true })
  previewAdvPayment: TemplateRef<any>;

  dataMessage: string = Constants.FETCHING_DATA;
  noRecordMsg = Constants.NO_RECORDS_FOUND;
  paymentData = {
    paymentNo: "",
    advType: null,
    paymentTo: null,
    entityId: null,
    amount: "",
    currency: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    txnDate: null,
    referenceNo: "",
    notes: "",
    accountID: null,
    status: "",
    transactionLog: [],
    isFeatEnabled: false,
  };
  paymentID;
  entityName = "";
  payModeLabel = "";
  accountName = "";
  accountsObjects: any = {};
  accountsIntObjects: any = {};
  advancePayments = [];
  showModal = false;
  advPayRef: any;
  companyLogo: string;
  tagLine: string;
  carrierName: string;
  pendingAmt: string;
  deductedAmt: any;
  downloadDisabled = true;
  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private listService: ListService
  ) { }

  ngOnInit() {
    this.paymentID = this.route.snapshot.params[`paymentID`];
    this.fetchPayments();
    // this.fetchAccountsByIDs();
    // this.fetchAccountsByInternalIDs();
  }
  fetchAccountsByIDs() {
    this.accountService
      .getData("chartAc/get/list/all")
      .subscribe((result: any) => {
        this.accountsObjects = result;
      });
  }
  fetchAccountsByInternalIDs() {
    this.accountService
      .getData("chartAc/get/internalID/list/all")
      .subscribe((result: any) => {
        this.accountsIntObjects = result;
      });
  }
  fetchPayments() {
    this.accountService
      .getData(`advance/detail/${this.paymentID}`)
      .subscribe((result: any) => {
        this.paymentData = result[0];
        this.companyLogo = result[0].carrierDtl.logo;
        this.tagLine = result[0].carrierDtl.tagLine;
        this.carrierName = result[0].carrierDtl.carrierName;
        this.deductedAmt = result[0].amount - result[0].pendingPayment;
        this.pendingAmt = result[0].pendingPayment;
        this.downloadDisabled = false;
        this.fetchAdvPayments();
        if (!this.paymentData.isFeatEnabled) {
          this.fetchAccountsByIDs();
          this.fetchAccountsByInternalIDs();
        }
        this.paymentData.transactionLog.map((v: any) => {
          v.type = v.type.replace("_", " ");
        });
        if (this.paymentData.status) {
          this.paymentData.status = this.paymentData.status.replace("_", " ");
        }

        this.changePaymentMode(this.paymentData.payMode);
        if (this.paymentData.paymentTo === "driver") {
          this.fetchDriverDetail(this.paymentData.entityId);
        } else if (this.paymentData.paymentTo === "employee") {
          this.fetchEmployee(this.paymentData.entityId);
        } else {
          this.fetchContact(this.paymentData.entityId);
        }
        this.fetchAcounts(this.paymentData.accountID);
      });
  }

  fetchDriverDetail(driverID) {
    this.apiService.getData(`drivers/${driverID}`).subscribe((result: any) => {
      console.log('result.Items[0]', result.Items[0])
      this.entityName = `${result.Items[0].firstName} ${result.Items[0].middleName} ${result.Items[0].lastName} `;
    });
  }

  fetchContact(contactID) {
    this.apiService
      .getData(`contacts/detail/${contactID}`)
      .subscribe((result: any) => {
        this.entityName = result.Items[0].cName;
      });
  }
  fetchEmployee(contactID) {
    this.apiService
      .getData(`contacts/detail/${contactID}`)
      .subscribe((result: any) => {
        this.entityName = `${result.Items[0].firstName} ${result.Items[0].lastName} `;
      });
  }

  changePaymentMode(type) {
    let label = "";
    if (type == "cash") {
      label = "Cash";
    } else if (type == "cheque") {
      label = "Cheque";
    } else if (type == "eft") {
      label = "EFT";
    } else if (type == "credit_card") {
      label = "Credit Card";
    } else if (type == "debit_card") {
      label = "Debit Card";
    } else if (type == "demand_draft") {
      label = "Demand Draft";
    }
    this.payModeLabel = label;
  }

  fetchAcounts(accountID) {
    this.accountService
      .getData(`chartAc/account/${accountID}`)
      .subscribe((result: any) => {
        this.accountName = result.actName;
      });
  }

  fetchAdvPayments() {
    let url = "";
    if (this.paymentData.paymentTo === "employee") {
      url = "employee-payments/advance";
    } else {
      url = "driver-payments/advance";
    }
    this.accountService
      .getData(`${url}/${this.paymentID}`)
      .subscribe((result: any) => {
        result.map((v) => {
          let obj = {
            paymentNo: v.paymentNo,
            txnDate: v.txnDate,
            amount: 0,
          };
          v.advData.map((k) => {
            if (k.paymentID === this.paymentID) {
              obj.amount += Number(k.paidAmount);
            }
          });

          this.advancePayments.push(obj);
          this.advancePayments.sort((a, b) => {
            return (
              new Date(a.txnDate).valueOf() - new Date(b.txnDate).valueOf()
            );
          });
        });
      });
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.amount,
      type: "advancePayment",
      paymentTo: this.paymentData.paymentTo,
      chequeNo: this.paymentData.payModeNo,
      currency: this.paymentData.currency,
      showModal: this.showModal,
      fromDate: this.paymentData.txnDate,
      finalAmount: this.paymentData.amount,
      txnDate: this.paymentData.txnDate,
      advType: this.paymentData.advType,
      page: 'detail'
    };
    this.listService.openPaymentChequeModal(obj);
  }


  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "preview-adv-pay",
    };
    this.advPayRef = this.modalService.open(this.previewAdvPayment, ngbModalOptions)
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
    this.advPayRef.close();
    this.downloadDisabled = false;
  }
}

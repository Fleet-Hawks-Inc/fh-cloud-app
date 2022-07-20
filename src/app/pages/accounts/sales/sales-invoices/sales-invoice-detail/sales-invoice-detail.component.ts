import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, ApiService } from 'src/app/services';
import * as html2pdf from "html2pdf.js";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-invoice-detail',
  templateUrl: './sales-invoice-detail.component.html',
  styleUrls: ['./sales-invoice-detail.component.css']
})
export class SalesInvoiceDetailComponent implements OnInit {
  @ViewChild("previewSaleInvoice", { static: true })
  previewSaleInvoice: TemplateRef<any>;

  saleID: any;

  txnDate: string;
  payStatus: string;
  cName: string;
  cusAddress: string;
  cusEmail: string;
  cusPhone: string;
  finalTotal: any;
  currency: string;
  shipDate: string;
  sRef: string;
  salePerson: string;
  remarks: string;
  sOrderDetails: string;
  status: string;
  sInvNo: string;
  taxes: string;
  accFees: string;
  accDed: string;
  paymentTerm: string;
  dueDate: string;
  customersObjects: any;

  transactionLog = [];

  balance: any;
  received: any;

  isInvDue: boolean;
  saleInvPrev: any;
  logo: string;
  tagline: string;
  chargeName: string;
  chargeType: string;
  chargeAmount: string;
  isPDF: boolean = false;
  emailDisabled = false;
  constructor(public accountService: AccountService, private toaster: ToastrService, private modalService: NgbModal, public apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.fetchSaleOrder();
    }
  }


  fetchSaleOrder() {
    this.accountService.getData(`sales-invoice/detail/${this.saleID}`).subscribe(res => {
      let result = res[0];

      this.txnDate = result.txnDate;
      this.cName = result.customerName;
      this.cusAddress = result.address;
      this.cusPhone = result.workPhone;
      this.cusEmail = result.workEmail;
      this.finalTotal = result.total.finalTotal;
      this.balance = result.balance;
      this.received = this.finalTotal - this.balance;
      this.currency = result.currency;
      this.paymentTerm = result.paymentTerm;
      this.dueDate = result.dueDate;
      this.shipDate = result.shipDate;
      this.sRef = result.sRef;
      this.salePerson = result.salePerson;
      this.remarks = result.remarks;
      this.sOrderDetails = result.sOrderDetails;
      this.status = result.status;
      this.sInvNo = result.sInvNo;
      this.taxes = result.charges.taxes;
      this.chargeName = result.charges.cName;
      this.chargeType = result.charges.cType;
      this.chargeAmount = result.charges.cAmount;
      this.isPDF = true;
      this.isInvDue = result.due;
      this.logo = result.logo;
      this.tagline = result.tagline;
      this.payStatus = result.payStatus;
      this.transactionLog = result.transactionLog;
    });
  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "preview-sale-invoice",
    };
    this.saleInvPrev = this.modalService.open(this.previewSaleInvoice, ngbModalOptions)
  }


  generatePDF() {

    var data = document.getElementById("print_invoice");
    html2pdf(data, {
      margin: 0.5,
      pagebreak: { mode: "avoid-all", before: "print_invoice" },
      filename: "sale-invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    });

    this.saleInvPrev.close();

  }

  async sendConfirmationEmail() {
    this.emailDisabled = true;
    let result: any = await this.accountService
      .getData(`sales-invoice/send/confirmation-email/${this.saleID}`)
      .toPromise();
    this.emailDisabled = false;
    if (result) {
      this.toaster.success("Email sent successfully");
    } else {
      this.toaster.error("Something went wrong.");
    }
  }

}

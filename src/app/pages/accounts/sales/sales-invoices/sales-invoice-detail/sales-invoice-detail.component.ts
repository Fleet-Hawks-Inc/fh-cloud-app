import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, ApiService } from 'src/app/services';

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
  customerID: string = '';
  finalTotal: any;
  currency: string;
  shipDate: string;
  sRef: string;
  salePerson: string;
  remarks: string;
  sOrderDetails: string;
  status: string;
  sOrNo: string;
  taxes: string;
  accFees: string;
  accDed: string;
  paymentTerm: string;
  dueDate: string;
  customersObjects: any;

  balance: any;
  received: any;

  saleInvPrev: any;
  chargeName: string;
  chargeType: string;
  chargeAmount: string;
  isPDF: boolean = false;
  constructor(public accountService: AccountService, private modalService: NgbModal, public apiService: ApiService, private route: ActivatedRoute) { }

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
      this.customerID = result.customerID;
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
      this.sOrNo = result.sOrNo;
      this.taxes = result.charges.taxes;
      this.chargeName = result.charges.cName;
      this.chargeType = result.charges.cType;
      this.chargeAmount = result.charges.cAmount;
      this.isPDF = true;
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

}

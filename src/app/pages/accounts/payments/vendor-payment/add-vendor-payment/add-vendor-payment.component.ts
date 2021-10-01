import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ListService } from 'src/app/services/list.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-add-vendor-payment',
  templateUrl: './add-vendor-payment.component.html',
  styleUrls: ['./add-vendor-payment.component.css']
})
export class AddVendorPaymentComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  paymentData = {
    entityId: null,
    txnDate: moment().format('YYYY-MM-DD'),
    payCur: null,
    paymentNo: '',
    drAct: null,
    accountID: null,
    payMode: null,
    payModeNo: '',
    payModeDate: null,
    paymentTotal: 0,
    attachments: [],
    transactionLog: [],
    invoices: [],
    remarks: null
  };
  documentSlides = [];
  uploadedDocs = [];
  payModeLabel = '';
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = false;
  paymentID;
  vendors;
  accounts: any = [];
  invoiceData = {
    invoiceNo: null,
    desc: '',
    amount: 0,
    currency: 'CAD',
    conAmt: 0,
    conCur: null
};
dateMinLimit = { year: 1950, month: 1, day: 1 };
date = new Date();
futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
showModal = false;
pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  constructor(private listService: ListService,
              private toaster: ToastrService,
              private location: Location,
              private domSanitizer: DomSanitizer,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.listService.fetchVendors();
    this.vendors = this.listService.vendorList;
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
  }
  changePayCur() {
    this.paymentData.invoices = [];
    this.paymentData.paymentTotal = 0;
  }
  addInvoice() {
    let outputCur = this.paymentData.payCur;
    let baseCur;
    if (outputCur === 'CAD') {
      baseCur = 'USD';
    } else {
      baseCur = 'CAD';
    }
    let amount = this.invoiceData.amount;
    if (this.invoiceData.invoiceNo != null && this.invoiceData.amount !== 0 && this.invoiceData.currency !== null) {
      if (this.invoiceData.currency === this.paymentData.payCur) {
        this.invoiceData.conAmt = amount;
        this.invoiceData.conCur = 'CAD';
        this.paymentData.invoices.push(this.invoiceData);
        this.invoiceData = {
            invoiceNo: null,
            desc: '',
            amount: 0,
            currency: 'CAD',
            conAmt: 0,
            conCur: null
        };
        this.calculateInvoiceTotal();
      } else {
        this.accountService.getData(`currency-conversion/convert/${baseCur}/${outputCur}/${amount}`).subscribe((res) => {
          if (res) {
            this.invoiceData.conAmt = +res.toFixed(2);
            this.invoiceData.conCur = outputCur;
            this.paymentData.invoices.push(this.invoiceData);
            this.invoiceData = {
                invoiceNo: null,
                desc: '',
                amount: 0,
                currency: 'CAD',
                conAmt: 0,
                conCur: null
            };
            this.calculateInvoiceTotal();
          }

        });

      }

    }
}
openModal(unit: string) {
  this.listService.triggerModal(unit);

  localStorage.setItem('isOpen', 'true');
  this.listService.changeButton(false);
}
refreshVendorData() {
  this.listService.fetchVendors();
}
refreshAccount() {
  this.listService.fetchChartAccounts();
}
delInvoice(index: any) {
      this.paymentData.invoices.splice(index, 1);
      this.calculateInvoiceTotal();
}
calculateInvoiceTotal() {
  this.paymentData.paymentTotal = 0;
  for (const inv of this.paymentData.invoices) {
      this.paymentData.paymentTotal += inv.conAmt;
  }
}
  changePaymentMode(type) {
    let label = '';
    if (type === 'cash') {
      label = 'Cash';
      this.paymentData.payModeNo = '';
    } else if (type === 'cheque') {
      label = 'Cheque';
      this.paymentData.payModeNo = Date.now().toString();
    } else if (type === 'eft') {
      label = 'EFT';
      this.paymentData.payModeNo = '';
    } else if (type === 'credit_card') {
      label = 'Credit Card';
      this.paymentData.payModeNo = '';
    } else if (type === 'debit_card') {
      label = 'Debit Card';
      this.paymentData.payModeNo = '';
    } else if (type === 'demand_draft') {
      label = 'Demand Draft';
      this.paymentData.payModeNo = '';
    }
    this.payModeLabel = label;
    this.paymentData.payModeDate = null;

  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
   /*
    * Selecting files before uploading
    */
   selectDocuments(event) {
    let files = [...event.target.files];

    for (let i = 0; i < files.length; i++) {
      this.uploadedDocs.push(files[i]);
    }
  }
  OnAddPayment() {
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    if (this.paymentData.paymentTotal <= 0) {
        this.toaster.error('Please add invoice.');
        return false;
    }
    this.submitDisabled = true;
     // create form data instance
    const formData = new FormData();

     // append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
       formData.append('uploadedDocs', this.uploadedDocs[i]);
     }

     // append other fields
    formData.append('data', JSON.stringify(this.paymentData));
    this.accountService.postData('vendor-payments', formData, true).subscribe({
        complete: () => { },
        error: (err: any) => {
            from(err.error)
                .pipe(
                    map((val: any) => {
                        val.message = val.message.replace(/".*"/, 'This Field');
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
                    next: () => {
                    },
                });
        },
        next: (res) => {
            this.submitDisabled = false;
            this.response = res;
            this.toaster.success('Vendor payment added successfully.');
            this.cancel();
        },
    });
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.paymentTotal,
      type: 'vendor',
      chequeNo: this.paymentData.payModeNo,
      currency: 'CAD',
      formType: (this.paymentID) ? 'edit' : 'add',
      showModal: this.showModal,
      vacPayPer: 0,
      vacPayAmount: 0,
      finalAmount: this.paymentData.paymentTotal,
      txnDate: this.paymentData.txnDate,
      page: 'addForm',
      invoices: this.paymentData.invoices
    };
    this.listService.openPaymentChequeModal(obj);
  }
}

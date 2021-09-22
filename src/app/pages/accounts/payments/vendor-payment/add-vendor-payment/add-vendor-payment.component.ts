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
    paymentNo: '',
    accountID: null,
    paymentMode: null,
    paymentModeNo: '',
    paymentModeDate: null,
    paymentTotal: 0,
    attachments: [],
    transactionLog: [],
    invoices: [],
    remarks: null
  };
  documentSlides = [];
  uploadedDocs = [];
  paymentModeLabel = '';
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
    currency: 'CAD'
};
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
  addInvoice() {
    if (this.invoiceData.invoiceNo != null && this.invoiceData.amount !== 0 && this.invoiceData.currency !== null) {
        this.paymentData.invoices.push(this.invoiceData);
        this.invoiceData = {
            invoiceNo: null,
            desc: '',
            amount: 0,
            currency: 'CAD'
        };
        this.calculateInvoiceTotal();
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
      this.paymentData.paymentTotal += inv.amount;
  }
}
  changePaymentMode(type) {
    let label = '';
    if (type === 'cash') {
      label = 'Cash';
      this.paymentData.paymentModeNo = '';
    } else if (type === 'cheque') {
      label = 'Cheque';
      this.paymentData.paymentModeNo = Date.now().toString();
    } else if (type === 'eft') {
      label = 'EFT';
      this.paymentData.paymentModeNo = '';
    } else if (type === 'credit_card') {
      label = 'Credit Card';
      this.paymentData.paymentModeNo = '';
    } else if (type === 'debit_card') {
      label = 'Debit Card';
      this.paymentData.paymentModeNo = '';
    } else if (type === 'demand_draft') {
      label = 'Demand Draft';
      this.paymentData.paymentModeNo = '';
    }
    this.paymentModeLabel = label;
    this.paymentData.paymentModeDate = null;

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
    console.log('data', this.paymentData);
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
}

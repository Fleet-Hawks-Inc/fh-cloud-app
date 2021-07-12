import { AccountService, ApiService } from './../../../../services';
import { ListService } from './../../../../services/list.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.css']
})
export class AddReceiptComponent implements OnInit {
  pageTitle = 'Add Receipt';
  public recID: string;
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  customers: any = [];
  customersObjects = {};
  invoices = [];
  accounts: any = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  receiptData = {
    customerID: null,
    txnDate: null,
    recNo: null,
    recAmount: 0,
    recAmountCur: null,
    accountID: null,
    advAmt: 0,
    advAmtCur: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    paidInvoices: [],
    transactionLog: []
  };
  paymentMode = [
    {
      name: 'Cash',
      value: 'cash'
    },
    {
      name: 'Cheque',
      value: 'cheque'
    },
    {
      name: 'EFT',
      value: 'eft'
    },
    {
      name: 'Credit Card',
      value: 'creditCard'
    },
    {
      name: 'Debit Card',
      value: 'debitCard'
    },
    {
      name: 'Demand Draft',
      value: 'demandDraft'
    },
  ];
  paymentLabel = '';
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = false;
  constructor(
    private listService: ListService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.listService.fetchCustomers();
    this.customers = this.listService.customersList;
    this.fetchCustomersByIDs();
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.recID = this.route.snapshot.params[`recID`];
    if (this.recID) {
      this.pageTitle = 'Edit Receipt';
      this.fetchReceipt();
    } else {
      this.pageTitle = 'Add Receipt';
    }
  }
 async getInvoices() {
    this.accountService.getData(`invoices/Customer/${this.receiptData.customerID}`).subscribe((res) => {
      this.invoices = res;
    });
  }
  /*
  * Get all customers's IDs of names from api
  */
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }
  showPaymentFields(type) {
    if (type === 'creditCard') {
      this.paymentLabel = 'Credit Card';
    } else if (type === 'debitCard') {
      this.paymentLabel = 'Debit Card';
    } else if (type === 'demandDraft') {
      this.paymentLabel = 'Demand Card';
    } else if (type === 'eft') {
      this.paymentLabel = 'EFT';
    } else if (type === 'cash') {
      this.paymentLabel = 'Cash';
    } else if (type === 'cheque') {
      this.paymentLabel = 'Cheque';
    }
  }
  getAmount(j: any) {

    for (let i = 0; i < this.invoices.length; i++) {
        if (i === j) {
          if (this.invoices[i].fullPayment === true) {
            this.invoices[i].amountReceived = this.invoices[i].totalAmount;
          }
          //  else if (this.invoices[i].fullPayment === true && this.invoices[i].invStatus === 'partially_paid') {
          //   this.invoices[i].amountReceived = this.invoices[i].balance;
          // }
            else {
            this.invoices[i].amountReceived = 0;
          }
        }
          }
  }
 async getPaidInvoices() {
    const paidInvoices = [];
    for(const element of this.invoices) {
      if (element.amountReceived !== 0 && element.amountReceived !== undefined) {
        const obj = {
          invID: element.invID,
          invNo: element.invNo,
          amountReceived: element.amountReceived,
          fullPayment: element.fullPayment
        };
        paidInvoices.push(obj);
      }
    }
    this.receiptData[`paidInvoices`] = paidInvoices;
  }
 async addReceipt() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    await this.getPaidInvoices();
    this.accountService.postData('receipts', this.receiptData).subscribe({
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
        this.toastr.success('Receipt added successfully.');
        this.router.navigateByUrl('/accounts/receipts/list');
      },
    });
  }
 async fetchReceipt() {
    this.accountService.getData(`receipts/detail/${this.recID}`).subscribe((res: any) => {
      this.receiptData = res[0];
      this.receiptData.transactionLog = res[0].transactionLog;
      this.invoices = this.receiptData[`fetchedInvoices`];
    });
  }

  async updateReceipt() {
    this.submitDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    await this.getPaidInvoices();
    this.accountService.putData(`receipts/update/${this.recID}`, this.receiptData).subscribe({
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
        this.toastr.success('Receipt updated successfully.');
        this.router.navigateByUrl('/accounts/receipts/list');
      },
    });
  }
}

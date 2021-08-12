import { AccountService, ApiService } from './../../../../services';
import { ListService } from './../../../../services/list.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
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
  dataMessageAdv: string = Constants.NO_RECORDS_FOUND;
  customers: any = [];
  customersObjects = {};
  invoices = [];
  accounts: any = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  receiptData = {
    customerID: null,
    txnDate: moment().format('YYYY-MM-DD'),
    recNo: null,
    recAmount: 0,
    totalAmount: 0,
    recAmountCur: null,
    accountID: null,
    advAmt: 0,
    advAmtCur: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    paidInvoices: [],
    transactionLog: [],
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
  advancePayments = [];
  paymentLabel = '';
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = false;
  orderInvoices = [];
  totalReceivedAmt = 0;
  accList = [];
  advErr = '';
  newTotal = 0;
  totalErr = false;
  paidAmtErr = false;
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
    // this.listService.fetchChartAccounts();
    // this.accounts = this.listService.accountsList;
    this.recID = this.route.snapshot.params[`recID`];
    if (this.recID) {
      this.pageTitle = 'Edit Receipt';
    } else {
      this.pageTitle = 'Add Receipt';
    }
    this.fetchAccounts();
  }
  fetchAccounts() {
    this.accountService.getData(`chartAc/fetch/list`).subscribe((res: any) => {
      this.accounts = res;
    });
  }

  async getInvoices() {
    this.newTotal = 0;
    this.advancePayments = [];
    this.accountService.getData(`order-invoice/customer/${this.receiptData.customerID}`).subscribe((res: any) => {
     if (res !== undefined) {
      this.orderInvoices = res;
      this.orderInvoices.map((v: any) => {
        v.invStatus = v.invStatus.replace('_', ' ');
      });
      if(this.orderInvoices.length > 0) {
this.receiptData.recAmountCur = this.orderInvoices[0].charges.freightFee.currency;
      }
      for (const op of this.orderInvoices) {
        this.newTotal += op.balance;
        this.receiptData.totalAmount = this.newTotal;
      }
     }
    });
    this.accountService.getData(`invoices/customer/${this.receiptData.customerID}`).subscribe((result) => {
      if (result !== undefined) {
        this.invoices = result;
        this.invoices.map((v: any) => {
          v.invStatus = v.invStatus.replace('_', ' ');
        });
        if (this.invoices.length > 0) {
            this.receiptData.recAmountCur = this.invoices[0].invCur;
            this.receiptData.advAmtCur = this.invoices[0].invCur;
        }
        for (const op of this.invoices) {
          this.newTotal += op.balance;
          this.receiptData.totalAmount = this.newTotal;
        }
      }
    });

    this.fetchAdvancePayments();
  }
  fetchAdvancePayments() {
    this.dataMessageAdv = Constants.FETCHING_DATA;
    const fromDate = null;
    const toDate = null;
    this.accountService.getData(`advance/entity/${this.receiptData.customerID}?from=${fromDate}
          &to=${toDate}`).subscribe((result: any) => {
      if (result.length === 0) {
        this.dataMessageAdv = Constants.NO_RECORDS_FOUND;
      }
      this.advancePayments = result;
      this.advancePayments.map((v) => {
        v.selected = false;
        if(v.payMode) {
          v.payMode = v.payMode.replace('_', ' ');
        }
        v.fullPayment = false;
        v.paidAmount = 0;
        v.paidStatus = false;
        v.status = v.status.replace('_', ' ');
        v.errText = '';
        v.prevPaidAmount = Number(v.amount) - Number(v.pendingPayment);
        v.prevPaidAmount = v.prevPaidAmount.toFixed(2);
      })
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
  getAmount(j: any, type: string) {
    if (type === 'orderInvoice') {
      for (let i = 0; i < this.orderInvoices.length; i++) {
        if (i === j) {
          if (this.orderInvoices[i].fullPayment === true) {
            this.orderInvoices[i].amountPaid = this.orderInvoices[i].balance;
          } else if (this.orderInvoices[i].fullPayment === true && this.orderInvoices[i].invStatus === 'partially_paid') {
            this.orderInvoices[i].amountPaid = this.orderInvoices[i].balance;
          } else {
            this.orderInvoices[i].amountPaid = 0;
          }
        }
      }
    } else {
      for (let i = 0; i < this.invoices.length; i++) {
        if (i === j) {
          if (this.invoices[i].fullPayment === true) {
            this.invoices[i].amountPaid = this.invoices[i].balance;
          } else if (this.invoices[i].fullPayment === true && this.invoices[i].invStatus === 'partially_paid') {
            this.invoices[i].amountPaid = this.invoices[i].balance;
          } else {
            this.invoices[i].amountPaid = 0;
          }
        }
      }
    }
    this.findReceivedAmtFn();
  }
  async getPaidInvoices() {
    const paidInvoices = [];
    for (const element of this.orderInvoices) {
      if (element.amountPaid !== 0 && element.amountPaid !== undefined) {
        const obj = {
          invID: element.invID,
          invNo: element.invNo,
          amountReceived: element.amountReceived,
          fullPayment: element.fullPayment,
          invType: 'orderInvoice',
          amountPaid: element.amountPaid,
          balance: element.balance,
          invCur: element.charges.freightFee.currency,
        };
        paidInvoices.push(obj);
      }
    }
    for (const element of this.invoices) {
      if (element.amountPaid !== 0 && element.amountPaid !== undefined) {
        const obj = {
          invID: element.invID,
          invNo: element.invNo,
          amountReceived: element.amountReceived,
          fullPayment: element.fullPayment,
          invType: 'manual',
          amountPaid: element.amountPaid,
          balance: element.balance,
          invCur: element.invCur,
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
// selectedAdvancepayments() {
//   this.receiptData.advancePayIds = [];
//   this.receiptData.advData = [];
//   for (const element of this.advancePayments) {
//     if(element.selected) {
//       if(!this.receiptData.advancePayIds.includes(element.paymentID)) {
//         let obj = {
//           paymentID: element.paymentID,
//           status: element.status,
//           paidAmount: (element.status === 'not_deducted') ? element.paidAmount : Number(element.amount) - Number(element.pendingPayment),
//           totalAmount: (element.status === 'not_deducted') ? element.amount : element.pendingPayment,
//           pendingAmount: element.pendingPayment
//         }
//         this.receiptData.advancePayIds.push(element.paymentID);
//         this.receiptData.advData.push(obj);
//       }
//     }
//   }
//   this.advancePaymentCalculation();
// }
// advancePaymentCalculation() {
//   this.receiptData.advAmt = 0;
//   for (const element of this.advancePayments) {
//     if(element.selected) {
//       this.receiptData.advAmt += Number(element.paidAmount);
//       this.receiptData.advData.map((v) => {
//         if(element.paymentID === v.paymentID) {
//           v.paidAmount = Number(element.paidAmount);
//           v.pendingAmount = Number(element.pendingPayment) - Number(element.paidAmount);

//           if(Number(element.paidAmount) === Number(element.pendingPayment)) {
//             v.status = 'deducted';
//           } else if (Number(element.paidAmount) < Number(element.pendingPayment)) {
//             v.status = 'partially_deducted';
//           } else {
//             v.status = 'not_deducted';
//           }

//           v.paidAmount = v.paidAmount.toFixed(2);
//         }
//       })
//     }
//   }
//   this.receiptData.advAmt = (this.receiptData.advAmt) ? Number(this.receiptData.advAmt) : 0;
//   this.receiptData.totalAmount = (this.receiptData.totalAmount) ? Number(this.receiptData.totalAmount) : 0;
// }


  // assignFullPayment(type, index, data) {
  //     if(data.fullPayment) {
  //       this.advancePayments[index].paidAmount = data.pendingPayment;
  //       this.advancePayments[index].paidStatus = true;
  //     } else {
  //       this.advancePayments[index].paidAmount = 0;
  //       this.advancePayments[index].paidStatus = false;
  //     }
  //     this.selectedAdvancepayments();
  //     this.advancePaymentCalculation();
  // }

}

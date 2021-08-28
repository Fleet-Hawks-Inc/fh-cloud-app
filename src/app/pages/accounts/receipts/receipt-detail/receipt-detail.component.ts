import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from './../../../../services';
@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html',
  styleUrls: ['./receipt-detail.component.css']
})
export class ReceiptDetailComponent implements OnInit {
  public recID: string;
  customersObject: any = {};
  accountsObjects = {};
  accountsIntObjects = {};
  receiptData = {
    customerID: null,
    txnDate: null,
    recNo: null,
    recAmount: 0,
    recAmountCur: null,
    accountID: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    paidInvoices: [],
    fetchedInvoices: [],
    transactionLog: []
  };
  constructor(private accountService: AccountService, private apiService: ApiService, private route: ActivatedRoute ) {}

  ngOnInit() {
    this.recID = this.route.snapshot.params[`recID`];
    if (this.recID) {
      this.fetchReceipt();
    }
    this.fetchCustomersByIDs();
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
  } /*
  * Get all customers's IDs of names from api
  */
   fetchCustomersByIDs() {
     this.apiService.getData('contacts/get/list').subscribe((result: any) => {
       this.customersObject = result;
     });
   }
   fetchAccountsByIDs() {
    this.accountService.getData('chartAc/get/list/all').subscribe((result: any) => {
      this.accountsObjects = result;
    });
  }
  fetchAccountsByInternalIDs() {
    this.accountService.getData('chartAc/get/internalID/list/all').subscribe((result: any) => {
      this.accountsIntObjects = result;
    });
  }
   async fetchReceipt() {
    this.accountService.getData(`receipts/detail/${this.recID}`).subscribe((res: any) => {
      this.receiptData = res[0];
      this.receiptData.transactionLog.map((v: any) => {
        v.type = v.type.replace('_', ' ');
      });
    });
  }
}

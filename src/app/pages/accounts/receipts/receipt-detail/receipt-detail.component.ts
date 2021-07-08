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
  accountsObject: any = {};
  receiptData = {
    customerID: null,
    recDate: null,
    recNo: null,
    recAmount: 0,
    recAmountCur: null,
    accountID: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    paidInvoices: [],
    fetchedInvoices: []
  };
  constructor(private accountService: AccountService, private apiService: ApiService, private route: ActivatedRoute ) {}

  ngOnInit() {
    this.recID = this.route.snapshot.params[`recID`];
    if(this.recID){
      this.fetchReceipt();
    }
    this.fetchCustomersByIDs();
    this.fetchAccounts();
  } /*
  * Get all customers's IDs of names from api
  */
   fetchCustomersByIDs() {
     this.apiService.getData('contacts/get/list').subscribe((result: any) => {
       this.customersObject = result;
     });
   }
   fetchAccounts() {
     this.accountService.getData(`chartAc/get/list/all`)
       .subscribe((result: any) => {
         this.accountsObject = result;
       });
   }
   async fetchReceipt() {
    this.accountService.getData(`receipts/detail/${this.recID}`).subscribe((res: any) => {
      this.receiptData = res[0];
      console.log(' this.receiptData',  this.receiptData);
    });
  }
}

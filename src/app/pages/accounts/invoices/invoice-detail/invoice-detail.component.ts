import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from '../../../../services';
@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  invID = '';
  invoice = {
    invNo: '',
    invDate: null,
    invRef: '',
    invDueDate: null,
    invPayTerms: '',
    invCustomerID: null,
    invSalesman: null,
    invSubject: '',
    details: [{
      commodityService: '',
      qtyHours: '',
      priceRate: '',
      amount: 0,
      amtCur: null,
      accountID: null,
    }],
    remarks: '',
    discount: 0,
    discountUnit: '%',
    invStateProvince: null,
    invStatus: 'OPEN',
    invType: 'manual',
    subTotal: 0,
    taxesInfo: [],
    totalAmount: 0,
    discountAmount: 0,
    taxAmount: 0,
  };
  customersObjects = {};
  accountsObjects = {};
  constructor(private accountService: AccountService, private route: ActivatedRoute, private apiService: ApiService,) { }

  ngOnInit() {
    this.invID = this.route.snapshot.params[`invID`];
    console.log('this.invID', this.invID);
    if (this.invID) {
      this.fetchInvoice();
    }
    this.fetchCustomersByIDs();
    this.fetchAccountsByIDs();
  }
  fetchInvoice() {
    this.accountService.getData(`invoices/detail/${this.invID}`).subscribe((res) => {
      console.log('res', res);
      this.invoice = res[0];
      console.log('this.invoice', this.invoice);
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

    fetchAccountsByIDs() {
      this.accountService.getData('chartAc/get/list/all').subscribe((result: any) => {
        this.accountsObjects = result;
      });
    }
}

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
    txnDate: null,
    invRef: '',
    invCur: '',
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
    invStatus: 'open',
    invType: 'manual',
    subTotal: 0,
    taxesInfo: [],
    transactionLog: [],
    totalAmount: 0,
    discountAmount: 0,
    taxAmount: 0,
    amountReceived: 0,
    fullPayment: false,
    balance: 0,
  };
  customerName = '';
  customerAddress = '';
  customerCityName = '';
  customerStateName = '';
  customerCountryName = '';
  customerPhone = '';
  customerEmail = '';
  customerfax = '';
  total = 0;
  customersObjects = {};
  accountsObjects = {};
  accountsIntObjects = {};
  constructor(private accountService: AccountService, private route: ActivatedRoute, private apiService: ApiService,) { }

  ngOnInit() {
    this.invID = this.route.snapshot.params[`invID`];
    if (this.invID) {
      this.fetchInvoice();
    }
    this.fetchCustomersByIDs();
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
  }
  fetchInvoice() {
    this.accountService.getData(`invoices/detail/${this.invID}`).subscribe((res) => {
      this.invoice = res[0];
      this.invoice.invStatus = this.invoice.invStatus.replace('_', ' ');
      console.log('this.invoice', this.invoice);
      this.fetchCustomersDetail();
      this.calculateTotal();
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
  fetchAccountsByInternalIDs() {
    this.accountService.getData('chartAc/get/internalID/list/all').subscribe((result: any) => {
      this.accountsIntObjects = result;
    });
  }
  calculateTotal() {
    let midTotal = 0;
    for (const element of this.invoice.details) {
      midTotal += Number(element.amount);
    }
    this.total = Number(midTotal) + Number(this.invoice.taxAmount);
  }
  fetchCustomersDetail() {
    this.apiService.getData(`contacts/detail/${this.invoice.invCustomerID}`).subscribe((result: any) => {
      result = result.Items[0];
      this.customerName = `${result.companyName}`;
      if (result.address.length > 0) {
        for (const element of result.address) {
          if (element.addressType === 'Office') {
            if (element.manual) {
              this.customerAddress = element.address1;
            } else {
              this.customerAddress = element.userLocation;
            }
            this.customerCityName = element.cityName;
            this.customerStateName = element.stateName;
            this.customerCountryName = element.countryName;
            this.customerPhone = result.workPhone;
            this.customerEmail = result.workEmail;
          }
        }
      }
    });
  }
}

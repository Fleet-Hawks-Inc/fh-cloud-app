import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from 'src/app/services';

@Component({
  selector: 'app-sales-invoice-detail',
  templateUrl: './sales-invoice-detail.component.html',
  styleUrls: ['./sales-invoice-detail.component.css']
})
export class SalesInvoiceDetailComponent implements OnInit {
  saleID: any;

  txnDate: string;
  customerID: string;
  finalTotal: string;
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

  customersObjects: any;

  constructor(public accountService: AccountService, public apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.fetchCustomersByIDs();
      this.fetchSaleOrder();
    }
  }


  /*
* Get all customers's IDs of names from api
*/
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }


  fetchSaleOrder() {
    this.accountService.getData(`sales-invoice/detail/${this.saleID}`).subscribe(res => {
      let result = res[0];

      this.txnDate = result.txnDate;
      this.customerID = result.customerID;
      this.finalTotal = result.total.finalTotal;
      this.currency = result.currency;
      this.shipDate = result.shipDate;
      this.sRef = result.sRef;
      this.salePerson = result.salePerson;
      this.remarks = result.remarks;
      this.sOrderDetails = result.sOrderDetails;
      this.status = result.status;
      this.sOrNo = result.sOrNo;
      this.taxes = result.charges.taxes;
      this.accFees = result.charges.accFee;
      this.accDed = result.charges.accDed;
    });
  }

}

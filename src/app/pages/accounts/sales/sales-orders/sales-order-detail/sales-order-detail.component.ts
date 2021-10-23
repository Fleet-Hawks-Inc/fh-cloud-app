import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from 'src/app/services';

@Component({
  selector: 'app-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.css']
})
export class SalesOrderDetailComponent implements OnInit {
  saleID: any;

  txnDate: string;
  customerID: string;
  finalTotal: any;
  currency: string;
  shipDate: string;
  sRef: string;
  salePerson: string;
  status: string;
  remarks: string;
  sOrderDetails: any;
  sOrNo: string;
  taxes: any;
  accFees: any;
  accDed: any;

  customersObjects: any = {};

  constructor(public accountService: AccountService, public apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.fetchCustomersByIDs()
      this.fetchSaleOrder();
    }
  }


  fetchSaleOrder() {
    this.accountService.getData(`sales-orders/detail/${this.saleID}`).subscribe(res => {
      let result = res[0];

      this.txnDate = result.txnDate;
      this.customerID = result.cusInfo.customerID;
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

  /*
* Get all customers's IDs of names from api
*/
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

}

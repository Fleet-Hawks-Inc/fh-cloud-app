import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from '../../../../services';
@Component({
  selector: 'app-load-invoice-detail',
  templateUrl: './load-invoice-detail.component.html',
  styleUrls: ['./load-invoice-detail.component.css']
})
export class LoadInvoiceDetailComponent implements OnInit {
  invID = '';
  showDetails = false;
  invoiceData: any = {};
  customersObjects = {};
  accountsObjects = {};
  accountsIntObjects = {};
  constructor(private route: ActivatedRoute, private accountService: AccountService, private apiService: ApiService) { }

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
    this.accountService.getData(`order-invoice/detail/${this.invID}`).subscribe((res) => {
      if (res) {
        this.showDetails = true;
      }
      this.invoiceData = res[0];
      this.invoiceData.transactionLog.map((v: any) => {
        v.type = v.type.replace('_', ' ');
      });
    });
  }
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
}

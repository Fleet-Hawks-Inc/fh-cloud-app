
import { Component, OnInit } from '@angular/core';

import { AccountService, ApiService } from './../../../../services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css']
})
export class ReceiptsListComponent implements OnInit {
  noReceiptsMsg = 'No Data Found';
  dataMessage: string;
  receipts = [];
  customersObjects: any = {};
  accountsObject: any = {};
  constructor(private accountService: AccountService, private toastr: ToastrService, private apiService: ApiService, ) {}

  ngOnInit() {
    this.fetchReceipts();
    this.fetchCustomersByIDs();
    this.fetchAccounts();
  }

  fetchReceipts() {
    this.accountService.getData('receipts').subscribe((res) => {
    this.receipts = res;
    });
  }

  deleteReceipt(recID: string) {
    this.accountService.deleteData(`receipts/delete/${recID}`).subscribe(() => {
      this.toastr.success('Receipt Deleted Successfully.');
      this.fetchReceipts();
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
    fetchAccounts() {
      this.accountService.getData(`chartAc/get/list/all`)
        .subscribe((result: any) => {
          this.accountsObject = result;
        });
    }
}

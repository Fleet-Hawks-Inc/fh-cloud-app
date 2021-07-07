
import { Component, OnInit } from '@angular/core';

import { AccountService } from './../../../../services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css']
})
export class ReceiptsListComponent implements OnInit {
  dataMessage: string;
  receipts = [];
  constructor(private accountService: AccountService, private toastr: ToastrService, ) {}

  ngOnInit() {
    this.fetchReceipts();
    this.fetchCustomersByIDs();
  }

  fetchReceipts() {
    this.accountService.getData('receipts').subscribe((res) => {
    this.receipts = res;
    console.log('this.receipts', this.receipts);
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
      // this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      //   this.customersObjects = result;
      // });
    }
}

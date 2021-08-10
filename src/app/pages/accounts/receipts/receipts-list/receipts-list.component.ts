
import { Component, OnInit } from '@angular/core';

import { AccountService, ApiService } from './../../../../services';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../../fleet/constants';
@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css']
})
export class ReceiptsListComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  receipts = [];
  customersObjects: any = {};
  accountsObject: any = {};
  lastItemSK = '';
  filter = {
    startDate: null,
    endDate: null,
    recNo: null
  };
  constructor(private accountService: AccountService, private toastr: ToastrService, private apiService: ApiService, ) {}

  ngOnInit() {
    this.receipts = [];
    this.fetchReceipts();
    this.fetchCustomersByIDs();
    this.fetchAccounts();
  }

  fetchReceipts(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.receipts = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`receipts?lastKey=${this.lastItemSK}`)
      .subscribe(async (result: any) => {
        console.log('main result', result);
        if (result.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if (result.length > 0) {
          for (const element of result) {
            this.receipts.push(element);
          }
          if (this.receipts[this.receipts.length - 1].sk !== undefined) {
            this.lastItemSK = encodeURIComponent(this.receipts[this.receipts.length - 1].sk);
          } else {
            this.lastItemSK = 'end';
          }
        }
      });
    }
  }
  onScroll() {
    this.fetchReceipts();
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
    searchFilter() {
      if ( this.filter.endDate !== null || this.filter.startDate !== null || this.filter.recNo !== null) {
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchDetails();
      }
    }

    fetchDetails() {
      this.accountService.getData(`receipts/paging?recNo=${this.filter.recNo}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`)
        .subscribe((result: any) => {
          this.receipts = result;
        });
    }
    resetFilter() {
      this.dataMessage = Constants.FETCHING_DATA;
      this.filter = {
        startDate: null,
        endDate: null,
        recNo: null
      };
      this.receipts = [];
      this.lastItemSK = '';
      this.fetchReceipts();
    }
}

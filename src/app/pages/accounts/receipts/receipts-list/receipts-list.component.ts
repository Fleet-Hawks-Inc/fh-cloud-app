
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
  constructor(private accountService: AccountService, private toaster: ToastrService, private toastr: ToastrService, private apiService: ApiService,) { }

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
      this.accountService.getData(`receipts/paging?recNo=${this.filter.recNo}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            if (result[result.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            result.map((v) => {
              this.receipts.push(v);
            });
          }
        });
    }
  }
  onScroll() {
    this.fetchReceipts();
  }
  deleteReceipt(recID: string) {
    this.accountService.deleteData(`receipts/delete/${recID}`).subscribe((res) => {
      if (res !== undefined) {
        this.dataMessage = Constants.FETCHING_DATA;
        this.receipts = [];
        this.lastItemSK = '';
        this.fetchReceipts();
        this.toastr.success('Receipt Deleted Successfully.');
      }
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
    this.lastItemSK = '';
    if (this.filter.endDate !== null || this.filter.startDate !== null || this.filter.recNo !== null) {
      this.dataMessage = Constants.FETCHING_DATA;

      if (
        this.filter.startDate !== '' &&
        this.filter.endDate === ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (
        this.filter.startDate === '' &&
        this.filter.endDate !== ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error('Start date should be less than end date');
        return false;
      } else {
        this.receipts = [];
        this.lastItemSK = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchReceipts();
      }
    }
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

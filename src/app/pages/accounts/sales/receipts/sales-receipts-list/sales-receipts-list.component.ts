import { Component, Input, OnInit } from '@angular/core';
import * as _ from "lodash";
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';
@Component({
  selector: 'app-sales-receipts-list',
  templateUrl: './sales-receipts-list.component.html',
  styleUrls: ['./sales-receipts-list.component.css']
})
export class SalesReceiptsListComponent implements OnInit {

  isSearch: boolean = false;
  dataMessage = Constants.FETCHING_DATA;

  allReceipts = [];

  filterData = {
    customerID: null,
    startDate: '',
    endDate: '',
    lastItemSK: ''
  }
  lastItemSK = '';

  customersObjects: any = {};
  invoicesList = []
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  loaded = false;
  constructor(public accountService: AccountService, private toaster: ToastrService, public apiService: ApiService) { }

  ngOnInit() {
    this.fetchReceipts();
    this.fetchCustomersByIDs();
    this.fetchInvoicesByID();
    this.dataColumns = [
      { width: '256px', field: 'txnDate', header: 'Date', type: "text" },
      { width: '256px', field: 'sRPTNo', header: 'Payment#', type: "text" },
      { width: '256px', field: 'customerID', header: 'Customer', type: "text" },
      { width: '256px', field: 'payRef', header: 'Reference#', type: "text" },
      { width: '256px', field: 'invoiceIds', header: 'Invoice#', type: "text" },
      { width: '256px', field: 'payMode', header: 'Payment Mode', type: "text" },
      { width: '256px', field: 'totalAmt', header: 'Amount', type: "text" },
    ];


    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }
  /*
* Get all customers's IDs of names from api
*/
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  fetchInvoicesByID() {
    this.accountService.getData('sales-invoice/get/list').subscribe((result: any) => {
      this.invoicesList = result;
    });
  }

  async fetchReceipts(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.allReceipts = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`sales-receipts/paging?customer=${this.filterData.customerID}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.isSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }

          if (result.length > 0) {
            this.isSearch = false;
            result.map((v) => {
              this.allReceipts.push(v);
            });

            if (this.allReceipts[this.allReceipts.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(this.allReceipts[this.allReceipts.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            this.loaded = true;

          }
        });
    }

  }

  searchSale() {
    if (this.filterData.customerID !== '' || this.filterData.startDate !== '' || this.filterData.endDate !== '' || this.filterData.lastItemSK !== '') {
      if (
        this.filterData.startDate !== '' &&
        this.filterData.endDate === ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (
        this.filterData.startDate === '' &&
        this.filterData.endDate !== ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (this.filterData.startDate > this.filterData.endDate) {
        this.toaster.error('Start date should be less then end date');
        return false;
      } else {
        this.isSearch = true;
        this.allReceipts = [];
        this.lastItemSK = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchReceipts();
      }

    }
  }

  resetFilter() {
    this.isSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filterData = {
      customerID: null,
      startDate: '',
      endDate: '',
      lastItemSK: ''
    };
    this.lastItemSK = '';
    this.allReceipts = [];
    this.fetchReceipts();
  }
  onScroll() {
    if (this.loaded) {
      this.fetchReceipts();
    }
    this.loaded = false;
  }
  clear(table: Table) {
    table.clear();
  }

}

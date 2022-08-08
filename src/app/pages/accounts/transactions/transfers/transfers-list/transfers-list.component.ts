import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import { ListService } from 'src/app/services/list.service';
import * as _ from "lodash";
import { Table } from 'primeng/table';
@Component({
  selector: 'app-transfers-list',
  templateUrl: './transfers-list.component.html',
  styleUrls: ['./transfers-list.component.css']
})
export class TransfersListComponent implements OnInit {

  transactions = [];
  accounts: any = [];
  dataMessage: string = Constants.FETCHING_DATA;
  filter = {
    fromAcc: null,
    toAcc: null,
    fromDate: null,
    toDate: null
  }
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastkey = null;
  lastkeyDate = null;
  loaded = false;
  _selectedColumns: any[];
  get = _.get;
  find = _.find;
  dataColumns = [
    { field: 'trNo', header: 'Transfer#', type: "text" },
    { field: 'txnDate', header: 'Date', type: "text" },
    { field: 'fromAccName', header: 'From Account', type: "text" },
    { field: 'amount', header: 'Transferred Amount', type: "text" },
    { field: 'toAccName', header: 'To Account', type: "text" },
    { field: 'payMode', header: 'Transfer Mode', type: "text" },
    { field: 'payModeNo', header: 'Reference No.', type: "text" },
  ];
  constructor(private listService: ListService, private accountService: AccountService, private toaster: ToastrService) { }

  ngOnInit() {
    this.setToggleOptions()
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchListing();
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
  fetchListing() {
    if (this.lastkey != 'end') {
      this.accountService.getData(`transfer-transactions/paging?fromAcc=${this.filter.fromAcc}&toAcc=${this.filter.toAcc}&fromDate=${this.filter.fromDate}&toDate=${this.filter.toDate}&lastkey=${this.lastkey}&lastkeyDate=${this.lastkeyDate}`).subscribe((result: any) => {
        this.transactions = this.transactions.concat(result);
        if (this.transactions.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
          this.loaded = true
        } else {
          this.loaded = true;
          this.transactions.map((v) => {
            v.url = `/accounts/transactions/transfers/detail/${v.transferID}`;
            v.editUrl = `/accounts/transactions/transfers/edit/${v.transferID}`;
            v.payMode = v.payMode.replace('_', ' ')
          })
          if (this.transactions[this.transactions.length - 1].sk) {
            this.lastkey = encodeURIComponent(this.transactions[this.transactions.length - 1].sk);
            if (this.transactions[this.transactions.length - 1].transDate) {
              this.lastkeyDate = encodeURIComponent(this.transactions[this.transactions.length - 1].transDate);
            }
          } else {
            this.lastkey = 'end';
          }
        }
      })
    }
  }

  searchList() {
    if (this.filter.fromAcc || this.filter.toAcc || this.filter.fromDate || this.filter.toDate) {
      this.transactions = [];
      this.lastkey = null;
      this.lastkeyDate = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchListing()
    }
  }

  resetSearch() {
    if (this.filter.fromAcc || this.filter.toAcc || this.filter.fromDate || this.filter.toDate) {
      this.filter = {
        fromAcc: null,
        toAcc: null,
        fromDate: null,
        toDate: null
      }
      this.transactions = [];
      this.lastkey = null;
      this.lastkeyDate = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchListing()
    }
  }

  refreshData() {
    this.filter = {
      fromAcc: null,
      toAcc: null,
      fromDate: null,
      toDate: null
    }
    this.transactions = [];
    this.lastkey = null;
    this.lastkeyDate = null;
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchListing()
  }


  onScroll() {
    if (this.loaded) {
      this.fetchListing()
    }
    this.loaded = false;
  }

  deleteTransfer(transferID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`transfer-transactions/delete/${transferID}`)
        .subscribe((result: any) => {
          this.lastkey = null;
          this.lastkeyDate = null;
          this.transactions = [];
          this.dataMessage = Constants.FETCHING_DATA;
          this.fetchListing();
          this.toaster.success("Transfer deleted successfully.");
        });
    }
  }
  clear(table: Table) {
    table.clear();
  }
}

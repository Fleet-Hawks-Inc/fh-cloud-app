import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-transfers-list',
  templateUrl: './transfers-list.component.html',
  styleUrls: ['./transfers-list.component.css']
})
export class TransfersListComponent implements OnInit {

  transactions = [];
  accounts:any = [];
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
  
  constructor(private listService: ListService, private accountService: AccountService, private toaster: ToastrService) { }

  ngOnInit() {
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchListing();
  }

  fetchListing() {
    if(this.lastkey != 'end') {
      this.accountService.getData(`transfer-transactions/paging?fromAcc=${this.filter.fromAcc}&toAcc=${this.filter.toAcc}&fromDate=${this.filter.fromDate}&toDate=${this.filter.toDate}&lastkey=${this.lastkey}&lastkeyDate=${this.lastkeyDate}`).subscribe((result: any) => {
        this.transactions = this.transactions.concat(result);
        if(this.transactions.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND
        } else {
          this.loaded = true;
          this.transactions.map((v) => {
            v.url = `/accounts/transactions/transfers/detail/${v.transferID}`;
            v.editUrl = `/accounts/transactions/transfers/edit/${v.transferID}`;
            v.payMode = v.payMode.replace('_',' ')
          })
          if(this.transactions[this.transactions.length-1].sk) {
            this.lastkey = encodeURIComponent(this.transactions[this.transactions.length-1].sk);
            if(this.transactions[this.transactions.length-1].transDate) {
              this.lastkeyDate = encodeURIComponent(this.transactions[this.transactions.length-1].transDate);
            }
          } else {
            this.lastkey = 'end';
          }
        }
      })
    }
  }

  searchList() {
    if(this.filter.fromAcc || this.filter.toAcc || this.filter.fromDate || this.filter.toDate) {
      this.transactions = [];
      this.lastkey = null;
      this.lastkeyDate = null;
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchListing()
    }
  }

  resetSearch() {
    if(this.filter.fromAcc || this.filter.toAcc || this.filter.fromDate || this.filter.toDate) {
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
}

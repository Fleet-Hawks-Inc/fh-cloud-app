import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AccountService } from '../../../../../services';
import Constants from '../../../../fleet/constants';
@Component({
  selector: 'app-general-ledger-list',
  templateUrl: './general-ledger-list.component.html',
  styleUrls: ['./general-ledger-list.component.css']
})
export class GeneralLedgerListComponent implements OnInit {
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = '';
  actName = null;
  actType = null;
  disableSearch = false;
  loaded = false;
  accounts: any = [];
  filter = {
    actType: null,
    actName: null,
  };
  constructor(private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.fetchAccounts();
  }

  searchAccounts() {
    if (this.filter.actType !== '' || this.filter.actType !== null || this.filter.actName !== null || this.filter.actName !== '') {
      this.disableSearch = true;
      this.accounts = [];
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAccounts();
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      actType: null,
      actName: null,
    };
    this.lastItemSK = '';
    this.accounts = [];
    this.fetchAccounts();
  }
  async fetchAccounts(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.accounts = [];
    }
    if (this.lastItemSK !== 'end') {
      let name = null;
      let type = null;
      if (this.filter.actType !== null || this.filter.actName !== null) {
        if (this.filter.actType !== null && this.filter.actType !== '') {
          type = this.filter.actType;
        }
        if (this.filter.actName !== null && this.filter.actName !== '') {
          name = this.filter.actName.toLowerCase();
        }
        this.dataMessage = Constants.FETCHING_DATA;
      }
      this.accountService.getData(`chartAc/ledger/report/paging?actName=${name}&actType=${type}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.disableSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            this.disableSearch = false;
            result.map((v) => {
              v.first = v.actName.substring(0, v.actName.indexOf(' '));
              v.last = v.actName.substring(v.actName.indexOf(' ') + 1, v.actName.length);
              this.accounts.push(v);
            });
            if (this.accounts[this.accounts.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(this.accounts[this.accounts.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            const newArray = _.sortBy(this.accounts, ['actNo']); // sort by account number
            this.accounts = newArray;
            this.loaded = true;
          }
        });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchAccounts();
    }
    this.loaded = false;
  }
}

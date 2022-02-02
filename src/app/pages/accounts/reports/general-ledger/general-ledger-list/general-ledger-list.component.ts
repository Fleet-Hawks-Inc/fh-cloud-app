import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { AccountService } from "../../../../../services";
import Constants from "../../../../fleet/constants";
@Component({
  selector: "app-general-ledger-list",
  templateUrl: "./general-ledger-list.component.html",
  styleUrls: ["./general-ledger-list.component.css"],
})
export class GeneralLedgerListComponent implements OnInit {
  dataMessage = Constants.FETCHING_DATA;
  lastItemSK = "";
  actName = null;
  actType = null;
  disableSearch = false;
  loaded = false;
  accounts: any = [];
  filter = {
    actType: null,
    actName: null,
    startDate: null,
    endDate: null,
  };
  start = null;
  end = null;
  isLoadText = "Load More...";
  isLoad = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.fetchAccounts();
  }

  searchAccounts() {
    if (
      this.filter.actType !== "" ||
      this.filter.actType !== null ||
      this.filter.actName !== null ||
      this.filter.actName !== "" ||
      this.filter.startDate !== null ||
      this.filter.endDate !== null
    ) {
      this.disableSearch = true;
      this.start = this.filter.startDate;
      this.end = this.filter.endDate;
      this.accounts = [];
      this.lastItemSK = "";
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
      startDate: null,
      endDate: null,
    };
    this.start = null;
    this.end = null;
    this.lastItemSK = "";
    this.accounts = [];
    this.fetchAccounts();
  }
  async fetchAccounts(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = "";
      this.accounts = [];
    }
    if (this.lastItemSK !== "end") {
      let name = null;
      let type = null;
      if (this.filter.actType !== null || this.filter.actName !== null) {
        if (this.filter.actType !== null && this.filter.actType !== "") {
          type = this.filter.actType;
        }
        if (this.filter.actName !== null && this.filter.actName !== "") {
          name = this.filter.actName.toLowerCase();
        }
        this.dataMessage = Constants.FETCHING_DATA;
      }
      this.accountService
        .getData(
          `chartAc/ledger/report/paging?actName=${name}&actType=${type}&lastKey=${this.lastItemSK}&start=${this.start}&end=${this.end}`
        )
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.disableSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            this.disableSearch = false;
            result.map((v) => {
              v.first = v.actName.substring(0, v.actName.indexOf(" "));
              v.last = v.actName.substring(
                v.actName.indexOf(" ") + 1,
                v.actName.length
              );
              this.accounts.push(v);
            });
            if (this.accounts[this.accounts.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                this.accounts[this.accounts.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            const newArray = _.sortBy(this.accounts, ["actNo"]); // sort by account number
            this.accounts = newArray;
            this.loaded = true;
          }
        });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.isLoad = true;
      this.isLoadText = "Loading";
      this.fetchAccounts();
    }
    this.loaded = false;
  }
}

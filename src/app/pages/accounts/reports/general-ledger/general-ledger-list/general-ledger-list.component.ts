
import { Component, OnInit, Input } from "@angular/core";
import * as _ from "lodash";
import { AccountService } from "../../../../../services";
import Constants from "../../../../fleet/constants";
import { Table } from "primeng/table";
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
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.fetchAccounts();
    this.dataColumns = [
      { field: 'first', header: 'Account Name', type: "text" },
      { field: 'actNo', header: 'Account Number', type: "text" },
      { field: 'actType', header: 'Account Type', type: "text" },
      { field: 'opnBalCAD', header: 'Opening Balance CAD', type: "text" },
      { field: 'opnBalUSD', header: 'Opening Balance USD', type: "text" },
      { field: 'totalDebitCAD', header: 'Total Debit CAD', type: "text" },
      { field: 'totalCreditCAD', header: 'Total Credit CAD', type: "text" },
      { field: 'totalDebitUSD', header: 'Total Debit USD', type: "text" },
      { field: 'totalCreditUSD', header: 'Total Credit USD', type: "text" },
      { field: 'closingAmtCAD', header: 'Closing Balance CAD', type: "text" },
      { field: 'closingAmtUSD', header: 'Closing Balance USD', type: "text" },

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
            this.loaded = true;
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
  clear(table: Table) {
    table.clear();
  }
}

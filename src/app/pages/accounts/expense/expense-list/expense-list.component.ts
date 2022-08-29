import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Table } from 'primeng/table';
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import Constants from "../../../fleet/constants";
@Component({
  selector: "app-expense-list",
  templateUrl: "./expense-list.component.html",
  styleUrls: ["./expense-list.component.css"],
})
export class ExpenseListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  noRecrdMessage: string = Constants.NO_RECORDS_FOUND;
  expenses = [];
  vendors = [];
  categories = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    category: null,
    unitNumber: null,
    amount: "",
    startDate: null,
    endDate: null,
    typeId: null,
  };
  lastItemSK = "";
  loaded = false;
  disableSearch = false;

  vehicles = [];
  trips = [];
  assets = [];
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  constructor(
    private accountService: AccountService,
    private apiService: ApiService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.fetchExpenses();
    this.dataColumns = [
      { field: 'txnDate', header: 'Date', type: "text" },
      { field: 'categoryName', header: 'Expense Type', type: "text" },
      { field: 'vendorN', header: 'Vendor', type: "text" },
      { field: 'tripN', header: 'Trip & Unit#', type: "text" },
      { field: 'recurring.interval', header: 'Recurring', type: "text" },
      { field: 'finalTotal', header: 'Amount', type: "text" },
      { field: 'newStatus', header: 'Status', type: "text" },
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

  fetchExpenses(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = "";
      this.expenses = [];
    }
    if (this.lastItemSK !== "end") {
      this.accountService
        .getData(
          `expense/paging?filterType=${this.filter.category}&unitNumber=${this.filter.unitNumber}&amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&category=${this.filter.typeId}&lastKey=${this.lastItemSK}`
        )
        .subscribe((result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.disableSearch = false;
            this.loaded = true
          }
          if (result.length > 0) {
            this.disableSearch = false;
            if (result[result.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                result[result.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            result.map((v) => {
              v.disableEdit = false;
              if (v.status) {
                v.newStatus = v.status.replace("_", " ");
                if (
                  v.status === "deducted" ||
                  v.status === "partially_deducted"
                ) {
                  v.disableEdit = true;
                }
              }

              this.expenses.push(v);
            });
            this.loaded = true;
          }
        });
    }
  }

  deleteExpense(expenseID) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`expense/delete/${expenseID}`)
        .subscribe((result: any) => {
          if (result !== undefined) {
            this.dataMessage = Constants.FETCHING_DATA;
            this.expenses = [];
            this.lastItemSK = "";
            this.fetchExpenses();
            this.toaster.success("Expense transaction deleted successfully.");
          }
        });
    }
  }

  searchFilter() {
    if (
      this.filter.category === "vehicle" &&
      (this.filter.unitNumber == null || this.filter.unitNumber == "")
    ) {
      this.toaster.error("Please type vehicle number");
      return false;
    }
    if (
      this.filter.category === "tripNo" &&
      (this.filter.unitNumber == null || this.filter.unitNumber == "")
    ) {
      this.toaster.error("Please type trip number");
      return false;
    }
    if (
      this.filter.category === "asset" &&
      (this.filter.unitNumber == null || this.filter.unitNumber == "")
    ) {
      this.toaster.error("Please type asset name");
      return false;
    }

    if (
      this.filter.category != "" ||
      this.filter.unitNumber != null ||
      this.filter.unitNumber != "" ||
      this.filter.amount !== "" ||
      this.filter.typeId !== null ||
      this.filter.endDate !== null ||
      this.filter.startDate !== null
    ) {
      this.disableSearch = true;
      if (this.filter.startDate !== "" && this.filter.endDate === "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate === "" && this.filter.endDate !== "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less than end date");
        return false;
      } else {
        this.expenses = [];
        this.lastItemSK = "";
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchExpenses();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      category: null,
      unitNumber: null,
      amount: "",
      startDate: null,
      endDate: null,
      typeId: null,
    };
    this.lastItemSK = "";
    this.expenses = [];
    this.fetchExpenses();
  }
  clear(table: Table) {
    table.clear();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchExpenses();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      category: null,
      unitNumber: null,
      amount: "",
      startDate: null,
      endDate: null,
      typeId: null,
    };
    this.lastItemSK = "";
    this.expenses = [];
    this.fetchExpenses();
  }

  changeCategory() {
    this.filter.unitNumber = null;
  }
}
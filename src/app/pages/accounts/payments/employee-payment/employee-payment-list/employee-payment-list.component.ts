import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, ListService } from "src/app/services";
import * as _ from "lodash";
import { Table } from 'primeng/table';

@Component({
  selector: "app-employee-payment-list",
  templateUrl: "./employee-payment-list.component.html",
  styleUrls: ["./employee-payment-list.component.css"],
})
export class EmployeePaymentListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  employees = [];
  payments = [];
  filter = {
    startDate: null,
    endDate: null,
    paymentNo: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastItemSK = "";
  loaded = false;
  disableSearch = false;
  _selectedColumns: any[];
  get = _.get;
  find = _.find;
  dataColumns = [
    { field: 'paymentNo', header: 'Payment#', type: "text" },
    { field: 'txnDate', header: 'Date', type: "text" },
    { field: 'payMode', header: 'Payment Mode', type: "text" },
    { field: 'payModeNo', header: 'Reference No.', type: "text" },
    { field: 'entityId', header: 'Vendor', type: "text" },
    { field: 'finalTotal', header: 'Amount', type: "text" },
  ];
  constructor(
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.setToggleOptions();
    this.fetchEmployees();
    this.fetchPayments();
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


  fetchEmployees() {
    this.apiService
      .getData(`contacts/get/emp/list`)
      .subscribe((result: any) => {
        this.employees = result;
      });
  }

  fetchPayments(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.payments = [];
    }
    if (this.lastItemSK !== "end") {
      if (this.filter.paymentNo !== null && this.filter.paymentNo !== "") {
        searchParam = encodeURIComponent(`"${this.filter.paymentNo}"`);
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `employee-payments/paging?paymentNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe((result: any) => {
          if (result.length === 0) {
            this.disableSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
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
              v.currency = v.currency ? v.currency : "CAD";
              v.url = `/accounts/payments/employee-payments/detail/${v.paymentID}`;
              v.payMode = v.payMode.replace("_", " ");
              this.payments.push(v);
            });
            this.loaded = true;
          }
        });
    }
  }

  searchFilter() {
    if (
      this.filter.paymentNo !== "" ||
      this.filter.endDate !== null ||
      this.filter.startDate !== null
    ) {
      this.disableSearch = true;
      if (this.filter.startDate != "" && this.filter.endDate == "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate == "" && this.filter.endDate != "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.payments = [];
        this.lastItemSK = "";
        this.fetchPayments();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      paymentNo: null,
    };
    this.payments = [];
    this.lastItemSK = "";
    this.fetchPayments();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchPayments();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      paymentNo: null,
    };
    this.payments = [];
    this.lastItemSK = "";
    this.fetchPayments();
  }
  clear(table: Table) {
    table.clear();
  }
}

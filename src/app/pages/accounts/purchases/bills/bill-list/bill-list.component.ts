import { Component, Input, OnInit, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Table } from "primeng/table";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";
import { OverlayPanel } from "primeng/overlaypanel";

@Component({
  selector: "app-bill-list",
  templateUrl: "./bill-list.component.html",
  styleUrls: ["./bill-list.component.css"],
})
export class BillListComponent implements OnInit {
  @ViewChild("op") overlaypanel: OverlayPanel;
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  payOrders = [];
  vendors = {};
  filter = {
    amount: null,
    startDate: null,
    endDate: null,
  };
  disableSearch = true;
  lastItemSK = "";
  loaded = false;
  purchaseOrders = {};
  _selectedColumns: any[];
  get = _.get;
  find = _.find;
  dataColumns = [
    { field: 'txnDate', header: 'Date', type: "text" },
    { field: 'billNo', header: 'Bill#', type: "text" },
    { field: 'refNo', header: 'Reference#', type: "text" },
    { field: 'purchaseID', header: 'Purchase Order#', type: "text" },
    { field: 'vendorID', header: 'Vendor', type: "text" },
    { field: 'dueDate', header: 'Due Date', type: "text" },
    { field: 'total.finalTotal', header: 'Account', type: "text" },
    { field: 'balance', header: 'Balance', type: "text" },
    { field: 'status', header: 'Status', type: "text" },

  ];
  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    this.setToggleOptions();
    await this.fetchVendor();
    this.fetchPurchaseOrders();
    this.fetchBills();
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

  async fetchBills() {
    if (this.lastItemSK !== "end") {
      let filterAmount = null;
      if (this.filter.amount) {
        filterAmount = encodeURIComponent(`"${this.filter.amount}"`);
      }
      let result: any = await this.accountService
        .getData(
          `bills/paging?amount=${filterAmount}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=${this.lastItemSK}`
        )
        .toPromise();
      this.disableSearch = false;
      if (result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.lastItemSK = "end";
      if (result.length > 0 && result[result.length - 1].sk !== undefined) {
        this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
      } else {
        this.lastItemSK = "end";
      }

      result.map((v) => {
        v.url = `/accounts/purchases/bills/details/${v.billID}`;
        v.editUrl = `/accounts/purchases/bills/edit/${v.billID}`;
        v.status = v.status.replace("_", " ");
        this.payOrders.push(v);
      });
      this.loaded = true;
    }
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/get/list/vendor`)
      .toPromise();
    this.vendors = result;
  }

  async fetchPurchaseOrders() {
    const result: any = await this.accountService
      .getData("purchase-orders/get/list")
      .toPromise();
    this.purchaseOrders = result;
  }

  voidBill(data, i) {
    if (confirm("Are you sure you want to void?") === true) {
      this.accountService.deleteData(`bills/void/${data.billID}`).subscribe({
        complete: () => { },
        error: () => { },
        next: () => {
          this.dataMessage = Constants.FETCHING_DATA;
          this.payOrders[i].status = 'voided';
          this.toastr.success("Bill voided successfully");
        },
      });
    }
  }

  searchFilter() {
    if (
      this.filter.amount !== null ||
      this.filter.startDate !== null ||
      this.filter.endDate !== null
    ) {
      this.payOrders = [];
      this.lastItemSK = "";
      this.disableSearch = true;
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchBills();
    }
  }

  resetFilter() {
    this.filter = {
      amount: null,
      startDate: null,
      endDate: null,
    };
    this.payOrders = [];
    this.lastItemSK = "";
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.fetchBills();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchBills();
    }
    this.loaded = false;
  }
  clear(table: Table) {
    table.clear();
  }
}

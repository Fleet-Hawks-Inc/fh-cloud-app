import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { Table } from 'primeng/table';
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";
@Component({
  selector: "app-vendor-credit-notes-list",
  templateUrl: "./vendor-credit-notes-list.component.html",
  styleUrls: ["./vendor-credit-notes-list.component.css"],
})
export class VendorCreditNotesListComponent implements OnInit {
  allCredits = [];
  vendors = [];
  lastItemSK = "";

  isSearch: boolean = false;
  dataMessage = Constants.FETCHING_DATA;

  filterData = {
    vendorID: null,
    startDate: "",
    endDate: "",
    lastItemSK: "",
  };
  purchaseOrders = [];
  loaded = false;
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
    this.fetchVendors();
    this.fetchCredits();
    this.fetchPurchaseOrders();
    this.dataColumns = [
      { field: 'txnDate', header: 'Date', type: "text" },
      { field: 'vCrNo', header: 'Vendor Credit#', type: "text" },
      { field: 'crRef', header: 'Reference#', type: "text" },
      { field: 'purOrder', header: 'Purchase Order#', type: "text" },
      { field: 'vendorID', header: 'Vendor', type: "text" },
      { field: 'totalAmt', header: 'Credit Amount', type: "text" },
      { field: 'balance', header: 'Balance Amount', type: "text" },
      { field: 'status', header: 'Status', type: "text" },
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

  getCredits() {
    this.accountService.getData(`vendor-credits`).subscribe((res) => {
      this.allCredits = res;
    });
  }

  fetchVendors() {
    this.apiService
      .getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      });
  }

  deleteCredit(creditID: string) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`vendor-credits/delete/${creditID}`)
        .subscribe((res) => {
          if (res) {
            this.getCredits();
          }
        });
    }
  }

  async fetchCredits(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = "";
      this.allCredits = [];
    }
    if (this.lastItemSK !== "end") {
      this.accountService
        .getData(
          `vendor-credits/paging?vendor=${this.filterData.vendorID}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${this.lastItemSK}`
        )
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.isSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true
          }

          if (result.length > 0) {
            this.isSearch = false;
            result.map((v) => {
              v.status = v.status.replace("_", " ");
              this.allCredits.push(v);
            });

            if (this.allCredits[this.allCredits.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                this.allCredits[this.allCredits.length - 1].sk
              );
            } else {
              this.lastItemSK = "end";
            }
            this.loaded = true;
          }
        });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchCredits();
    }
    this.loaded = false;
  }

  searchCredits() {
    if (
      this.filterData.vendorID !== "" ||
      this.filterData.startDate !== "" ||
      this.filterData.endDate !== "" ||
      this.filterData.lastItemSK !== ""
    ) {
      if (this.filterData.startDate !== "" && this.filterData.endDate === "") {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (
        this.filterData.startDate === "" &&
        this.filterData.endDate !== ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filterData.startDate > this.filterData.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.isSearch = true;
        this.allCredits = [];
        this.lastItemSK = "";
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchCredits();
      }
    }
  }

  resetFilter() {
    this.isSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filterData = {
      vendorID: null,
      startDate: "",
      endDate: "",
      lastItemSK: "",
    };
    this.lastItemSK = "";
    this.allCredits = [];
    this.fetchCredits();
  }

  async fetchPurchaseOrders() {
    let result: any = await this.accountService
      .getData(`purchase-orders/get/list`)
      .toPromise();
    this.purchaseOrders = result;
  }
  clear(table: Table) {
    table.clear();
  }
}

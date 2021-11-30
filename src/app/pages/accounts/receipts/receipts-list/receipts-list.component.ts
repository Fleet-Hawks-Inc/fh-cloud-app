import { Component, OnInit } from "@angular/core";

import { AccountService, ApiService } from "./../../../../services";
import { ToastrService } from "ngx-toastr";
import Constants from "../../../fleet/constants";
@Component({
  selector: "app-receipts-list",
  templateUrl: "./receipts-list.component.html",
  styleUrls: ["./receipts-list.component.css"],
})
export class ReceiptsListComponent implements OnInit {
  dataMessage = Constants.FETCHING_DATA;
  receipts = [];
  customersObjects: any = {};
  accountsObject: any = {};
  lastItemSK = "";
  filter = {
    startDate: null,
    endDate: null,
    recNo: null,
    customer: null,
  };
  loaded = false;
  disableSearch = false;
  constructor(
    private accountService: AccountService,
    private toaster: ToastrService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.lastItemSK = "";
    this.receipts = [];
    this.fetchReceipts();
    this.fetchCustomersByIDs();
    this.fetchAccounts();
  }

  fetchReceipts(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = "";
      this.receipts = [];
    }
    if (this.lastItemSK !== "end") {
      if (this.filter.recNo !== null && this.filter.recNo !== "") {
        searchParam = encodeURIComponent(`"${this.filter.recNo}"`);
      } else {
        searchParam = null;
      }
      this.accountService
        .getData(
          `receipts/paging?recNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&customer=${this.filter.customer}&lastKey=${this.lastItemSK}`
        )
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.disableSearch = false;
          }
          if (result.length > 0) {
            this.disableSearch = false;
            for (const element of result) {
              this.receipts.push(element);
            }
            if (this.receipts[this.receipts.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(
                this.receipts[this.receipts.length - 1].sk
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
      this.fetchReceipts();
    }
    this.loaded = false;
  }
  deleteReceipt(recID: string) {
    this.accountService
      .deleteData(`receipts/delete/${recID}`)
      .subscribe((res) => {
        if (res !== undefined) {
          this.dataMessage = Constants.FETCHING_DATA;
          this.receipts = [];
          this.lastItemSK = "";
          this.fetchReceipts();
          this.toastr.success("Receipt Deleted Successfully.");
        }
      });
  }
  /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByIDs() {
    this.apiService.getData("contacts/get/list").subscribe((result: any) => {
      this.customersObjects = result;
    });
  }
  fetchAccounts() {
    this.accountService
      .getData(`chartAc/get/list/all`)
      .subscribe((result: any) => {
        this.accountsObject = result;
      });
  }
  searchFilter() {
    this.lastItemSK = "";
    if (
      this.filter.endDate !== null ||
      this.filter.startDate !== null ||
      this.filter.recNo !== null ||
      this.filter.customer !== null
    ) {
      this.disableSearch = true;
      this.dataMessage = Constants.FETCHING_DATA;

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
        this.receipts = [];
        this.lastItemSK = "";
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchReceipts();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      recNo: null,
      customer: null,
    };
    this.receipts = [];
    this.lastItemSK = "";
    this.fetchReceipts();
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      recNo: null,
      customer: null,
    };
    this.receipts = [];
    this.lastItemSK = "";
    this.fetchReceipts();
  }
}

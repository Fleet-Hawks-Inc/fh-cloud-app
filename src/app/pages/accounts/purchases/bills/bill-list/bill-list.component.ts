import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-bill-list",
  templateUrl: "./bill-list.component.html",
  styleUrls: ["./bill-list.component.css"],
})
export class BillListComponent implements OnInit {
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

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.fetchVendor();
    this.fetchPurchaseOrders();
    this.fetchBills();
  }

  async fetchBills() {
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

    if (result.length > 0 && result[result.length - 1].sk !== undefined) {
      this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
    } else {
      this.lastItemSK = "end";
    }

    result.map((v) => {
      v.url = `/accounts/purchases/bills/details/${v.billID}`;
      v.editUrl = `/accounts/purchases/bills/edit/${v.billID}`;
      this.payOrders.push(v);
    });
    this.loaded = true;
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

  deleteBill(data) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService.deleteData(`bills/delete/${data.billID}`).subscribe({
        complete: () => {},
        error: () => {},
        next: (result: any) => {
          this.dataMessage = Constants.FETCHING_DATA;
          this.payOrders = [];
          this.fetchBills();
          this.toastr.success("Bill deleted successfully");
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
}

import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-purchase-orders-list",
  templateUrl: "./purchase-orders-list.component.html",
  styleUrls: ["./purchase-orders-list.component.css"],
})
export class PurchaseOrdersListComponent implements OnInit {
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

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.fetchVendor();
    await this.fetchPurchases();
  }

  async fetchPurchases() {
    let filterAmount = null;
    if (this.filter.amount) {
      filterAmount = encodeURIComponent(`"${this.filter.amount}"`);
    }
    let result: any = await this.accountService
      .getData(
        `purchase-orders/paging?amount=${filterAmount}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=`
      )
      .toPromise();
    this.disableSearch = false;
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }

    if (result[result.length - 1].sk !== undefined) {
      this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
    } else {
      this.lastItemSK = "end";
    }

    result.map((v) => {
      v.url = `/accounts/purchases/orders/detail/${v.purchaseID}`;
      v.editUrl = `/accounts/purchases/orders/edit/${v.purchaseID}`;
      this.payOrders.push(v);
    });
    // this.payOrders = result;
    this.loaded = true;
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/get/list/vendor`)
      .toPromise();
    this.vendors = result;
  }

  deleteOrder(data) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`purchase-orders/delete/${data.purchaseID}`)
        .subscribe({
          complete: () => {},
          error: () => {},
          next: (result: any) => {
            this.fetchPurchases();
            this.toastr.success("Purchase order deleted successfully");
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
      this.fetchPurchases();
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
    this.fetchPurchases();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchPurchases();
    }
    this.loaded = false;
  }
}

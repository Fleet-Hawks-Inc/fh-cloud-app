import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, DashboardUtilityService } from "src/app/services";

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
  filter = {
    category: null,
    unit: '',
    status: null,
    startDate: '',
    endDate: '',
  };
  disableSearch = true;
  lastItemSK = "";
  loaded = false;
  emailDisabled = false;
  vendors: any = {};
  allStatus = [
    {
      name: 'Open',
      value: 'open'
    },
    {
      name: 'Sent',
      value: 'sent'
    },
    {
      name: 'Closed',
      value: 'closed'
    },
    {
      name: 'Cancelled',
      value: 'cancelled'
    }
  ];
  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private dashboardUtilityService: DashboardUtilityService
  ) { }

  async ngOnInit() {
    this.vendors = await this.dashboardUtilityService.getVendors();
    await this.fetchPurchases();

  }

  resetUnit() {
    this.filter.unit = '';
  }

  async fetchPurchases() {
    console.log('filter', this.filter)
    if (this.lastItemSK !== "end") {
      let category = null;
      let unit = null;
      if (this.filter.category) {
        category = encodeURIComponent(`"${this.filter.category}"`);
      }
      if (this.filter.unit) {
        unit = encodeURIComponent(`"${this.filter.unit}"`);
      }
      let result: any = await this.accountService
        .getData(
          `purchase-orders/paging?category=${category}&unit=${unit}&status=${this.filter.status}&start=${this.filter.startDate}&end=${this.filter.endDate}&lastKey=`
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
        v.url = `/accounts/purchases/orders/detail/${v.purchaseID}`;
        v.editUrl = `/accounts/purchases/orders/edit/${v.purchaseID}`;
        this.payOrders.push(v);
      });
      this.loaded = true;
    }
  }

  deleteOrder(data) {
    if (confirm("Are you sure you want to delete?") === true) {
      this.accountService
        .deleteData(`purchase-orders/delete/${data.purchaseID}`)
        .subscribe({
          complete: () => { },
          error: () => { },
          next: (result: any) => {
            this.dataMessage = Constants.FETCHING_DATA;
            this.lastItemSK = "";
            this.payOrders = [];
            this.fetchPurchases();
            this.toastr.success("Purchase order deleted successfully");
          },
        });
    }
  }

  searchFilter() {
    if (this.filter.category !== null || this.filter.unit !== '' || this.filter.status !== null || this.filter.startDate !== '' || this.filter.endDate !== '') {
      if (
        this.filter.startDate !== '' &&
        this.filter.endDate === ''
      ) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (
        this.filter.startDate === '' &&
        this.filter.endDate !== ''
      ) {
        this.toastr.error('Please select both start and end dates.');
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toastr.error('Start date should be less then end date');
        return false;
      } else {
        this.payOrders = [];
        this.lastItemSK = "";
        this.disableSearch = true;
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchPurchases();
      }
    }

  }

  resetFilter() {
    this.filter = {
      category: null,
      unit: '',
      status: null,
      startDate: '',
      endDate: '',
    };
    this.payOrders = [];
    this.lastItemSK = "";
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

  async sendConfirmationEmail(i: any, purchaseID: any) {
    this.emailDisabled = true;
    let result: any = await this.accountService
      .getData(`purchase-orders/send/confirmation-email/${purchaseID}`)
      .toPromise();
    this.emailDisabled = false;
    if (result) {
      this.toastr.success("Email sent successfully");
      this.payOrders[i].status = 'sent';
    } else {
      this.toastr.error("Something went wrong.");
    }
  }
}

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

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.fetchVendor();
    await this.fetchPayments();
  }

  async fetchPayments() {
    let result: any = await this.accountService
      .getData(`purchase-orders/paging`)
      .toPromise();
    if (result.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
    result.map((v) => {
      v.url = `/accounts/purchases/orders/detail/${v.purchaseID}`;
      v.editUrl = `/accounts/purchases/orders/edit/${v.purchaseID}`;
    });
    this.payOrders = result;
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
            this.fetchPayments();
            this.toastr.success("Purchase order deleted successfully");
          },
        });
    }
  }
}

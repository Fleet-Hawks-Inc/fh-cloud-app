import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-purchase-order-detail",
  templateUrl: "./purchase-order-detail.component.html",
  styleUrls: ["./purchase-order-detail.component.css"],
})
export class PurchaseOrderDetailComponent implements OnInit {
  orderData = {
    txnDate: null,
    refNo: "",
    orderNo: "",
    currency: "CAD",
    vendorID: null,
    detail: [
      {
        comm: "",
        qty: "",
        qtyTyp: null,
        rate: "",
        rateTyp: null,
        amount: 0,
      },
    ],
    charges: {
      remarks: "",
      accFee: [
        {
          name: "",
          amount: 0,
        },
      ],
      accDed: [
        {
          name: "",
          amount: 0,
        },
      ],
      taxes: [
        {
          name: "GST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
        {
          name: "PST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
        {
          name: "HST",
          tax: 0,
          type: "prcnt",
          amount: 0,
        },
      ],
    },
    total: {
      detailTotal: 0,
      feeTotal: 0,
      dedTotal: 0,
      subTotal: 0,
      taxes: 0,
      finalTotal: 0,
    },
    status: "",
    billStatus: "",
  };
  purchaseID;
  vendorName: "";
  emailDisabled = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toaster: ToastrService
  ) {}

  async ngOnInit() {
    this.purchaseID = this.route.snapshot.params["purchaseID"];
    await this.fetchDetails();
    await this.fetchVendor();
  }

  async fetchDetails() {
    let result: any = await this.accountService
      .getData(`purchase-orders/details/${this.purchaseID}`)
      .toPromise();
    this.orderData = result[0];
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/minor/detail/${this.orderData.vendorID}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.vendorName = result.Items[0].cName;
    }
  }

  async sendConfirmationEmail() {
    this.emailDisabled = true;
    let result: any = await this.accountService
      .getData(`purchase-orders/send/confirmation-email/${this.purchaseID}`)
      .toPromise();
    this.emailDisabled = false;
    if (result) {
      this.toaster.success("Email sent successfully");
    } else {
      this.toaster.error("Something went wrong.");
    }
  }
}

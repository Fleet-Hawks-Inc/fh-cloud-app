import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-vendor-payment-detail",
  templateUrl: "./vendor-payment-detail.component.html",
  styleUrls: ["./vendor-payment-detail.component.css"],
})
export class VendorPaymentDetailComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  paymentData = {
    paymentNo: "",
    txnDate: null,
    vendorID: null,
    refNo: "",
    currency: "CAD",
    accountID: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    billIds: [],
    billData: [],
    advIds: [],
    advData: [],
    total: {
      subTotal: 0,
      advTotal: 0,
      finalTotal: 0,
    },
    transactionLog: [],
  };
  vendorName = "";
  paymentID;
  bills = {};
  accountsObjects = [];

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    await this.fetchPayments();
    this.fetchVendor();
    this.fetchBills();
    this.fetchAccountsByIDs();
  }

  async fetchPayments() {
    let result: any = await this.accountService
      .getData(`purchase-payments/details/${this.paymentID}`)
      .toPromise();
    this.paymentData = result[0];
    this.paymentData.payMode = this.paymentData.payMode.replace("_", " ");
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/minor/detail/${this.paymentData.vendorID}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.vendorName = result.Items[0].cName;
    }
  }

  async fetchBills() {
    let result: any = await this.accountService
      .getData(`bills/get/list`)
      .toPromise();
    this.bills = result;
  }

  fetchAccountsByIDs() {
    this.accountService
      .getData("chartAc/get/all/list")
      .subscribe((result: any) => {
        this.accountsObjects = result;
      });
  }
}

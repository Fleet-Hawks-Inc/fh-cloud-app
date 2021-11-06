import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-sales-receipts-detail",
  templateUrl: "./sales-receipts-detail.component.html",
  styleUrls: ["./sales-receipts-detail.component.css"],
})
export class SalesReceiptsDetailComponent implements OnInit {
  saleID: any;
  customersObjects: any;
  dataMessage = Constants.NO_RECORDS_FOUND;

  txnDate: any;
  customerID: any;
  totalAmt: any;
  currency: any;
  shipDate: any;
  sRef: any;
  salePerson: any;
  remarks: any;
  invoiceData: any = [];
  status: any;
  payMode: any;

  invoicesList: any;
  accountsObjects = [];
  transactionLogs = [];

  constructor(
    public accountService: AccountService,
    public apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.fetchInvoicesByID();
      this.fetchCustomersByIDs();
      this.fetchSaleOrder();
      this.fetchAccountsByIDs();
    }
  }

  fetchInvoicesByID() {
    this.accountService
      .getData("sales-invoice/get/list")
      .subscribe((result: any) => {
        this.invoicesList = result;
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

  fetchSaleOrder() {
    this.accountService
      .getData(`sales-receipts/detail/${this.saleID}`)
      .subscribe((res) => {
        let result = res[0];

        this.txnDate = result.txnDate;
        this.customerID = result.customerID;
        this.totalAmt = result.totalAmt;
        this.currency = result.currency;
        this.shipDate = result.shipDate;
        this.sRef = result.sRef;
        this.salePerson = result.salePerson;
        this.remarks = result.remarks;
        this.invoiceData = result.invoiceData;
        this.status = result.status;
        this.payMode = result.payMode;
        this.transactionLogs = result.transactionLog;
      });
  }

  fetchAccountsByIDs() {
    this.accountService
      .getData("chartAc/get/all/list")
      .subscribe((result: any) => {
        this.accountsObjects = result;
      });
  }
}

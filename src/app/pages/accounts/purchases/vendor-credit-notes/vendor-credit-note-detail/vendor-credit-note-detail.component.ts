import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-vendor-credit-note-detail",
  templateUrl: "./vendor-credit-note-detail.component.html",
  styleUrls: ["./vendor-credit-note-detail.component.css"],
})
export class VendorCreditNoteDetailComponent implements OnInit {
  dataMessage: string = Constants.NO_RECORDS_FOUND;
  creditID: any;
  purOrder: string;
  currency: string;
  crRef: string;
  txnDate: string;
  vCrNo: string;
  vendorID: string;
  crDetails: any;
  remarks: string;
  totalAmt: any;
  status: string;
  transactionLog = [];
  accountsObjects = [];

  vendors = [];

  constructor(
    public accountService: AccountService,
    public apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.creditID = this.route.snapshot.params[`creditID`];
    if (this.creditID) {
      this.fetchCredit();
    }
    this.fetchVendors();
    this.fetchAccountsByIDs();
  }

  fetchCredit() {
    this.accountService
      .getData(`vendor-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        let result = res[0];
        this.purOrder = result.purOrder;
        this.currency = result.currency;
        this.crRef = result.crRef;
        this.txnDate = result.txnDate;
        this.vCrNo = result.vCrNo;
        this.vendorID = result.vendorID;
        this.crDetails = result.crDetails;
        this.remarks = result.remarks;
        this.status = result.status;
        this.totalAmt = result.totalAmt;
        this.transactionLog = result.transactionLog;
      });
  }

  fetchVendors() {
    this.apiService
      .getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
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

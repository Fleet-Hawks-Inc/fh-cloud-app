import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-credit-note-detail",
  templateUrl: "./credit-note-detail.component.html",
  styleUrls: ["./credit-note-detail.component.css"],
})
export class CreditNoteDetailComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  creditID: any;
  salePerson: string;
  currency: string;
  crRef: string;
  txnDate: string;
  cCrNo: string;
  customerID: string;
  crDetails: any = [];
  remarks: string;
  totalAmt: any;
  status: string;
  transactionLogs = [];
  accountsObjects = [];

  customers = [];

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
    this.fetchCustomers();
    this.fetchAccountsByIDs();
  }

  fetchCredit() {
    this.accountService
      .getData(`customer-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        let result = res[0];
        this.salePerson = result.salePerson;
        this.currency = result.currency;
        this.crRef = result.crRef;
        this.txnDate = result.txnDate;
        this.cCrNo = result.cCrNo;
        this.customerID = result.customerID;
        this.crDetails = result.crDetails;
        this.remarks = result.remarks;
        this.status = result.status;
        this.totalAmt = result.totalAmt;
        this.transactionLogs = result.transactionLog;
      });
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/list`).subscribe((result: any) => {
      this.customers = result;
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

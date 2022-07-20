import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-credit-note-detail",
  templateUrl: "./credit-note-detail.component.html",
  styleUrls: ["./credit-note-detail.component.css"],
})
export class CreditNoteDetailComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  assetUrl = this.apiService.AssetUrl;

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

  customers = [];
  docs = [];
  carrierID = '';

  constructor(
    public accountService: AccountService,
    public apiService: ApiService,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.creditID = this.route.snapshot.params[`creditID`];
    if (this.creditID) {
      this.fetchCredit();
    }
    this.fetchCustomers();
  }

  fetchCredit() {
    this.accountService
      .getData(`customer-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        let result = res[0];
        this.carrierID = result.pk;
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

        if (result.docs.length > 0) {
          result.docs.forEach((x: any) => {
            let obj: any = {};
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              obj = {
                imgPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
                docPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            }
            this.docs.push(obj);
          });
        }
      });
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/list`).subscribe((result: any) => {
      this.customers = result;
    });
  }



  deleteDocument(name: string, index: number) {
    this.accountService
      .deleteData(`customer-credits/uploadDelete/${this.creditID}/${name}`)
      .subscribe((result: any) => {
        this.docs.splice(index, 1);
        this.toaster.success("Attachment deleted successfully.");
      });
  }
}

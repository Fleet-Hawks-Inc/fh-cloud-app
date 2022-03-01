import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
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
  crDetails: any = [];
  remarks: string;
  totalAmt: any;
  status: string;
  transactionLog = [];
  purchaseOrders = [];

  vendors = [];
  docs = [];

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
    this.fetchVendors();
    this.fetchPurchaseOrders();
  }

  fetchCredit() {
    this.accountService
      .getData(`vendor-credits/detail/${this.creditID}`)
      .subscribe((res) => {
        let result = res[0];
        this.purOrder = result.purOrder;
        console.log("purOrder", this.purOrder);
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
        if (result.docs.length > 0) {
          result.docs.forEach((x: any) => {
            let obj: any = {};
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              obj = {
                imgPath: `${x.urlPath}`,
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${x.urlPath}`,
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

  fetchVendors() {
    this.apiService
      .getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      });
  }


  async fetchPurchaseOrders() {
    let result: any = await this.accountService
      .getData(`purchase-orders/get/list`)
      .toPromise();
    this.purchaseOrders = result;
  }

  deleteDocument(name: string, index: number) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.accountService
        .deleteData(`vendor-credits/uploadDelete/${this.creditID}/${name}`)
        .subscribe((result: any) => {
          this.docs.splice(index, 1);
          this.toaster.success("Attachment deleted successfully.");
        });
    }

  }
}

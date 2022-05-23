import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";

@Component({
  selector: "app-bill-details",
  templateUrl: "./bill-details.component.html",
  styleUrls: ["./bill-details.component.css"],
})
export class BillDetailsComponent implements OnInit {
  noRecord: string = Constants.NO_RECORDS_FOUND;
  orderData = {
    attachments: [],
    billNo: "",
    txnDate: null,
    refNo: "",
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
        accountID: null,
        description: "",
        rowID: "",
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
      vendorCredit: 0,
      taxes: 0,
      finalTotal: 0,
    },
    status: "open",
    billType: null,
    dueDate: null,
    paymentTerm: null,
    purchaseID: null,
    creditIds: [],
    creditData: [],
    transactionLog: [],
  };
  billID = "";
  vendorName = "";
  puchaseOrdNo = "";
  documentSlides = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl("");
  Asseturl = this.apiService.AssetUrl;
  accountsObjects = [];

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private toaster: ToastrService
  ) { }

  async ngOnInit() {
    this.billID = this.route.snapshot.params["billID"];
    await this.fetchDetails();
    this.fetchVendor();
    this.purchaseOrderDetail();
    this.fetchVendorCredits();
  }

  async fetchDetails() {
    let result: any = await this.accountService
      .getData(`bills/details/${this.billID}`)
      .toPromise();
    this.orderData = result[0];

    for (const item of this.orderData.transactionLog) {
      if (item.desc.includes('Vendor credits')) {
        item.desc = ' (vendor credits applied)';
      } else {
        item.desc = '';
      }
    }

    if (
      result[0].attachments != undefined &&
      result[0].attachments.length > 0
    ) {
      result[0].attachments.map((x) => {
        let obj = {
          name: x.displayname,
          bucketName: x.actualname,
          path: `${this.Asseturl}/${result[0].pk}/${x.actualname}`,
        };
        this.documentSlides.push(obj);
      });
    }
    this.orderData.paymentTerm = this.orderData.paymentTerm.replace("_", " ");
    this.orderData.status = this.orderData.status.replace("_", " ");
  }

  async purchaseOrderDetail() {
    if (this.orderData.purchaseID) {
      let result: any = await this.accountService
        .getData(`purchase-orders/details/minor/${this.orderData.purchaseID}`)
        .toPromise();

      this.puchaseOrdNo = result[0].orderNo;
    }
  }

  async fetchVendor() {
    let result: any = await this.apiService
      .getData(`contacts/minor/detail/${this.orderData.vendorID}`)
      .toPromise();
    if (result.Items.length > 0) {
      this.vendorName = result.Items[0].cName;
    }
  }

  async fetchVendorCredits() {
    if (this.orderData.creditIds.length > 0) {
      let creditIds = encodeURIComponent(
        JSON.stringify(this.orderData.creditIds)
      );
      let result: any = await this.accountService
        .getData(`vendor-credits/get/selected?entities=${creditIds}`)
        .toPromise();
      this.orderData.creditData.map((v) => {
        result.map((k) => {
          if (v.creditID === k.creditID) {
            v.creditAmount = k.totalAmt;
            v.creditNo = k.vCrNo;
            v.txnDate = k.txnDate;
          }
        });
      });
    }
  }

  setPDFSrc(val) {
    let pieces = val.split(/[\s.]+/);
    let ext = pieces[pieces.length - 1];
    this.pdfSrc = "";
    if (ext == "doc" || ext == "docx" || ext == "xlsx") {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
        "https://docs.google.com/viewer?url=" + val + "&embedded=true"
      );
    } else {
      this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(val);
    }
  }

  deleteDocument(name: string, index: number) {

    this.accountService
      .deleteData(`bills/uploadDelete/${this.billID}/${name}`)
      .subscribe((result: any) => {
        this.documentSlides.splice(index, 1);
        this.toaster.success("Attachment deleted successfully.");
      });
  }

}

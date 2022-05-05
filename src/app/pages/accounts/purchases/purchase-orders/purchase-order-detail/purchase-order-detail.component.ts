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
  commDetails = [];
  taxes = [];
  poType: string;
  charges: any;
  currency: string;
  txnDate: string;
  refNo: string;
  orderNo: string;
  status: string;
  billStatus: string;
  vendorID: string;
  finalTotal: string;
  remarks: string;

  purchaseID;
  vendorName: "";
  emailDisabled = false;
  documents: any = [];

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toaster: ToastrService
  ) { }

  async ngOnInit() {
    this.purchaseID = this.route.snapshot.params["purchaseID"];
    await this.fetchDetails();

  }

  async fetchDetails() {
    let result: any = await this.accountService
      .getData(`purchase-orders/details/${this.purchaseID}`)
      .toPromise();
    await this.fetchVendor(result[0].vendorID);
    this.txnDate = result[0].txnDate;
    this.currency = result[0].currency;
    this.finalTotal = result[0].total.finalTotal;
    this.refNo = result[0].refNo;
    this.remarks = result[0].remarks;
    this.poType = result[0].poType;
    this.orderNo = result[0].orderNo;
    this.status = result[0].status;
    this.billStatus = result[0].billStatus;
    this.commDetails = result[0].detail;
    if (result[0].docs.length > 0) {
      result[0].docs.forEach((x: any) => {
        let obj: any = {};
        if (
          x.storedName.split(".")[1] === "jpg" ||
          x.storedName.split(".")[1] === "png" ||
          x.storedName.split(".")[1] === "jpeg"
        ) {
          obj = {
            imgPath: `${x.storedName}`,
            docPath: `${x.storedName}`,
            displayName: x.displayName,
            name: x.storedName,
            ext: x.storedName.split(".")[1],
          };
        } else {
          obj = {
            imgPath: "assets/img/icon-pdf.png",
            docPath: `${x.storedName}`,
            displayName: x.displayName,
            name: x.storedName,
            ext: x.storedName.split(".")[1],
          };
        }
        this.documents.push(obj);
      });
    }
  }


  deleteDocument(name: string, index: number) {
    this.accountService
      .deleteData(`purchase-orders/uploadDelete/${this.purchaseID}/${name}`)
      .subscribe((result: any) => {
        this.documents.splice(index, 1);
        this.toaster.success("Attachment deleted successfully.");
      });
  }

  async fetchVendor(vendorID: string) {
    let result: any = await this.apiService
      .getData(`contacts/minor/detail/${vendorID}`)
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

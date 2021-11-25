import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService, ApiService } from "../../../../services";
@Component({
  selector: "app-load-invoice-detail",
  templateUrl: "./load-invoice-detail.component.html",
  styleUrls: ["./load-invoice-detail.component.css"],
})
export class LoadInvoiceDetailComponent implements OnInit {
  invID = "";
  showDetails = false;
  invoiceData: any = {
    orderID: "",
  };
  vehicles = [];
  assets = []
  customersObjects = {};
  accountsObjects = {};
  accountsIntObjects = {};
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    this.invID = this.route.snapshot.params[`invID`];
    if (this.invID) {
      await this.fetchInvoice();
      await this.fetchOrderInvoiceData();
    }
    this.fetchAccountsByInternalIDs();
  }

  async fetchInvoice() {
    let res: any = await this.accountService
      .getData(`order-invoice/detail/${this.invID}`)
      .toPromise();
    this.invoiceData = res[0];

    this.invoiceData.transactionLog.map((v: any) => {
      v.type = v.type.replace("_", " ");
    });
  }

  fetchAccountsByInternalIDs() {
    this.accountService
      .getData("chartAc/get/internalID/list/all")
      .subscribe((result: any) => {
        this.accountsIntObjects = result;
      });
  }

  async fetchOrderInvoiceData() {
    let result: any = await this.apiService
      .getData(`orders/invoice/${this.invoiceData.orderID}`)
      .toPromise();
    if (result) {
      this.showDetails = true;
    }
    this.invoiceData["additionalContact"] = result[0]["additionalContact"];
    this.invoiceData["carrierData"] = result[0]["carrierData"];
    this.invoiceData["cusAddressID"] = result[0]["cusAddressID"];
    this.invoiceData["orderNumber"] = result[0]["orderNumber"];
    this.invoiceData["data"] = result[0]["data"];

    console.log('this.invoiceData', this.invoiceData)
    if (result[0].assets != undefined) {
      this.assets = result[0].assets;
    }
    if (result[0].vehicles != undefined) {
      this.vehicles = result[0].vehicles;
    }
  }
}

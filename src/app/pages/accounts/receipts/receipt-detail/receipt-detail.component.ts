import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Constants from "../../../fleet/constants";
import { AccountService, AccountUtilityService } from "./../../../../services";
import * as html2pdf from "html2pdf.js";
@Component({
  selector: "app-receipt-detail",
  templateUrl: "./receipt-detail.component.html",
  styleUrls: ["./receipt-detail.component.css"],
})
export class ReceiptDetailComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
  public recID: string;
  accountsObjects = {};
  accountsIntObjects: any = {};
  receiptData = {
    customerID: null,
    txnDate: null,
    recNo: null,
    recAmount: 0,
    recAmountCur: null,
    accountID: null,
    paymentMode: null,
    paymentModeNo: null,
    paymentModeDate: null,
    paidInvoices: [],
    fetchedInvoices: [],
    transactionLog: [],
    custData: [],
    charges: {
      addition: [],
      deduction: [],
      addTotal: 0,
      dedTotal: 0,
      addAccountID: null,
      dedAccountID: null,
    },
    isFeatEnabled: false,
  };
  customerName = "";
  isLoaded = false;
  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private accountUtility: AccountUtilityService
  ) {}

  async ngOnInit() {
    this.recID = this.route.snapshot.params[`recID`];
    if (this.recID) {
      this.fetchReceipt();
    }
  }

  async fetchReceipt() {
    this.accountService
      .getData(`receipts/detail/${this.recID}`)
      .subscribe((res: any) => {
        this.receiptData = res[0];
        if (!this.receiptData.isFeatEnabled) {
          this.accountsIntObjects = this.accountUtility.getPreDefinedAccounts();
        }
        this.isLoaded = true;
        if (this.receiptData.custData) {
          for (let i = 0; i < this.receiptData.custData.length; i++) {
            const element = this.receiptData.custData[i];
            this.customerName += element.cName;
            if (i < this.receiptData.custData.length - 1) {
              this.customerName += ", ";
            }
          }
        }

        for (let i = 0; i < this.receiptData.paidInvoices.length; i++) {
          const element = this.receiptData.paidInvoices[i];
          this.receiptData.fetchedInvoices.map((v) => {
            if (v.invID === element.invID) {
              element.invNo = v.invNo;
              element.finalAmount = v.finalAmount;
            }
          });
        }

        for (let j = 0; j < this.receiptData.transactionLog.length; j++) {
          const element = this.receiptData.transactionLog[j];
          element.accName = "";
          element.type = element.type.replace("_", " ");
          if (
            element.actIDType === "actID" &&
            !this.receiptData.isFeatEnabled
          ) {
            this.receiptData.fetchedInvoices.map((v) => {
              if (v._type === "Accounts" && v.actID === element.accountID) {
                element.accName = v.actName;
              }
            });
          }
        }
      });
  }

  async generateReceiptPDF() {
    const data = document.getElementById("recpt_pdf");
    html2pdf(data, {
      margin: [0.5, 0, 0.5, 0],
      pagebreak: { mode: "avoid-all", before: "recpt_pdf" },
      filename: `REC-${this.receiptData.recNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    localStorage.setItem("downloadDisabled", "false");
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import Constants from "../../../fleet/constants";
import * as html2pdf from "html2pdf.js";
@Component({
  selector: "app-expense-detail",
  templateUrl: "./expense-detail.component.html",
  styleUrls: ["./expense-detail.component.css"],
})
export class ExpenseDetailComponent implements OnInit {
  @ViewChild("previewExpTransaction", { static: true })
  previewExpTransaction: TemplateRef<any>;

  expenseID = "";
  expenses = [];
  vendors = [];
  expenseData = {
    categoryID: null,
    expAccountID: null,
    paidAccountID: null,
    amount: 0,
    currency: null,
    isFeatEnabled: false,
    recurring: {
      status: false,
      startDate: null,
      endDate: null,
      interval: null,
    },
    txnDate: null,
    unitType: null,
    unitID: null,
    tripID: null,
    vendorID: null,
    countryCode: null,
    countryName: "",
    stateCode: null,
    stateName: "",
    cityName: null,
    taxes: {
      includeGST: true,
      gstPercent: "",
      gstAmount: "",
      includePST: true,
      pstPercent: "",
      pstAmount: "",
      includeHST: true,
      hstpercent: "",
      hstAmount: "",
    },
    customerID: null,
    invoiceID: null,
    documents: [],
    notes: "",
    finalTotal: "",
    transactionLog: [],
  };
  Asseturl = this.apiService.AssetUrl;
  documentSlides = [];
  pdfSrc;
  accounts = [];
  invoices = [];
  categories = [];
  units = [];
  accountsObjects: any = {};
  customersObject: any = {};
  accountsIntObjects: any = {};
  trips: any = {};
  downloadDisabled = true;
  companyLogo: string;
  tagLine: string;
  carrierName: string;
  expPayRef: any;

  constructor(
    private accountService: AccountService,
    private apiService: ApiService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.expenseID = this.route.snapshot.params[`expenseID`];
    this.fetchExpenseByID();
    this.fetchVendors();
    this.fetchExpenseCategories();
    this.fetchTrips();
  }

  fetchExpenseByID() {
    this.accountService
      .getData(`expense/detail/${this.expenseID}`)
      .subscribe((result: any) => {
        if (result[0] !== undefined) {
          this.expenseData = result[0];
          if (!this.expenseData.isFeatEnabled) {
            this.fetchAccountsByIDs();
            this.fetchAccountsByInternalIDs();
          }
          this.expenseData.transactionLog.map((v: any) => {
            v.type = v.type.replace("_", " ");
          });
          if (this.expenseData.unitType === "vehicle") {
            this.fetchVehicles();
          } else {
            this.fetchAssets();
          }

          if (
            result[0].documents != undefined &&
            result[0].documents.length > 0
          ) {
            result[0].documents.map((x) => {
              let obj = {
                name: x,
                path: `${this.Asseturl}/${result[0].carrierID}/${x}`,
              };
              this.documentSlides.push(obj);
            });
          }
          this.companyLogo = result[0].carrierDtl.logo;
          this.tagLine = result[0].carrierDtl.tagLine;
          this.carrierName = result[0].carrierDtl.carrierName;
          this.downloadDisabled = false;
        }
      });
  }

  fetchVendors() {
    this.apiService.getData(`contacts/get/list`).subscribe((result: any) => {
      this.vendors = result;
    });
  }
  fetchTrips() {
    this.apiService.getData(`trips/get/list`).subscribe((result: any) => {
      this.trips = result;
    });
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

  fetchAccountsByIDs() {
    this.accountService
      .getData("chartAc/get/list/all")
      .subscribe((result: any) => {
        this.accountsObjects = result;
      });
  }
  fetchAccountsByInternalIDs() {
    this.accountService
      .getData("chartAc/get/internalID/list/all")
      .subscribe((result: any) => {
        this.accountsIntObjects = result;
      });
  }

  deleteDocument(name: string, index: number) {
    this.accountService
      .deleteData(`expense/uploadDelete/${this.expenseID}/${name}`)
      .subscribe((result: any) => {
        this.documentSlides.splice(index, 1);
        this.toaster.success("Attachment deleted successfully.");
      });
  }

  fetchExpenseCategories() {
    this.accountService
      .getData(`expense/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      });
  }

  fetchVehicles() {
    this.apiService.getData(`vehicles/get/list`).subscribe((result: any) => {
      this.units = result;
    });
  }

  fetchAssets() {
    this.apiService.getData(`assets/get/list`).subscribe((result: any) => {
      this.units = result;
    });
  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "preview-sale-order",
    };
    this.expPayRef = this.modalService.open(this.previewExpTransaction, ngbModalOptions)
  }

  generatePaymentPDF() {
    let data = document.getElementById("print-exp-trans");
    html2pdf(data, {
      margin: 0.5,
      pagebreak: { mode: "avoid-all", before: 'print-exp-trans' },
      filename: `expense-transaction-.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, logging: true, dpi: 192, letterRendering: true, allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    this.expPayRef.close();
    this.downloadDisabled = false;
  }

}

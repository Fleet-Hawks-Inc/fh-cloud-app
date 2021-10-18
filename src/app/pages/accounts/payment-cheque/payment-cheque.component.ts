import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Auth } from "aws-amplify";
import { AccountService, ApiService, ListService } from "src/app/services";
import * as html2pdf from "html2pdf.js";
import { Subscription } from "rxjs";
import { formatDate } from "@angular/common";
var converter = require("number-to-words");
declare var $: any;

@Component({
  selector: "app-payment-cheque",
  templateUrl: "./payment-cheque.component.html",
  styleUrls: ["./payment-cheque.component.css"],
})
export class PaymentChequeComponent implements OnInit {
  @ViewChild("chekOptions", { static: true }) modalContent: TemplateRef<any>;
  @ViewChild("previewCheque", { static: true }) previewCheque: TemplateRef<any>;

  carriers = [];
  addresses = [];
  currCarrId = "";
  carrierID = null;
  paydata = {
    entityName: "",
    entityId: "",
    chequeDate: "",
    chequeAmount: 0,
    type: "",
    txnDate: "",
    chequeNo: "",
    currency: "",
    formType: "",
    payYear: "",
    fromDate: "",
    toDate: "",
    vacPayPer: 0,
    vacPayAmount: 0,
    totalAmount: 0,
    settledAmount: 0,
    taxdata: {
      payPeriod: null,
      stateCode: null,
      federalCode: "claim_code_1",
      provincialCode: null,
      cpp: 0,
      ei: 0,
      federalTax: 0,
      provincialTax: 0,
      emplCPP: 0,
      emplEI: 0,
    },
    finalAmount: 0,
    advance: 0,
    page: "",
    invoices: [],
  };

  cheqdata = {
    companyName: "",
    companyAddress: null,
    chqNo: "",
    date: "",
    payDate: "",
    amount: 0,
    payPeriod: "",
    entityName: "",
    entityAddress: "",
    vacationPay: 0,
    regularPay: 0,
    cpp: 0,
    ei: 0,
    tax: 0,
    grossPay: 0,
    withHeld: 0,
    netPay: 0,
    vacationPayYTD: 0,
    regularPayYTD: 0,
    cppYTD: 0,
    eiYTD: 0,
    taxYTD: 0,
    grossPayYTD: 0,
    withHeldYTD: 0,
    netPayYTD: 0,
    amountWords: "",
    decimals: "",
    invoices: [],
    currency: "",
    currencyText: "",
  };
  driverData;

  subscription: Subscription;
  locale = "en-US";

  constructor(
    private listService: ListService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.subscription = this.listService.paymentModelList.subscribe(
      (res: any) => {
        if (res.showModal && res.length != 0) {
          this.paydata = res;
          this.cheqdata.payDate = formatDate(
            this.paydata.txnDate,
            "dd-MM-yyyy",
            this.locale
          );
          this.cheqdata.currency = this.paydata.currency;
          if (this.cheqdata.currency === "CAD") {
            this.cheqdata.currencyText = "Amount in Canadian Dollars";
          } else if (this.cheqdata.currency === "USD") {
            this.cheqdata.currencyText = "Amount in US Dollars";
          }
          if (
            this.paydata.type === "driver" ||
            this.paydata.type === "employee" ||
            this.paydata.type === "owner_operator" ||
            this.paydata.type === "carrier"
          ) {
            this.paydata.payYear = formatDate(
              this.paydata.toDate,
              "yyyy",
              this.locale
            );
            let startDate = formatDate(
              this.paydata.fromDate,
              "dd-MM-yyyy",
              this.locale
            );
            let endDate = formatDate(
              this.paydata.toDate,
              "dd-MM-yyyy",
              this.locale
            );
            this.cheqdata.payPeriod = `${startDate} To ${endDate}`;
          }

          this.cheqdata.chqNo = this.paydata.chequeNo;
          if (
            this.paydata.type === "driver" ||
            this.paydata.type === "employee"
          ) {
            this.cheqdata.regularPay = this.paydata.settledAmount;
            this.cheqdata.vacationPay = this.paydata.vacPayAmount;
            this.cheqdata.grossPay =
              Number(this.cheqdata.regularPay) +
              Number(this.cheqdata.vacationPay);
            this.cheqdata.cpp = this.paydata.taxdata.cpp;
            this.cheqdata.ei = this.paydata.taxdata.ei;
            this.cheqdata.tax =
              Number(this.paydata.taxdata.federalTax) +
              Number(this.paydata.taxdata.provincialTax);
            this.cheqdata.withHeld =
              Number(this.cheqdata.cpp) +
              Number(this.cheqdata.ei) +
              Number(this.cheqdata.tax);
            this.cheqdata.netPay =
              Number(this.cheqdata.grossPay) - Number(this.cheqdata.withHeld);
          } else if (
            this.paydata.type === "owner_operator" ||
            this.paydata.type === "carrier" ||
            this.paydata.type === "vendor"
          ) {
            this.cheqdata.regularPay = this.paydata.finalAmount;
            this.cheqdata.grossPay = this.paydata.finalAmount;
            if (this.paydata.type === "vendor") {
              this.cheqdata.invoices = this.paydata.invoices;
            }
          }

          if (this.paydata.type == "driver") {
            this.fetchDriver();
          } else {
            this.fetchContact();
          }
          if (
            this.paydata.type === "driver" ||
            this.paydata.type === "employee" ||
            this.paydata.type === "owner_operator" ||
            this.paydata.type === "carrier"
          ) {
            this.getUserAnnualTax();
          }

          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "chekOptions-prog__main",
          };
          res.showModal = false;
          this.modalService
            .open(this.modalContent, ngbModalOptions)
            .result.then(
              (result) => {},
              (reason) => {}
            );
        }
      }
    );
    this.getCarriers();
    this.getCurrentuser();
  }

  prevCheck() {
    this.cheqdata.date = formatDate(
      this.paydata.chequeDate,
      "ddMMyyyy",
      this.locale
    );
    this.cheqdata.amount = this.paydata.finalAmount;
    this.cheqdata.amountWords = converter.toWords(this.cheqdata.amount);
    let amountSplit = this.paydata.finalAmount.toString().split(".");
    let decimals = 0.0;
    if (amountSplit.length > 0) {
      let decc = Number(amountSplit[1]);
      decimals = decc > 0 ? decc : 0.0;
    }

    if (decimals > 0) {
      this.cheqdata.decimals = ` and ${decimals}/100`;
    }
    this.modalService.dismissAll();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: false,
      windowClass: "peviewCheque-prog__main",
    };
    this.modalService.open(this.previewCheque, ngbModalOptions).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  getCarriers() {
    this.apiService
      .getData(`contacts/get/records/carrier`)
      .subscribe((result: any) => {
        for (let i = 0; i < result.Items.length; i++) {
          const element = result.Items[i];
          element.type = "sub";
          this.carriers.push(element);
        }
      });
  }

  getCurrentuser = async () => {
    let data = (await Auth.currentSession()).getIdToken().payload;
    this.getCurrentCarrDetail(data.carrierID);
  };

  getCurrentCarrDetail(carrierID) {
    this.apiService
      .getData(`carriers/detail/${carrierID}`)
      .subscribe((result: any) => {
        result.type = "main";
        result.contactID = result.carrierID;
        result.cName = result.companyName;
        this.carriers.unshift(result);
      });
  }

  selectedCarrier(val) {
    this.cheqdata.companyName = val.companyName;
    this.addresses = [];
    if (val.type === "main") {
      val.address.map((v) => {
        if (v.manual) {
          v.fullAddr = `${v.address}, ${v.stateName}, ${v.cityName}, ${v.countryName}, ${v.zipCode}`;
        } else {
          v.fullAddr = v.userLocation;
        }
      });
      this.addresses = val.address;
    } else if (val.type === "sub") {
      val.adrs.map((v) => {
        if (v.manual) {
          v.fullAddr = `${v.add1}, ${v.add2} ${v.sName}, ${v.ctyName}, ${v.cName}, ${v.zip}`;
        } else {
          v.fullAddr = v.userLoc;
        }
      });
      this.addresses = val.adrs;
    }
  }

  async generatePDF() {
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0,
      filename: `cheque.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  }

  fetchDriver() {
    this.apiService
      .getData(`drivers/${this.paydata.entityId}`)
      .subscribe((result: any) => {
        this.driverData = result.Items[0];
        this.cheqdata.entityName =
          this.driverData.firstName + " " + this.driverData.lastName;
        let addr = result.Items[0].address[0];
        if (addr.manual) {
          this.cheqdata.entityAddress = `${addr.address}, ${addr.stateName}, ${addr.cityName}, ${addr.countryName}, ${addr.zipCode}`;
        } else {
          this.cheqdata.entityAddress = addr.userLocation;
        }
      });
  }

  fetchContact() {
    if (this.paydata.entityId != null) {
      this.apiService
        .getData(`contacts/detail/${this.paydata.entityId}`)
        .subscribe((result: any) => {
          this.cheqdata.entityName = result.Items[0].cName;
          let addr = result.Items[0].adrs[0];
          if (addr.manual) {
            this.cheqdata.entityAddress = `${addr.add1} ${addr.add2}, ${addr.sName}, ${addr.ctyName}, ${addr.cName}, ${addr.zip}`;
          } else {
            this.cheqdata.entityAddress = addr.userLoc;
          }
        });
    }
  }

  saveDownload() {
    this.generatePDF();
    this.modalService.dismissAll();
    this.listService.triggerPaymentSave(this.paydata.type);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async getUserAnnualTax() {
    let result: any = await this.accountService
      .getData(
        `driver-payments/annual/payment/${this.paydata.entityId}/${this.paydata.payYear}`
      )
      .toPromise();
    this.cheqdata.vacationPayYTD = result[0].vacationPay
      ? result[0].vacationPay
      : 0;
    this.cheqdata.regularPayYTD = result[0].regEarning
      ? result[0].regEarning
      : 0;
    this.cheqdata.cppYTD = result[0].cpp ? result[0].cpp : 0;
    this.cheqdata.eiYTD = result[0].ei ? result[0].ei : 0;
    this.cheqdata.taxYTD =
      Number(result[0].federalTax) + Number(result[0].provincialTax);

    if (this.paydata.page === "addForm") {
      this.cheqdata.vacationPayYTD =
        Number(this.cheqdata.vacationPayYTD) +
        Number(this.cheqdata.vacationPay);
      this.cheqdata.regularPayYTD =
        Number(this.cheqdata.regularPayYTD) + Number(this.cheqdata.regularPay);
      this.cheqdata.cppYTD =
        Number(this.cheqdata.cppYTD) + Number(this.cheqdata.cpp);
      this.cheqdata.eiYTD =
        Number(this.cheqdata.eiYTD) + Number(this.cheqdata.ei);
      this.cheqdata.taxYTD =
        Number(this.cheqdata.taxYTD) + Number(this.cheqdata.tax);
    }

    this.cheqdata.grossPayYTD =
      Number(this.cheqdata.vacationPayYTD) +
      Number(this.cheqdata.regularPayYTD);
    this.cheqdata.withHeldYTD =
      Number(this.cheqdata.cppYTD) + Number(this.cheqdata.eiYTD);
    this.cheqdata.netPayYTD =
      Number(this.cheqdata.grossPayYTD) - Number(this.cheqdata.withHeldYTD);
  }
}

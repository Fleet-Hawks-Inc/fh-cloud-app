import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ApiService, ListService } from "src/app/services";
import * as html2pdf from "html2pdf.js";

@Component({
  selector: "app-brokerage-pdf",
  templateUrl: "./brokerage-pdf.component.html",
  styleUrls: ["./brokerage-pdf.component.css"],
})
export class BrokeragePdfComponent implements OnInit {
  constructor(
    private listService: ListService,
    private apiService: ApiService
  ) { }
  subscription: Subscription;
  brokerage = {
    orderNo: "",
    orderID: "",
    carrierID: null,
    finalAmount: "",
    miles: 0,
    currency: "",
    draw: 0,
    index: 0,
    type: "",
    brokerageAmount: 0,
    instructions: "",
    today: "",
  };
  logoSrc = "assets/img/logo.png";
  orderData = {
    additionalContact: <any>null,
    carrierData: {
      address: "",
      companyName: "",
      phone: "",
      email: "",
      fax: "",
      logo: "",
      carrierID: "",
    },
    charges: {
      accessorialDeductionInfo: {
        accessorialDeduction: [],
      },
      accessorialFeeInfo: {
        accessorialFee: [],
      },
      freightFee: {
        amount: 0,
        currency: "",
        type: "",
      },
      fuelSurcharge: {
        amount: 0,
        currency: "",
        type: "",
      },
      cusAddressID: "",
      customerID: "",
    },
    data: [],
    finalAmount: 0,
    phone: "",
    subTotal: 0,
    taxesAmt: 0,
  };
  carrierData = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };
  companyLogo = "";

  ngOnInit() {
    this.subscription = this.listService.brokeragePdfList.subscribe(
      async (res: any) => {
        if (res.showModal && res.length != 0) {
          res.showModal = false;
          this.brokerage = res.brokerage;
          this.orderData = res.orderData;
          this.carrierData = res.carrierData;
          this.companyLogo = res.companyLogo;
          this.generatePDF();
        }
      }
    );
  }

  async generatePDF() {
    var data = document.getElementById("print_brokerage");
    html2pdf(data, {
      margin: 0,
      filename: `Carrier Confirmation (${this.brokerage.orderNo})${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

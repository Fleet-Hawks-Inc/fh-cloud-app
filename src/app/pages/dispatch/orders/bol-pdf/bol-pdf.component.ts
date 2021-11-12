import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ListService } from "src/app/services";
import * as html2pdf from "html2pdf.js";

@Component({
  selector: "app-bol-pdf",
  templateUrl: "./bol-pdf.component.html",
  styleUrls: ["./bol-pdf.component.css"],
})
export class BolPdfComponent implements OnInit {
  constructor(private listService: ListService) {}
  subscription: Subscription;
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
  logoSrc = "assets/img/logo.png";

  ngOnInit() {
    this.subscription = this.listService.bolPdfList.subscribe(
      async (res: any) => {
        if (res.showModal && res.length != 0) {
          console.log("res====", res);
          this.orderData = res.orderData;
          this.carrierData = res.carrierData;
          this.companyLogo = res.companyLogo;
          this.generatePDF();
        }
      }
    );
  }

  async generatePDF() {
    var data = document.getElementById("print_bol");
    html2pdf(data, {
      margin: 0,
      filename: `BOL ${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

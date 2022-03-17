import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { ListService } from "src/app/services";
import * as html2pdf from "html2pdf.js";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-bol-pdf",
  templateUrl: "./bol-pdf.component.html",
  styleUrls: ["./bol-pdf.component.css"],
})
export class BolPdfComponent implements OnInit {
  @ViewChild("ordBolPrev", { static: true })
  ordBolPrev: TemplateRef<any>;
  constructor(
    private listService: ListService,
    private modalService: NgbModal
  ) { }
  subscription: Subscription;

  drivers = [];
  assets = [];
  vehicles = [];
  orderData = [];
  carrierData = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };
  companyLogo = "";
  finalAmount: any;
  logoSrc = "assets/img/logo.png";

  ngOnInit() {
    this.subscription = this.listService.bolPdfList.subscribe(
      async (res: any) => {
        console.log('bol data', res)
        if (res.showModal && res.length != 0) {

          this.orderData = res.orderData;
          this.drivers = res.drivers;
          this.assets = res.assets;
          this.vehicles = res.vehicles;
          this.carrierData = res.carrierData;
          this.companyLogo = res.companyLogo;
          this.finalAmount = res.finalAmount;

          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "ordBolPrev-prog__main",
          };
          res.showModal = false;
          this.modalService
            .open(this.ordBolPrev, ngbModalOptions)
            .result.then(
              (result) => { },
              (reason) => { }
            );
          // this.generatePDF();
        }
      }
    );
  }

  async generatePDF() {
    var data = document.getElementById("print_bol");
    html2pdf(data, {
      margin: [0.5],
      pagebreak: { mode: "avoid-all", before: "print_bol" },
      filename: `BOL ${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { AccountService } from "src/app/services/account.service";
import { ApiService } from "src/app/services/api.service";
import { ListService } from "src/app/services/list.service";
import * as html2pdf from "html2pdf.js";

@Component({
  selector: "app-detail-pdf",
  templateUrl: "./detail-pdf.component.html",
  styleUrls: ["./detail-pdf.component.css"],
})
export class DetailPdfComponent implements OnInit {
  @ViewChild("settlmentDetail", { static: true })
  modalContent: TemplateRef<any>;
  subscription: Subscription;

  settlementData = {
    type: null,
    entityId: null,
    setNo: "",
    txnDate: "",
    fromDate: null,
    toDate: null,
    tripIds: [],
    trpData: [],
    miles: {
      tripsTotal: 0,
      driverTotal: 0,
      tripsLoaded: 0,
      driverLoaded: 0,
      tripsEmpty: 0,
      driverEmpty: 0,
      tripsTeam: 0,
      driverHours: 0,
      teamHours: 0,
      totalHours: 0,
      drivers: [],
      driverLoadedTeam: 0,
      driverEmptyTeam: 0,
    },
    addition: [],
    deduction: [],
    additionTotal: 0,
    deductionTotal: 0,
    taxObj: {
      gstPrcnt: 0,
      pstPrcnt: 0,
      hstPrcnt: 0,
      gstAmount: 0,
      pstAmount: 0,
      hstAmount: 0,
      carrLocalTax: 0,
      carrLocalAmount: 0,
      carrFedTax: 0,
      carrFedAmount: 0,
    },
    paymentTotal: 0,
    taxes: 0,
    subTotal: 0,
    finalTotal: 0,
    fuelAdd: 0,
    fuelDed: 0,
    status: "unpaid",
    paymentLinked: false,
    pendingPayment: 0,
    currency: "CAD",
    paymentInfo: {
      lMiles: 0,
      lMileTeam: 0,
      eMileTeam: 0,
      rate: 0,
      eMiles: 0,
      pRate: 0,
      dRate: 0,
      pType: "",
    },
    fuelIds: [],
    fuelData: [],
  };

  constructor(
    private listService: ListService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // settlmentDetailSection
    this.subscription = this.listService.settlementDetails.subscribe(
      (res: any) => {
        console.log("res--=", res);
        if (res.showModal && res.length != 0) {
          this.settlementData = res.settlementData;
          console.log("this.settlementData", this.settlementData);

          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "settlmentDetailSection-prog__main",
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
  }

  async generatePDF() {
    var data = document.getElementById("settlmentDetailSection");
    html2pdf(data, {
      margin: 0,
      filename: `settlements.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    });
  }
}

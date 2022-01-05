import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService, ApiService } from 'src/app/services';
import * as html2pdf from "html2pdf.js";
@Component({
  selector: 'app-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.css']
})
export class SalesOrderDetailComponent implements OnInit {
  @ViewChild("previewSaleOrder", { static: true })
  previewSaleOrder: TemplateRef<any>;

  assetUrl = this.apiService.AssetUrl;
  carrierID = '';
  saleID: any;

  txnDate: string;
  customerName: string;
  workEmail: string;
  workPhone: string;
  address: string;
  finalTotal: any;
  currency: string;
  shipDate: string;
  sRef: string;
  salePerson: string;
  status: string;
  remarks: string;
  sOrderDetails: any;
  sOrNo: string;
  taxes: any;
  chargeName: string;
  chargeType: string;
  chargeAmount: string;
  docs = [];

  customersObjects: any = {};
  emailDisabled = false;

  isPDF: boolean = false;
  salePrev: any;

  constructor(public accountService: AccountService, private modalService: NgbModal, public apiService: ApiService, private toaster: ToastrService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.fetchSaleOrder();
    }
  }


  fetchSaleOrder() {
    this.accountService.getData(`sales-orders/detail/${this.saleID}`).subscribe(res => {
      let result = res[0];
      this.carrierID = result.pk;
      this.txnDate = result.txnDate;
      this.customerName = result.cusInfo.cName;
      this.workEmail = result.cusInfo.workEmail;
      this.workPhone = result.cusInfo.workPhone;
      this.address = result.cusInfo.address;
      this.finalTotal = result.total.finalTotal;
      this.currency = result.currency;
      this.shipDate = result.shipDate;
      this.sRef = result.sRef;
      this.salePerson = result.salePerson;
      this.remarks = result.remarks;
      this.sOrderDetails = result.sOrderDetails;
      this.status = result.status;
      this.sOrNo = result.sOrNo;

      this.isPDF = true;

      if (result.docs.length > 0) {
        result.docs.forEach((x: any) => {
          let obj: any = {};
          if (
            x.storedName.split(".")[1] === "jpg" ||
            x.storedName.split(".")[1] === "png" ||
            x.storedName.split(".")[1] === "jpeg"
          ) {
            obj = {
              imgPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
              docPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
              displayName: x.displayName,
              name: x.storedName,
              ext: x.storedName.split(".")[1],
            };
          } else {
            obj = {
              imgPath: "assets/img/icon-pdf.png",
              docPath: `${this.assetUrl}/${this.carrierID}/${x.storedName}`,
              displayName: x.displayName,
              name: x.storedName,
              ext: x.storedName.split(".")[1],
            };
          }
          this.docs.push(obj);
        });
      }
    });
  }


  async sendConfirmationEmail() {
    this.emailDisabled = true;
    let result: any = await this.accountService
      .getData(`sales-orders/send/confirmation-email/${this.saleID}`)
      .toPromise();
    this.emailDisabled = false;
    if (result) {
      this.toaster.success("Email sent successfully");
    } else {
      this.toaster.error("Something went wrong.");
    }
  }

  generatePDF() {

    var data = document.getElementById("print_sale");
    html2pdf(data, {
      margin: 0.15,
      filename: "sale-order.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });

    this.salePrev.close();

  }

  openModal() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "preview-sale-order",
    };
    this.salePrev = this.modalService.open(this.previewSaleOrder, ngbModalOptions)
  }

  deleteDocument(name: string, index: number) {
    this.accountService
      .deleteData(`sales-orders/uploadDelete/${this.saleID}/${name}`)
      .subscribe((result: any) => {
        this.docs.splice(index, 1);
        this.toaster.success("Attachment deleted successfully.");
      });
  }

}
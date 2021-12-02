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

  saleID: any;

  txnDate: string;
  customerID: string;
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
  accFees: any;
  accDed: any;

  customersObjects: any = {};
  emailDisabled = false;

  isPDF: boolean = false;
  salePrev: any;

  constructor(public accountService: AccountService, private modalService: NgbModal, public apiService: ApiService, private toaster: ToastrService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.saleID = this.route.snapshot.params[`saleID`];
    if (this.saleID) {
      this.fetchCustomersByIDs()
      this.fetchSaleOrder();
    }
  }


  fetchSaleOrder() {
    this.accountService.getData(`sales-orders/detail/${this.saleID}`).subscribe(res => {
      let result = res[0];

      this.txnDate = result.txnDate;
      this.customerID = result.cusInfo.customerID;
      this.finalTotal = result.total.finalTotal;
      this.currency = result.currency;
      this.shipDate = result.shipDate;
      this.sRef = result.sRef;
      this.salePerson = result.salePerson;
      this.remarks = result.remarks;
      this.sOrderDetails = result.sOrderDetails;
      this.status = result.status;
      this.sOrNo = result.sOrNo;
      this.taxes = result.charges.taxes;
      this.accFees = result.charges.accFee;
      this.accDed = result.charges.accDed;
      this.isPDF = true;
    });
  }

  /*
* Get all customers's IDs of names from api
*/
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
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

    // this.salePrev.close();

  }

  openModal() {
    // let ngbModalOptions: NgbModalOptions = {
    //   keyboard: false,
    //   backdrop: "static",
    //   windowClass: "preview-sale-order",
    // };
    // this.salePrev = this.modalService.open(this.previewSaleOrder, ngbModalOptions)
    this.generatePDF();
  }

}

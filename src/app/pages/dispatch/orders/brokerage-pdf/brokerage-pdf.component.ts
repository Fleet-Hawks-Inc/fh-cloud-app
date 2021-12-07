import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { ApiService, ListService } from "src/app/services";
import * as html2pdf from "html2pdf.js";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Auth } from "aws-amplify";

@Component({
  selector: "app-brokerage-pdf",
  templateUrl: "./brokerage-pdf.component.html",
  styleUrls: ["./brokerage-pdf.component.css"],
})
export class BrokeragePdfComponent implements OnInit {
  @ViewChild("ordBrokeragePrev", { static: true })
  modalContent: TemplateRef<any>;

  @ViewChild("emailBrokerageModal", { static: true })
  emailBrokerageModal: TemplateRef<any>;

  constructor(
    private listService: ListService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}
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
    orderNumber: "",
  };
  carrierData = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };
  companyLogo = "";
  brokEmail = {
    subject: "",
    emails: [],
    sendCopy: false,
    carrierEmail: "",
  };
  emailCopyRef: any;
  brokEmails = [];
  orderID: "";
  type: "";
  isEmail = false;

  ngOnInit() {
    this.subscription = this.listService.brokeragePdfList.subscribe(
      async (res: any) => {
        if (res.showModal && res.length != 0) {
          res.showModal = false;
          this.brokerage = res.brokerage;
          this.orderData = res.orderData;
          this.carrierData = res.carrierData;
          this.companyLogo = res.companyLogo;
          this.type = res.type ? res.type : "list";
          this.brokEmail.carrierEmail = res.carrierEmail
            ? res.carrierEmail
            : this.getCurrentUser();
          this.orderID = res.orderID;
          this.brokEmail.subject = `Brokerage Order#: ${this.orderData.orderNumber}`;
          let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: false,
            windowClass: "ordBrokeragePrev-prog__main",
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

  getCurrentUser = async () => {
    let currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.brokEmail.carrierEmail = currentUser.email;
  };

  async generatePDF() {
    var data = document.getElementById("print_brokerage");
    setTimeout(() => {
      html2pdf(data, {
        margin: 0,
        filename: `Carrier Confirmation (${
          this.brokerage.orderNo
        })${new Date().getTime()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          logging: true,
          dpi: 192,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    }, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async openEmailInv() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "order-send__email",
    };
    this.modalService.dismissAll();
    this.emailCopyRef = this.modalService.open(
      this.emailBrokerageModal,
      ngbModalOptions
    );
  }

  async sendBrokEmail() {
    let result = await this.apiService
      .getData(
        `orders/emailBrokerage/${this.orderID}?data=${encodeURIComponent(
          JSON.stringify(this.brokEmail)
        )}`
      )
      .toPromise();
    if (result == null) {
      this.brokEmail.emails = [];
      this.toastr.success("Brokerage email send successfully!");
    }
  }

  addEmails() {
    this.isEmail = true;
    this.brokEmail.emails = [];
    let isFlag = true;
    if (this.brokEmails.length === 0) {
      this.toastr.error("Please enter at least one email");
      isFlag = false;
      this.isEmail = false;
      return;
    }
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.brokEmails.forEach((elem) => {
      let result = re.test(String(elem.label).toLowerCase());
      if (!result) {
        this.toastr.error("Please enter valid email(s)");
        isFlag = false;
        this.isEmail = false;
        return;
      } else {
        if (!this.brokEmail.emails.includes(elem.label)) {
          this.brokEmail.emails.push(elem.label);
        }
      }
    });
    if (this.brokEmail.subject == "") {
      this.toastr.error("Please enter subject");
      isFlag = false;
      this.isEmail = false;
      return;
    }

    if (this.brokEmail.sendCopy) {
      if (!this.brokEmail.emails.includes(this.brokEmail.carrierEmail)) {
        this.brokEmail.emails.push(this.brokEmail.carrierEmail);
      }
    }

    if (isFlag) {
      this.sendBrokEmail();
      this.isEmail = false;
    }
  }
}

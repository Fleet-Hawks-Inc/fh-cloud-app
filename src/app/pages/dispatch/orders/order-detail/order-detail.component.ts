import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { AccountService, ApiService, ListService } from "../../../../services";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import * as html2pdf from "html2pdf.js";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import * as moment from "moment";
import Constants from "src/app/pages/fleet/constants";
import { Location } from "@angular/common";
import { Auth } from "aws-amplify";
declare var $: any;

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.css"],
})
export class OrderDetailComponent implements OnInit {
  environment = environment.isFeatureEnabled;

  @ViewChild("previewInvoiceModal", { static: true })
  previewInvoiceModal: TemplateRef<any>;

  @ViewChild("emailInvoiceModal", { static: true })
  emailInvoiceModal: TemplateRef<any>;

  @ViewChild("documentSelectionModal", { static: true })
  documentSelectionModal: TemplateRef<any>;

  @ViewChild("emailInvoice", { static: true })
  emailInvoice: TemplateRef<any>;

  @ViewChild("uploadBol", { static: true }) uploadBol: ElementRef;

  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  noLogsMsg = Constants.NO_RECORDS_FOUND;

  carrierEmail: string = "";
  isCopy: boolean = false;

  docs = [];
  attachments = [];
  tripDocs = [];

  localPhotos = [];
  uploadedDocs = [];

  selectedItem = "";
  consineeData = [];
  shipperData = [];
  Asseturl = this.apiService.AssetUrl;
  orderID: string;
  orderData;
  shipperReceiversInfos = [];
  // charges : any;
  totalFreightFee: any;
  totalFuelSurcharge: any;
  totalAccessotial: any;
  totalAccessDeductions: any;
  discountAmount: any;
  discountAmtUnit: string;

  totalTax = 0;
  totalAmount: number;
  calculateBy: string;
  totalMiles: number;
  firstPickupPoint: string;
  lastDropPoint: string;

  shippersObjects: any = {};
  receiversObjects: any = {};
  customersObjects: any = {};

  accessrialData: any;
  deductionsData: any;
  taxesData: any;

  getCurrency: string;

  totalPickups: number = 0;
  totalDrops: number = 0;
  templateList = ["assets/img/invoice.png", "assets/img/invoice.png"];

  orderDocs = [];
  pdfSrc: any = this.domSanitizer.bypassSecurityTrustResourceUrl("");
  pdFile = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";


  pageVariable = 1;

  carrierLogo: string;
  invoiceID: string;
  /**
   * Form props
   */
  customerID = "";
  orderNumber = "";
  orderMode = "";
  showInvBtn: boolean = false;
  customerName = "";
  customerAddress = "";
  cityAndState = "";
  customerStateName = "";
  customerCountryName = "";
  customerPhone = "";
  customerEmail = "";
  customerfax = "";
  customerPo = "";
  reference = "";
  cusConfirmation = "";
  // creation = '';
  createdDate = "";
  createdTime = "";
  additionalContactName = "";
  additionalPhone = "";
  additionalEmail = "";

  additionalDetails = {
    sealType: "",
    sealNo: "",
    loadType: {
      hazMat: false,
      oversize: false,
      reefer: false,
      tanker: false,
    },
    refeerTemp: {
      maxTemprature: "",
      maxTempratureUnit: "",
      minTemprature: "",
      minTempratureUnit: "",
    },
    trailerType: "",
    uploadedDocs: [],
  };

  charges: any = {
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
    accessorialFeeInfo: {
      accessorialFee: [],
      total: 0,
    },
    accessorialDeductionInfo: {
      accessorialDeduction: [],
      total: 0,
    },
  };
  discount: any = {
    amount: 0,
    unit: "",
  };
  milesInfo = {
    calculateBy: "",
    totalMiles: "",
  };
  taxesInfo = [];
  taxesTotal: any = 0;
  totalCharges: any = 0;
  advances = 0;
  balance = 0;
  newOrderData: any;

  assetTypes = {};
  milesArr = [];
  allPhotos = [];
  carrierID = "";
  stateCode = "";
  zeroRated = false;
  isInvoice = false;
  taxableAmount: any;
  invoiceData: any;
  vehicles = [];
  assets = [];
  newInvoiceDocs: [];
  today: any;
  txnDate: any;
  cusAddressID: string;
  isInvoiced: boolean = false;
  isModalShow: boolean = false;
  isShow: boolean = false;
  generateBtnDisabled = false;
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error = "";
  Success = "";
  invGenStatus = false;
  orderStatus = "";
  previewRef: any;
  generateRef: any;
  emailRef: any;
  emailCopyRef: any;

  emailData = {
    emails: [],
    isSingle: false
  };

  subject = "";

  hideEdit: boolean = false;
  isGenerate: boolean = true;

  tripData: {
    tripNo: "";
    tripID: "";
  };

  emailDocs = [];
  invDocs = [];
  newInvDocs = [];
  attachedDocs = [];
  isEmail = false;

  slideConfig = { slidesToShow: 1, slidesToScroll: 1 };

  brokerage = {
    carrierID: "",
    instructions: "",
    amount: "",
    brokerageAmount: "",
    currency: "",
    orderNo: "",
    miles: "",
    today: moment().format("YYYY-MM-DD"),
  };
  carrierData = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };

  showModal = false;
  showBolModal = false;

  userEmails = [];

  carrierDetails: any;
  orderInvData = {
    additionalContact: <any>null,
    carrierData: {
      address: "",
      companyName: "",
      phone: "",
      email: "",
      fax: "",
      carrierID: "",
      termsInfo: {
        logo: "",
        tagLine: "",
        terms: ''
      }
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
  companyLogoSrc = "";
  orderLogs = [];
  recallStatus = false;
  invStatus: string;
  docType: string;
  isFlag = true;
  showBtns = false;
  brokerageDisabled = false;
  singleDisabled = true;

  documentsArr = [
    {
      id: 1,
      docName: 'Invoice',
      value: 'invoice',
      checked: true,
      disabled: true
    },
    {
      id: 2,
      docName: 'Bill of Lading',
      value: 'bol',
      checked: false,
      disabled: false
    },
    {
      id: 3,
      docName: 'Proof of Delivery',
      value: 'pod',
      checked: false,
      disabled: false
    },
    {
      id: 4,
      docName: 'Other',
      value: 'other',
      checked: false,
      disabled: false
    }
  ];

  docSelRef: any;
  printBtnType: string;

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private listService: ListService,
    private location: Location
  ) {
    this.today = new Date();
    this.txnDate = new Date().toISOString().slice(0, 10);
  }

  ngOnInit() {
    this.listService.getDocsModalList.subscribe((res: any) => {
      if (res && res.docType != null && res.docType != '') {
        if (res.module === 'order') {
          this.docType = res.docType;
          this.uploadBolPods(res);
        }
      }
    })

    this.orderID = this.route.snapshot.params["orderID"];

    this.fetchOrder();
    this.fetchInvoiceData();
    this.fetchOrderLogs();
    this.getCurrentUser();
  }

  getCurrentUser = async () => {
    let currentUser = (await Auth.currentSession()).getIdToken().payload;
    this.carrierEmail = currentUser.email;
  };

  /**
   * fetch order data
   */
  async fetchOrder() {
    this.docs = [];
    this.apiService.getData(`orders/detail/${this.orderID}`).subscribe(
      async (result: any) => {
        this.newOrderData = result;
        result = result.Items[0];
        if (result.brkCarrID) {
          this.brokerage.carrierID = result.brkCarrID;
        }
        if (result.brkIns) {
          this.brokerage.instructions = result.brkIns;
        }
        if (result.brkAmount) {
          this.brokerage.brokerageAmount = result.brkAmount;
        }

        if (result.recall) {
          this.recallStatus = true;
        }
        this.brokerage.orderNo = result.orderNumber;
        this.brokerage.miles = result.milesInfo.totalMiles;
        this.brokerage.currency = result.charges.freightFee.currency;

        if (result.stateTaxID != undefined && result.stateTaxID != "") {
          this.stateCode = result.stateCode;
        }

        if (result.tripData) {
          this.tripData = result.tripData;
        }

        this.zeroRated = result.zeroRated;
        this.carrierID = result.carrierID;
        this.customerID = result.customerID;
        if (result.invoiceGenerate && result.invData.invID && result.invData.invID != '') {
          this.invoiceID = result.invData.invID;
          this.today = await this.getInvDate(this.invoiceID)
        }
        if (
          result.invoiceGenerate ||
          result.orderStatus === "created" ||
          result.orderStatus === "confirmed"
        ) {
          this.hideEdit = true;
          this.isGenerate = false;
        }
        if (result.orderStatus === 'delivered' || result.recall) {
          this.hideEdit = false;
        }
        this.orderStatus = result.orderStatus;
        this.cusAddressID = result.cusAddressID;
        this.customerAddress = result.customerAddress;
        this.customerName = result.customerName;
        this.cityAndState = result.cityAndState;
        this.customerCountryName = result.customerCountryName;
        this.customerPhone = result.customerPhone;
        this.customerEmail = result.customerEmail;
        this.showInvBtn = true;

        this.reference = result.reference;
        this.cusConfirmation = result.cusConfirmation == 'NA' ? '' : result.cusConfirmation;
        this.createdDate = result.createdDate;
        this.createdTime = result.timeCreated;
        if (
          result.additionalContact != null &&
          result.additionalContact.label != undefined
        ) {
          this.additionalContactName = result.additionalContact.label;
        } else {
          this.additionalContactName = result.additionalContact;
        }

        this.additionalPhone = result.phone;
        this.additionalEmail = result.email;
        this.isInvoiced = result.invoiceGenerate;
        this.shipperReceiversInfos = result.shippersReceiversInfo;

        for (let u = 0; u < this.shipperReceiversInfos.length; u++) {
          const element = this.shipperReceiversInfos[u];

          this.additionalDetails.sealType = result.additionalDetails.sealType
            ? result.additionalDetails.sealType.replace("_", " ")
            : "-";
          this.additionalDetails.sealNo = result.additionalDetails.sealNo;
          this.additionalDetails.loadType = result.additionalDetails.loadType;
          this.additionalDetails.refeerTemp =
            result.additionalDetails.refeerTemp;
          this.additionalDetails.trailerType = result.additionalDetails
            .trailerType
            ? result.additionalDetails.trailerType.replace("_", " ")
            : "-";
          this.additionalDetails.uploadedDocs =
            result.additionalDetails.uploadedDocs;
          this.charges = result.charges;
          this.discount = result.discount;
          this.milesInfo = result.milesInfo;
          this.taxesInfo = result.taxesInfo;
          this.orderNumber = result.orderNumber;
          this.orderMode = result.orderMode;

          this.subject = `Invoice: ${this.orderMode} - ${this.orderNumber}`;

          this.milesArr = [];
        }
        for (let i = 0; i < this.taxesInfo.length; i++) {
          if (this.taxesInfo[i].amount) {
            this.taxesTotal = this.taxesTotal + this.taxesInfo[i].amount;
          }
        }

        this.milesArr = result.shippersReceiversInfo;

        let freightFee = isNaN(this.charges.freightFee.amount)
          ? 0
          : this.charges.freightFee.amount;
        let fuelSurcharge = isNaN(this.charges.fuelSurcharge.amount)
          ? 0
          : this.charges.fuelSurcharge.amount;
        let accessorialFeeInfo = isNaN(this.charges.accessorialFeeInfo.total)
          ? 0
          : this.charges.accessorialFeeInfo.total;
        let accessorialDeductionInfo = isNaN(
          this.charges.accessorialDeductionInfo.total
        )
          ? 0
          : this.charges.accessorialDeductionInfo.total;

        let totalAmount =
          parseFloat(freightFee) +
          parseFloat(fuelSurcharge) +
          parseFloat(accessorialFeeInfo) -
          parseFloat(accessorialDeductionInfo);
        this.taxableAmount = (totalAmount * parseInt(this.taxesTotal)) / 100;
        if (!this.zeroRated) {
          this.totalCharges = totalAmount + this.taxableAmount;
        } else {
          this.totalCharges = totalAmount;
        }

        // this.advances = result.advance;
        // this.balance = this.totalCharges - this.advances;
        this.balance = this.totalCharges;

        if (result.attachments != undefined && result.attachments.length > 0) {
          this.attachments = result.attachments.map((x) => ({
            docPath: `${x}`,
            name: x,
            ext: x.split(".")[1],
          }));
        }

        if (result.tripDocs != undefined && result.tripDocs.length > 0) {
          this.tripDocs = result.tripDocs.map((x) => ({
            imgPath: `${x.urlPath}`,
            docPath: `${x.urlPath}`,
            displayName: x.displayName,
            name: x.storedName,
            ext: x.storedName.split(".")[1]
          }));
        }

        if (
          result.uploadedDocs !== undefined &&
          result.uploadedDocs.length > 0
        ) {
          await this.showDocs(result.uploadedDocs)
        }


        if (result.customerEmail && result.customerEmail != '') {
          this.emailData.emails.push({ label: result.customerEmail });
        }
        this.emailDocs = [...this.docs, ...this.attachments, ...this.tripDocs];

        this.invStatus = result.invStatus ? result.invStatus : 'NA'

      },

      (err) => { }
    );
  }

  async showDocs(documents) {
    this.docs = [];
    this.newInvDocs = [];
    this.emailDocs = [];
    documents.forEach((x: any) => {
      if (
        x.storedName.split(".")[1] === "jpg" ||
        x.storedName.split(".")[1] === "png" ||
        x.storedName.split(".")[1] === "jpeg"
      ) {
        const obj = {
          imgPath: `${x.urlPath}`,
          docPath: `${x.urlPath}`,
          displayName: x.displayName,
          name: x.storedName,
          ext: x.storedName.split(".")[1],
          type: x.type ? x.type : 'other'
        };
        this.docs.push(obj);
      } else {
        const obj = {
          imgPath: "assets/img/icon-pdf.png",
          docPath: `${x.urlPath}`,
          displayName: x.displayName,
          name: x.storedName,
          ext: x.storedName.split(".")[1],
          type: x.type ? x.type : 'other'
        };
        this.docs.push(obj);
      }
    });

    this.newInvDocs = [...this.newInvDocs, ...this.docs];
    this.emailDocs = [...this.docs, ...this.attachments, ...this.tripDocs];

  }

  async openEmailInv() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: false,
      backdrop: "static",
      windowClass: "order-send__email",
    };
    this.emailCopyRef = this.modalService.open(
      this.emailInvoiceModal,
      ngbModalOptions
    );
  }

  async sendEmailInv() {
    let newDocs = [];

    for (const item of this.emailDocs) {
      newDocs.push({
        filename: item.displayName,
        path: item.docPath,
      });
    }

    const data = {
      docs: newDocs,
      emails: this.userEmails,
      subject: this.subject,
      sendCopy: this.isCopy,
    };

    let result = await this.apiService
      .getData(
        `orders/emailInvoice/${this.orderID}?data=${encodeURIComponent(
          JSON.stringify(data)
        )}`
      )
      .toPromise();
    if (result) {
      // this.emailRef.close();
      this.emailCopyRef.close();
      this.toastr.success("Email send successfully!");
      this.isEmail = false;
      this.userEmails = [];
      if (this.emailData.emails.length > 0) {
        this.emailData.emails = [];
        this.emailData.emails.push({ label: this.customerEmail });
      }

      this.subject = `Invoice: ${this.orderMode} - ${this.orderNumber}`;
    } else {
      this.isEmail = false;
    }
  }

  showInv() {
    let ngbModalOptions: NgbModalOptions = {
      keyboard: true,
      windowClass: "preview--invoice",
    };
    this.previewRef = this.modalService.open(
      this.previewInvoiceModal,
      ngbModalOptions
    );
    this.newInvDocs = this.invDocs
  }

  addEmails() {
    this.isFlag = true;
    this.isEmail = true;

    if (this.emailData.emails.length === 0) {
      this.toastr.error("Please enter at least one email");
      this.isEmail = false;
      return;
    }

    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.emailData.emails.forEach((elem) => {
      let result = re.test(String(elem.label).toLowerCase());
      if (!result) {
        this.toastr.error("Please enter valid email(s)");
        this.isFlag = false;
        this.isEmail = false;

        return;
      } else {
        if (!this.userEmails.includes(elem.label)) {
          this.userEmails.push(elem.label);
        }
      }
    });
    if (this.subject == "") {
      this.toastr.error("Please enter subject");
      this.isEmail = false;
      return;
    }

    if (this.isFlag) {
      this.sendEmailInv();
    }
  }

  sendEmailOnly() {
    this.isEmail = true;
    this.sendEmailInv();
  }

  async generate() {
    this.isShow = true;

    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: [0.5, 0.3, 0.5, 0.3],
      pagebreak: { mode: 'avoid-all', before: "print_wrap" },
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    this.previewRef.close();
    this.docSelRef.close();
    this.invDocs = this.attachedDocs;
  }

  openDocModal() {
    let obj = {
      type: 'order',
      docLength: this.docs.length
    }
    this.listService.openDocTypeMOdal(obj)
  }

  cancel() {
    this.location.back();
  }
  async generatePDF() {
    this.isShow = true;


    // await this.saveInvoice();
    // await this.invoiceGenerated();
    // await this.fetchOrder();
    this.generateBtnDisabled = true;
    await this.saveInvoice();

  }

  downloadPdf() {
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: [0.5, 0.3, 0.5, 0.3],
      pagebreak: { mode: 'avoid-all', before: "print_wrap" },
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        allowTaint: true,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    this.previewRef.close();
  }

  openDocumentModal(type: string) {
    this.printBtnType = type;
    if (this.docs.length > 0) {
      let ngbModalOptions: NgbModalOptions = {
        keyboard: false,
        backdrop: "static",
        windowClass: "docs-selection__main",
      };
      this.docSelRef = this.modalService.open(this.documentSelectionModal, ngbModalOptions)
    }
  }

  documentSelection() {
    let types = [];
    this.documentsArr.filter(x => x.checked).map(x => {
      if (!types.includes(x.value)) {
        types.push(x.value)
      }
    })
    if (types.length > 1) {
      this.singleDisabled = false;
    } else {
      this.singleDisabled = true;
    }
    this.newInvDocs = this.attachedDocs.filter(function (doc) {
      return types.indexOf(doc.type) > -1;
    });

  }

  pageRendered(event) {
    this.pdfComponent.pdfViewer.currentScaleValue = "page-fit";
  }

  async getInvDate(orderID: string) {
    let result = await this.accountService.getData(`order-invoice/detail/invDate/${orderID}`).toPromise();
    if (result && result.length > 0 && result[0].txnDate) {
      return result[0].txnDate;
    }
  }

  async saveInvoice() {
    // this.generateBtnDisabled = true;
    this.invoiceData[`transactionLog`] = [];
    this.invoiceData[`invNo`] = this.orderNumber;
    this.invoiceData[`invType`] = "orderInvoice";
    this.invoiceData[`invStatus`] = "open";
    this.invoiceData[`amountReceived`] = 0;
    this.invoiceData[`amountPaid`] = 0;
    this.invoiceData[`fullPayment`] = false;
    this.invoiceData[`balance`] = this.totalCharges;
    this.invoiceData[`txnDate`] = this.txnDate;
    this.invoiceData[`orderID`] = this.orderID;
    this.invoiceData[`cusConfirmation`] = this.cusConfirmation;

    this.invoiceData[`zeroRated`] = this.zeroRated;
    this.invoiceData[`currency`] = this.brokerage.currency;
    this.accountService.postData(`order-invoice`, this.invoiceData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.generateBtnDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.generateBtnDisabled = false;
            },

            next: () => { },
          });
      },
      next: (res) => {
        this.isInvoiced = true;
        this.toastr.success("Invoice Added Successfully.");
        this.downloadPdf();
        this.isGenerate = false;
        $("#previewInvoiceModal").modal("hide");
      },
    });
  }

  // async invoiceGenerated() {
  //   this.invGenStatus = true;
  //   let result = await this.apiService
  //     .getData(
  //       `orders/invoiceStatus/${this.orderID}/${this.orderNumber}/${this.invGenStatus}`
  //     )
  //     .toPromise();
  //   this.isInvoice = result.Attributes.invoiceGenerate;
  // }

  previewModal() {
    $("#templateSelectionModal").modal("hide");
    setTimeout(function () {
      $("#previewInvoiceModal").modal("show");
    }, 500);
  }

  // delete uploaded images and documents
  async delete(type: string, name: string, index) {
    // let record = {
    //   eventID: this.orderID,
    //   type: type,
    //   name: name,
    //   date: this.createdDate,
    //   time: this.createdTime
    // }
    if (confirm("Are you sure you want to delete?") === true) {
      await this.apiService
        .deleteData(`orders/uploadDelete/${this.orderID}/${name}/${type}`)
        .toPromise();
      if (type == "attachment") {
        this.attachments.splice(index, 1);
      } else {
        this.docs.splice(index, 1);
        this.newInvDocs.splice(index, 1);
      }
      this.toastr.success("Document deleted successfully");
    }
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

  async uploadBolPods(res: any) {
    for (let i = 0; i < res.documents.length; i++) {
      const element = res.documents[i];
      let name = element.name.split(".");
      let ext = name[name.length - 1];

      if (ext != "jpg" && ext != "jpeg" && ext != "png" && ext != "pdf") {
        $("#bolUpload").val("");
        this.toastr.error("Only image and pdf files are allowed");
        return false;
      }
    }

    for (let i = 0; i < res.documents.length; i++) {
      this.uploadedDocs.push(res.documents[i]);
    }
    // create form data instance
    const formData = new FormData();
    // append photos if any
    for (let i = 0; i < this.uploadedDocs.length; i++) {
      formData.append("uploadedDocs", this.uploadedDocs[i]);
    }

    let result: any = await this.apiService
      .postData(`orders/uploadDocs/${this.orderID}/${this.docType}`, formData, true).toPromise()
    if (result && result.length > 0) {
      await this.showDocs(result)
    }
  }

  /*
   * Selecting files before uploading
   */
  async selectDocuments(event) {

    let files = [];
    this.uploadedDocs = [];
    files = [...event.target.files];
    let totalCount = this.docs.length + files.length;

    if (totalCount > 4) {
      this.uploadedDocs = [];
      $("#bolUpload").val("");
      this.toastr.error("Only 4 documents can be uploaded");
      return false;
    } else {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let name = element.name.split(".");
        let ext = name[name.length - 1];

        if (ext != "jpg" && ext != "jpeg" && ext != "png" && ext != "pdf") {
          $("#bolUpload").val("");
          this.toastr.error("Only image and pdf files are allowed");
          return false;
        }
      }
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocs.push(files[i]);
      }
      // create form data instance
      const formData = new FormData();

      // append photos if any
      for (let i = 0; i < this.uploadedDocs.length; i++) {
        formData.append("uploadedDocs", this.uploadedDocs[i]);
      }

      let result: any = await this.apiService
        .postData(`orders/uploadDocs/${this.orderID}`, formData, true).toPromise()
      this.invDocs = [];
      this.uploadedDocs = [];
      if (result.length > 0) {
        result.forEach((x: any) => {
          let obj: any = {};
          if (
            x.storedName.split(".")[1] === "jpg" ||
            x.storedName.split(".")[1] === "png" ||
            x.storedName.split(".")[1] === "jpeg"
          ) {
            obj = {
              imgPath: `${x.urlPath}`,
              docPath: `${x.urlPath}`,
              displayName: x.displayName,
              name: x.storedName,
              ext: x.storedName.split(".")[1],
              type: x.type ? x.type : 'other'
            };
          } else {
            obj = {
              imgPath: "assets/img/icon-pdf.png",
              docPath: `${x.urlPath}`,
              displayName: x.displayName,
              name: x.storedName,
              ext: x.storedName.split(".")[1],
              type: x.type ? x.type : 'other'
            };
          }
          this.invDocs.push(obj);
        });
      }
      this.attachedDocs = this.invDocs;
      this.newInvDocs = this.invDocs;
      this.toastr.success("BOL/POD uploaded successfully");
      this.uploadBol.nativeElement.value = "";
      await this.fetchOrder();
    }
  }

  setSrcValue() { }

  caretClickShipper(i, j) {
    if (
      $("#shipperArea-" + i + "-" + j)
        .children("i")
        .hasClass("fa-caret-right")
    ) {
      $("#shipperArea-" + i + "-" + j)
        .children("i")
        .removeClass("fa-caret-right");
      $("#shipperArea-" + i + "-" + j)
        .children("i")
        .addClass("fa-caret-down");
    } else {
      $("#shipperArea-" + i + "-" + j)
        .children("i")
        .addClass("fa-caret-right");
      $("#shipperArea-" + i + "-" + j)
        .children("i")
        .removeClass("fa-caret-down");
    }
  }

  caretClickReceiver(i, j) {
    if (
      $("#receiverArea-" + i + "-" + j)
        .children("i")
        .hasClass("fa-caret-right")
    ) {
      $("#receiverArea-" + i + "-" + j)
        .children("i")
        .removeClass("fa-caret-right");
      $("#receiverArea-" + i + "-" + j)
        .children("i")
        .addClass("fa-caret-down");
    } else {
      $("#receiverArea-" + i + "-" + j)
        .children("i")
        .addClass("fa-caret-right");
      $("#receiverArea-" + i + "-" + j)
        .children("i")
        .removeClass("fa-caret-down");
    }
  }

  fetchInvoiceData() {
    this.apiService
      .getData(`orders/invoice/${this.orderID}`)
      .subscribe((result: any) => {
        this.invoiceData = result[0];
        this.orderInvData = result[0];
        this.carrierDetails = result[0].carrierData;
        this.isInvoice = true;
        if (this.orderInvData.carrierData.termsInfo.logo && this.orderInvData.carrierData.termsInfo.logo != "") {
          this.companyLogoSrc = `${this.orderInvData.carrierData.termsInfo.logo}`;
        }
        if (this.invoiceData.assets != undefined) {
          this.assets = this.invoiceData.assets;
        }
        if (this.invoiceData.vehicles != undefined) {
          this.vehicles = this.invoiceData.vehicles;
        }
        if (
          result[0].uploadedDocs !== undefined &&
          result[0].uploadedDocs.length > 0
        ) {
          result[0].uploadedDocs.forEach((x: any) => {
            let obj: any = {};
            if (
              x.storedName.split(".")[1] === "jpg" ||
              x.storedName.split(".")[1] === "png" ||
              x.storedName.split(".")[1] === "jpeg"
            ) {
              obj = {
                imgPath: `${x.urlPath}`,
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
                type: x.type ? x.type : 'other'
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
                type: x.type ? x.type : 'other'
              };
            }
            this.invDocs.push(obj);
          });
        }
        this.attachedDocs = this.invDocs;
        this.newInvDocs = this.invDocs;
        this.showBtns = true;
      });
  }

  async downloadBrokeragePdf() {
    await this.fetchCarrierDetails();
    this.showModal = true;
    let data = {
      carrierData: this.carrierData,
      brokerage: this.brokerage,
      orderData: this.orderInvData,
      showModal: this.showModal,
      companyLogo: this.companyLogoSrc,
      carrierEmail: this.carrierEmail,
      orderID: this.orderID,
      type: "detail",
    };
    this.listService.triggerBrokeragePdf(data);
  }

  async fetchCarrierDetails() {
    this.brokerageDisabled = true;
    let result: any = await this.apiService
      .getData(`contacts/detail/${this.brokerage.carrierID}`)
      .toPromise();
    result = result.Items[0];
    this.carrierData.name = result.cName;
    this.carrierData.email = result.workEmail;
    this.carrierData.phone = result.workPhone;
    if (result.adrs[0].manual) {
      if (result.adrs[0].add1 !== "") {
        this.carrierData.address = `${result.adrs[0].add1} ${result.adrs[0].add2} ${result.adrs[0].ctyName}, ${result.adrs[0].sName}, ${result.adrs[0].cName}`;
      }
    } else {
      this.carrierData.address = result.adrs[0].userLoc;
    }

    this.brokerageDisabled = false;
  }

  async downloadBolPdf() {
    let result = await this.fetchBOLDetails();

    this.showBolModal = true;
    let data = {
      orderData: result.shipmentsData ? result.shipmentsData : [],
      showModal: this.showBolModal,
      companyLogo: this.companyLogoSrc,
      assets: result.assets ? result.assets : [],
      drivers: result.drivers ? result.drivers : [],
      vehicles: result.vehicles ? result.vehicles : [],
      finalAmount: result.finalAmount,
      carrierData: this.carrierDetails,
      orderNumber: this.orderNumber,
      date: this.today
    };

    this.listService.triggerBolPdf(data);
  }

  fetchOrderLogs() {
    this.apiService
      .getData(`auditLogs/details/${this.orderID}`)
      .subscribe((res: any) => {
        this.orderLogs = res.Items;
        if (this.orderLogs.length > 0) {
          this.orderLogs.map((k) => {
            k.dateAndTime = `${k.createdDate} ${k.createdTime}`;
            if (k.eventParams.userName !== undefined) {
              const newString = k.eventParams.userName.split("_");
              k.userFirstName = newString[0];
              k.userLastName = newString[1];
            }
            if (k.eventParams.number !== undefined) {
              k.entityNumber = k.eventParams.number;
            }
            if (k.eventParams.name !== undefined) {
              if (k.eventParams.name.includes("_")) {
                const newString = k.eventParams.name.split("_");
                k.firstName = newString[0];
                k.lastName = newString[1];
              }
            }
          });

          this.orderLogs.sort((a, b) => {
            return (
              new Date(b.dateAndTime).valueOf() -
              new Date(a.dateAndTime).valueOf()
            );
          });
        }
      });
  }

  async fetchBOLDetails() {
    let result: any = await this.apiService
      .getData(`orders/get/bol/data/${this.orderID}`)
      .toPromise();
    return result
  }

  sendEmailCopy(value) {
    if (value) {
      this.isCopy = true;
    } else {
      this.isCopy = false;
    }
  }
}

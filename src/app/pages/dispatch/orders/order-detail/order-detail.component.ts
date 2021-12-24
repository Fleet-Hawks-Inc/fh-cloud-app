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

  sampleArr = [
    {
      displayName: "pexels-tony-990113.jpg",
      storedName: "9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg",
      urlPath: "https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com/1y4EaQ9AaUPC1XmvollNF7tMh5y/9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARUNMEEHUVXGWAIEB%2F20211224%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20211224T091445Z&X-Amz-Expires=3600&X-Amz-Signature=94bc417d979b23f4f2c0c158c4c474243ac3b4671c222af5660fa8e1a98407a8&X-Amz-SignedHeaders=host",
    },
    {
      displayName: "pexels-tony-990113.jpg",
      storedName: "9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg",
      urlPath: "https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com/1y4EaQ9AaUPC1XmvollNF7tMh5y/9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARUNMEEHUVXGWAIEB%2F20211224%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20211224T091445Z&X-Amz-Expires=3600&X-Amz-Signature=94bc417d979b23f4f2c0c158c4c474243ac3b4671c222af5660fa8e1a98407a8&X-Amz-SignedHeaders=host",

    },
    {
      displayName: "pexels-tony-990113.jpg",
      storedName: "9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg",
      urlPath: "https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com/1y4EaQ9AaUPC1XmvollNF7tMh5y/9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARUNMEEHUVXGWAIEB%2F20211224%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20211224T091445Z&X-Amz-Expires=3600&X-Amz-Signature=94bc417d979b23f4f2c0c158c4c474243ac3b4671c222af5660fa8e1a98407a8&X-Amz-SignedHeaders=host",

    },
    {
      displayName: "pexels-tony-990113.jpg",
      storedName: "9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg",
      urlPath: "https://fh-cloud-service-uploads.s3.us-east-2.amazonaws.com/1y4EaQ9AaUPC1XmvollNF7tMh5y/9906a980-6498-11ec-a0c5-5dd8fe54f815.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARUNMEEHUVXGWAIEB%2F20211224%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20211224T091445Z&X-Amz-Expires=3600&X-Amz-Signature=94bc417d979b23f4f2c0c158c4c474243ac3b4671c222af5660fa8e1a98407a8&X-Amz-SignedHeaders=host",

    }
  ]

  pageVariable = 1;

  carrierLogo: string;
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

  isFlag = true;
  showBtns = false;
  brokerageDisabled = false;

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
  }

  ngOnInit() {
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
        if (
          result.invoiceGenerate ||
          result.orderStatus === "created" ||
          result.orderStatus === "confirmed"
        ) {
          this.hideEdit = true;
          this.isGenerate = false;
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
        this.cusConfirmation = result.cusConfirmation;
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
          result.uploadedDocs.forEach((x: any) => {
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
                ext: x.storedName.split(".")[1]
              };
              this.docs.push(obj);
            } else {
              const obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1]
              };
              this.docs.push(obj);
            }
          });
        }

        //this.emailDocs = [...this.docs, ...this.attachments, ...this.tripDocs];
      },

      (err) => { }
    );
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
      this.emailData.emails = [];
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
    this.previewRef.close();
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: [0.5, 0.3, 0.5, 0.3],
      pagebreak: { mode: ['avoid-all', 'css'] },
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
  }

  cancel() {
    this.location.back();
  }
  async generatePDF() {
    this.isShow = true;
    await this.saveInvoice();
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: [0.5, 0.3, 0.5, 0.3],
      pagebreak: { mode: ['avoid-all', 'css'] },
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
    // await this.saveInvoice();
    // await this.invoiceGenerated();
    // await this.fetchOrder();
    this.previewRef.close();
  }

  pageRendered(event) {
    this.pdfComponent.pdfViewer.currentScaleValue = "page-fit";
  }

  async saveInvoice() {
    this.generateBtnDisabled = true;
    this.invoiceData[`transactionLog`] = [];
    this.invoiceData[`invNo`] = this.orderNumber;
    this.invoiceData[`invType`] = "orderInvoice";
    this.invoiceData[`invStatus`] = "open";
    this.invoiceData[`amountReceived`] = 0;
    this.invoiceData[`amountPaid`] = 0;
    this.invoiceData[`fullPayment`] = false;
    this.invoiceData[`balance`] = this.totalCharges;
    this.invoiceData[`txnDate`] = new Date().toISOString().slice(0, 10);
    this.invoiceData[`orderID`] = this.orderID;
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
        this.generateBtnDisabled = false;
        this.toastr.success("Invoice Added Successfully.");
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
            };
          } else {
            obj = {
              imgPath: "assets/img/icon-pdf.png",
              docPath: `${x.urlPath}`,
              displayName: x.displayName,
              name: x.storedName,
              ext: x.storedName.split(".")[1],
            };
          }
          this.invDocs.push(obj);
        });
      }
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
              };
            } else {
              obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${x.urlPath}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
            }
            this.invDocs.push(obj);
          });
        }
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
    await this.fetchBOLDetails();
    this.showBolModal = true;
    let data = {
      carrierData: this.carrierData,
      orderData: this.orderInvData,
      showModal: this.showBolModal,
      companyLogo: this.companyLogoSrc,
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
    result = result.Items[0];
  }

  sendEmailCopy(value) {
    if (value) {
      this.isCopy = true;
    } else {
      this.isCopy = false;
    }
  }
}

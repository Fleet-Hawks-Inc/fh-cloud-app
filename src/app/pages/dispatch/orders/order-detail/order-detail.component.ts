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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import * as html2pdf from "html2pdf.js";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import autoTable from "jspdf-autotable";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.css"],
})
export class OrderDetailComponent implements OnInit {
  environment = environment.isFeatureEnabled;
  @ViewChild("generateInvoiceModal", { static: true })
  generateInvoiceModal: TemplateRef<any>;
  @ViewChild("previewInvoiceModal", { static: true })
  previewInvoiceModal: TemplateRef<any>;
  @ViewChild("emailInvoiceModal", { static: true })
  emailInvoiceModal: TemplateRef<any>;
  @ViewChild("uploadBol", { static: true }) uploadBol: ElementRef;

  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;
  docs = [];
  attachments = [];
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
  /**
   * Form props
   */
  customerID = "";
  orderNumber = "";
  orderMode = "";
  showInvBtn: boolean = false;
  customerName = "";
  customerAddress = "";
  customerCityName = "";
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

  emailData = {
    emails: [],
  };

  hideEdit: boolean = false;
  tripData: {
    tripNo: "";
    tripID: "";

  };

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

  orderInvData = {
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
  companyLogoSrc = "";

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private listService: ListService
  ) {
    this.today = new Date();
  }

  ngOnInit() {
    this.orderID = this.route.snapshot.params["orderID"];
    this.fetchOrder();
    this.fetchShippersByIDs();
    this.fetchReceiversByIDs();
    this.fetchInvoiceData();
  }

  /**
   * fetch Asset data
   */
  async fetchOrder() {
    this.docs = [];
    this.apiService.getData(`orders/${this.orderID}`).subscribe(
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
        this.brokerage.orderNo = result.orderNumber;
        this.brokerage.miles = result.milesInfo.totalMiles;
        this.brokerage.currency = result.charges.freightFee.currency;

        if (result.stateTaxID != undefined) {
          if (result.stateTaxID != "") {
            this.apiService
              .getData("stateTaxes/" + result.stateTaxID)
              .subscribe((result) => {
                this.stateCode = result.Items[0].stateCode;
              });
          }
        }

        if (result.tripData) {
          this.tripData = result.tripData;
        }

        this.zeroRated = result.zeroRated;
        this.carrierID = result.carrierID;
        this.customerID = result.customerID;
        if (
          result.orderStatus === "created" ||
          result.orderStatus === "confirmed"
        ) {
          this.hideEdit = true;
        }
        this.orderStatus = result.orderStatus;
        this.cusAddressID = result.cusAddressID;
        await this.fetchCustomersByID();
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
          // for (let k = 0; k < element.shippers.length; k++) {
          //   const element1 = element.shippers[k];
          //   element1.date = '';
          //   element1.time = '';

          //   let datetime = element1.dateAndTime.split(' ');
          //   if(datetime[0] != undefined) {
          //     element1.date = datetime[0];
          //   }
          //   if(datetime[1] != undefined) {
          //     element1.time = datetime[1];
          //   }

          // }

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

          this.milesArr = [];
          // for (let k = 0; k < element.receivers.length; k++) {
          //   const element2 = element.receivers[k];
          //   element2.date = '';
          //   element2.time = '';

          //   let datetime = element2.dateAndTime.split(' ');
          //   if(datetime[0] != undefined) {
          //     element2.date = datetime[0];
          //   }
          //   if(datetime[1] != undefined) {
          //     element2.time = datetime[1];
          //   }

          // }
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
            path: `${this.Asseturl}/${result.carrierID}/${x}`,
            name: x,
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
                imgPath: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
                docPath: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
              this.docs.push(obj);
            } else {
              const obj = {
                imgPath: "assets/img/icon-pdf.png",
                docPath: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
                displayName: x.displayName,
                name: x.storedName,
                ext: x.storedName.split(".")[1],
              };
              this.docs.push(obj);
            }
          });


          // this.docs = result.uploadedDocs.map(x => ({
          //   path: `${this.Asseturl}/${result.carrierID}/${x.storedName}`,
          //   displayName: x.displayName,
          //   name: x.storedName,
          //   ext: (x.storedName).split('.')[1]
          // }));
        }

        // if (ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
        //   obj = {
        //     imgPath: `${this.Asseturl}/${result.carrierID}/${element}`,
        //     docPath: `${this.Asseturl}/${result.carrierID}/${element}`
        //   }
        // } else {
        //   obj = {
        //     imgPath: 'assets/img/icon-pdf.png',
        //     docPath: `${this.Asseturl}/${result.carrierID}/${element}`
        //   }
        // }
        // if (
        //   result.uploadedDocs != undefined &&
        //   result.uploadedDocs.length > 0
        // ) {
        //   // this.docs = result.uploadedDocs.map(
        //   //   (x) => `${this.Asseturl}/${result.carrierID}/${x}`
        //   // );
        //   result.uploadedDocs.map((x) => {
        //     let name = x.split('.');
        //     let ext = name[name.length-1];
        //     let obj = {
        //       imgPath: '',
        //       docPath:''
        //     }
        //     if(ext == 'jpg' || ext == 'jpeg' || ext == 'png') {
        //       obj = {
        //         imgPath: `${this.Asseturl}/${result.carrierID}/${x}`,
        //         docPath:`${this.Asseturl}/${result.carrierID}/${x}`
        //       }
        //     } else {
        //       obj = {
        //         imgPath: 'assets/img/icon-pdf.png',
        //         docPath:`${this.Asseturl}/${result.carrierID}/${x}`
        //       }
        //     }
        //     this.docs.push(obj);
        //   });
        //   this.allPhotos = result.uploadedDocs;
        // }
        // this.orderData = result['Items'];

        // this.shipperReceiversInfo = this.orderData[0].shippersReceiversInfo;

        // this.shipperReceiversInfo.forEach(element => {
        //   element.shippers.forEach(item => {
        //     this.totalPickups++;
        //   });
        //   element.receivers.forEach(item1 => {
        //     this.totalDrops++;
        //   });
        // });

        // let originLength = this.orderData[0].shippersReceiversInfo[0].shippers.length - 1;
        // this.firstPickupPoint = this.orderData[0].shippersReceiversInfo[0].shippers[originLength].pickupLocation;

        // let lastParentLength = this.orderData[0].shippersReceiversInfo.length - 1;
        // this.lastDropPoint = this.orderData[0].shippersReceiversInfo[lastParentLength].receivers[this.orderData[0].shippersReceiversInfo[lastParentLength].receivers.length - 1].dropOffLocation;

        // this.totalMiles = this.orderData[0].milesInfo.totalMiles;
        // this.calculateBy = this.orderData[0].milesInfo.calculateBy;

        // this.charges = this.orderData[0].charges;
        // this.accessrialData = this.charges.accessorialFeeInfo.accessorialFee;
        // this.deductionsData = this.charges.accessorialDeductionInfo.accessorialDeduction;
        // this.totalFreightFee = this.orderData[0].charges.freightFee.amount;

        // this.getCurrency = this.orderData[0].charges.freightFee.currency;

        // this.totalFuelSurcharge = this.orderData[0].charges.fuelSurcharge.amount;
        // this.totalAccessotial = this.orderData[0].charges.accessorialFeeInfo.total;
        // this.totalAccessDeductions = this.orderData[0].charges.accessorialDeductionInfo.total
        // this.discountAmount = this.orderData[0].discount.amount;
        // this.discountAmtUnit = this.orderData[0].discount.unit;

        // this.orderData[0].taxesInfo.forEach(item => {
        //   this.totalTax += parseFloat(item.amount);
        // });
        // this.taxesData = this.orderData[0].taxesInfo;
        // this.totalAmount = this.orderData[0].totalAmount;

        // if(this.orderData[0].uploadedDocs != undefined && this.orderData[0].uploadedDocs.length > 0){
        //   this.orderDocs = this.orderData[0].uploadedDocs.map(x => ({path: `${this.Asseturl}/${this.orderData[0].carrierID}/${x}`, name: x}));
        // }
      },

      (err) => { }

    );
  }

  /*
   * Get all shippers's IDs of names from api
   */
  fetchShippersByIDs() {
    this.apiService
      .getData("contacts/get/list/consignor")
      .subscribe((result: any) => {
        this.shippersObjects = result;
      });
  }

  /*
   * Get all receivers's IDs of names from api
   */
  fetchReceiversByIDs() {
    this.apiService
      .getData("contacts/get/list/consignee")
      .subscribe((result: any) => {
        this.receiversObjects = result;
      });
  }

  /*
   * Get all customers's IDs of names from api
   */
  async fetchCustomersByID() {
    this.apiService
      .getData(`contacts/detail/${this.customerID}`)
      .subscribe((result: any) => {
        if (result.Items.length > 0) {
          result = result.Items[0];
          this.customerName = `${result.cName}`;
          let newCusAddress = result.adrs.filter((elem: any) => {
            if (elem.addressID === this.cusAddressID) {
              this.showInvBtn = true;
              return elem;
            }
          });
          newCusAddress = newCusAddress[0];
          if (result.adrs.length > 0) {
            if (newCusAddress.manual) {
              this.customerAddress = newCusAddress.add1;
            } else {
              this.customerAddress = newCusAddress.userLoc;
            }
            this.customerCityName = newCusAddress.ctyName;
            this.customerStateName = newCusAddress.sName;
            this.customerCountryName = newCusAddress.cName;
            this.customerPhone = result.workPhone;
            this.customerEmail = result.workEmail;
          }
        }
      });
  }

  async emailInv() {
    // let ngbModalOptions: NgbModalOptions = {
    //   keyboard: true,
    //   windowClass: "email--invoice",
    // };
    // this.emailRef = this.modalService.open(
    //   this.emailInvoiceModal,
    //   ngbModalOptions
    // );
    // this.emailData.emails.push({ label: this.customerEmail });
    let result = await this.apiService.getData(`orders/emailInvoice/${this.orderID}`).toPromise();

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

  sendInvEmail() {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.emailData.emails.forEach((elem) => {
      let result = re.test(String(elem.label).toLowerCase());
      if (!result) this.toastr.error("Please enter valid email(s)");
      return;
    });
  }

  async generate() {
    this.isShow = true;
    this.previewRef.close();
    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0.15,
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

    $("#previewInvoiceModal").modal("hide");
  }

  async generatePDF() {
    this.isShow = true;

    var data = document.getElementById("print_wrap");
    html2pdf(data, {
      margin: 0.15,
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
    await this.saveInvoice();
    await this.invoiceGenerated();
    await this.fetchOrder();
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
    this.invoiceData[`balance`] = this.invoiceData.finalAmount;
    this.invoiceData[`txnDate`] = new Date().toISOString().slice(0, 10);
    this.invoiceData[`orderID`] = this.orderID;
    this.invoiceData[`zeroRated`] = this.zeroRated;

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
        this.generateBtnDisabled = false;
        this.toastr.success("Invoice Added Successfully.");
        $("#previewInvoiceModal").modal("hide");
      },
    });
  }

  async invoiceGenerated() {
    this.invGenStatus = true;
    let result = await this.apiService
      .getData(
        `orders/invoiceStatus/${this.orderID}/${this.orderNumber}/${this.invGenStatus}`
      )
      .toPromise();
    this.isInvoice = result.Attributes.invoiceGenerate;
  }

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
  selectDocuments(event) {
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

      this.apiService
        .postData(`orders/uploadDocs/${this.orderID}`, formData, true)
        .subscribe((result: any) => {
          this.docs = [];
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
                  imgPath: `${this.Asseturl}/${this.carrierID}/${x.storedName}`,
                  docPath: `${this.Asseturl}/${this.carrierID}/${x.storedName}`,
                  displayName: x.displayName,
                  name: x.storedName,
                  ext: x.storedName.split(".")[1],
                };
              } else {
                obj = {
                  imgPath: "assets/img/icon-pdf.png",
                  docPath: `${this.Asseturl}/${this.carrierID}/${x.storedName}`,
                  displayName: x.displayName,
                  name: x.storedName,
                  ext: x.storedName.split(".")[1],
                };
              }
              this.docs.push(obj);
            });
          }
          this.toastr.success("BOL/POD uploaded successfully");
          this.uploadBol.nativeElement.value = "";
          this.fetchOrder();
        });
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

        this.carrierLogo = `${this.Asseturl}/${this.carrierID}/${this.invoiceData.carrierData.logo}`;


        this.orderInvData = result[0];
        this.isInvoice = true;
        if (this.orderInvData.carrierData.logo != "") {
          this.companyLogoSrc = `${this.Asseturl}/${this.orderInvData.carrierData.carrierID}/${this.orderInvData.carrierData.logo}`;
        }
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
    };
    this.listService.triggerBrokeragePdf(data);
  }

  async fetchCarrierDetails() {
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
  }

}


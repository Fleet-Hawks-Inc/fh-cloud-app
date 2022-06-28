import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService, ListService } from "src/app/services";
import { Subscription } from "rxjs";

@Component({
  selector: "app-driver-payments-detail",
  templateUrl: "./driver-payments-detail.component.html",
  styleUrls: ["./driver-payments-detail.component.css"],
})
export class DriverPaymentsDetailComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;

  paymentID;
  paymentData = {
    currency: "CAD",
    paymentTo: null,
    entityName: "",
    entityId: null,
    paymentNo: "",
    txnDate: "",
    fromDate: null,
    toDate: null,
    settlementIds: [],
    advancePayIds: [],
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    settledAmount: 0,
    vacPayPer: 0,
    vacPayAmount: 0,
    totalAmount: <any>0,
    taxdata: {
      payPeriod: null,
      stateCode: null,
      federalCode: "claim_code_1",
      provincialCode: null,
      cpp: 0,
      ei: 0,
      federalTax: 0,
      provincialTax: 0,
      emplCPP: 0,
      emplEI: 0,
    },
    taxes: <any>0,
    advance: <any>0,
    finalAmount: <any>0,
    accountID: null,
    settlData: [],
    advData: [],
    transactionLog: [],
    paymentEnity: "",
    isFeatEnabled: false,
    gstHstPer: <any>0,
    gstHstAmt: <any>0,
    isVendorPayment: false,
    vendorId: '',
    cheqdata: {
      comp: '',
      addr: ''
    }
  };
  accounts = [];
  accountsObjects = {};
  accountsIntObjects = {};
  showModal = false;
  downloadDisabled = true;
  downloadDisabledpdf = true;
  subscription: Subscription;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    this.subscription = this.listService.paymentDetail.subscribe(async (res: any) => {
      if(res == 'driver-payments') {
        this.fetchPay();
      }
    })
    this.paymentID = this.route.snapshot.params["paymentID"];
    // this.fetchDrivers();
    // this.fetchContactsList();
    // this.fetchSettlement();
    // await this.fetchAccountsByIDs();
    // await this.fetchAccountsByInternalIDs();
    await this.fetchPaymentDetail();
  }

  async fetchPaymentDetail() {
    let result: any = await this.accountService
      .getData(`driver-payments/detail/${this.paymentID}`)
      .toPromise();

    this.downloadDisabledpdf = false;
    this.downloadDisabled = false;
    this.paymentData = result[0];
    this.paymentData.isVendorPayment = result[0].data.isVendorPymt || false;
    this.paymentData.gstHstPer = result[0].data.gstHstPer || 0;
    this.paymentData.vendorId = result[0].data.vendorId || undefined;
    this.paymentData.gstHstAmt = (this.paymentData.gstHstPer / 100) * this.paymentData.settledAmount || 0;
    if (!this.paymentData.isFeatEnabled) {
      this.fetchAccountsByIDs();
      this.fetchAccountsByInternalIDs();
    }
    if (this.paymentData.transactionLog.length === 0) {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
    if (this.paymentData.payMode) {
      this.paymentData.payMode = this.paymentData.payMode.replace("_", " ");
    } else {
      this.paymentData.payMode = "";
    }
    this.paymentData.paymentEnity = this.paymentData.paymentTo.replace(
      "_",
      " "
    );
  }

  async fetchAccountsByIDs() {
    this.accountsObjects = await this.accountService
      .getData("chartAc/get/list/all")
      .toPromise();
  }

  async fetchAccountsByInternalIDs() {
    this.accountsIntObjects = await this.accountService
      .getData("chartAc/get/internalID/list/all")
      .toPromise();
  }

  downloadPaymentPdf() {
    this.showModal = true;
    let obj = {
      showModal: this.showModal,
      data: this.paymentData,
    };
    this.listService.triggerDownloadPaymentPdf(obj);
    this.downloadDisabledpdf = true;

    setTimeout(() => {
      this.downloadDisabledpdf = false;
    }, 15000);
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.finalAmount,
      type: this.paymentData.paymentTo,
      chequeNo: this.paymentData.payModeNo,
      currency: "CAD",
      formType: this.paymentID ? "edit" : "add",
      showModal: this.showModal,
      fromDate: this.paymentData.fromDate,
      toDate: this.paymentData.toDate,
      vacPayPer: this.paymentData.vacPayPer,
      vacPayAmount: this.paymentData.vacPayAmount,
      totalAmount: this.paymentData.totalAmount,
      settledAmount: this.paymentData.settledAmount,
      taxdata: this.paymentData.taxdata,
      finalAmount: this.paymentData.finalAmount,
      advance: this.paymentData.advance,
      txnDate: this.paymentData.txnDate,
      page: "detail",
      isVendorPayment: this.paymentData.isVendorPayment,
      vendorId: this.paymentData.vendorId,
      gstHstPer: this.paymentData.gstHstPer,
      gstHstAmt: this.paymentData.gstHstAmt,
      settlementIds: this.paymentData.settlementIds,
      recordID: this.paymentID,
      cheqData: this.paymentData.cheqdata,
      module: 'driver-payments',
    };
    this.downloadDisabled = true;
    this.listService.openPaymentChequeModal(obj);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async fetchPay() {
    let result: any = await this.accountService
      .getData(`driver-payments/detail/${this.paymentID}`)
      .toPromise();
    this.paymentData = result[0];
    this.paymentData.isVendorPayment = result[0].data.isVendorPymt || false;
    this.paymentData.gstHstPer = result[0].data.gstHstPer || 0;
    this.paymentData.vendorId = result[0].data.vendorId || undefined;
    this.paymentData.gstHstAmt = (this.paymentData.gstHstPer / 100) * this.paymentData.settledAmount || 0;
    
    if (this.paymentData.payMode) {
      this.paymentData.payMode = this.paymentData.payMode.replace("_", " ");
    } else {
      this.paymentData.payMode = "";
    }
    this.paymentData.paymentEnity = this.paymentData.paymentTo.replace(
      "_",
      " "
    );
  }
}

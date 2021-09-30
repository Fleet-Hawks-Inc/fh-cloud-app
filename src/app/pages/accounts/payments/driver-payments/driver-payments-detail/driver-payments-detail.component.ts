import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';

@Component({
  selector: 'app-driver-payments-detail',
  templateUrl: './driver-payments-detail.component.html',
  styleUrls: ['./driver-payments-detail.component.css']
})
export class DriverPaymentsDetailComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  drivers = [];
  contacts = [];
  settlements = [];
  paymentID;
  paymentData = {
    paymentTo: null,
    entityId: null,
    paymentNo: '',
    txnDate: '',
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
      federalCode: 'claim_code_1',
      provincialCode: null,
      cpp: 0,
      ei: 0,
      federalTax: 0,
      provincialTax: 0,
      emplCPP: 0,
      emplEI: 0
    },
    taxes: <any>0,
    advance: <any>0,
    finalAmount: <any>0,
    accountID: null,
    settlData: [],
    advData: [],
    transactionLog: [],
    paymentEnity: ''
  };
  accounts = [];
  accountsObjects = {};
  accountsIntObjects = {};
  showModal = false;
  downloadDisabled = true;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    this.fetchDrivers();
    this.fetchContactsList();
    this.fetchSettlement();
    await this.fetchAccountsByIDs();
    await this.fetchAccountsByInternalIDs();
    await this.fetchPaymentDetail();
  }

  fetchDrivers() {
    this.apiService.getData(`drivers/get/list`).subscribe((result: any) => {
      this.drivers = result;
    });
  }

  fetchContactsList() {
    this.apiService.getData(`contacts/get/list`).subscribe((result: any) => {
        this.contacts = result;
    });
  }

  async fetchPaymentDetail() {
    let result:any = await this.accountService.getData(`driver-payments/detail/${this.paymentID}`).toPromise();
    this.downloadDisabled = false;
    this.paymentData = result[0];
    if(this.paymentData.payMode) {
      this.paymentData.payMode = this.paymentData.payMode.replace("_"," ");
    } else {
      this.paymentData.payMode = '';
    }
    this.paymentData.paymentEnity = this.paymentData.paymentTo.replace("_", " ");
  }

  fetchSettlement() {
    this.accountService.getData(`settlement/get/list`).subscribe((result: any) => {
      this.settlements = result;
    });
  }

  async fetchAccountsByIDs() {
    this.accountsObjects = await this.accountService.getData('chartAc/get/list/all').toPromise();
  }

  async fetchAccountsByInternalIDs() {
    this.accountsIntObjects = await this.accountService.getData('chartAc/get/internalID/list/all').toPromise();
  }

  downloadPaymentPdf() {
    this.showModal = true;
    let obj = {
      showModal: this.showModal,
      data: this.paymentData,
    }
    this.listService.triggerDownloadPaymentPdf(obj);
    this.downloadDisabled = true;

    setTimeout(() => {
      this.downloadDisabled = false;
    }, 15000)
  }

  showCheque() {
    this.showModal = true;
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.finalAmount,
      type: this.paymentData.paymentTo,
      chequeNo: this.paymentData.payModeNo,
      currency: 'CAD',
      formType: (this.paymentID) ? 'edit' : 'add',
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
      page: 'detail'
    }
    this.listService.openPaymentChequeModal(obj);
  }
}

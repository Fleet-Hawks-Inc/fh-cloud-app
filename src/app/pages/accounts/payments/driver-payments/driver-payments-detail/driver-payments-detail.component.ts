import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, ApiService, ListService } from 'src/app/services';

@Component({
  selector: 'app-driver-payments-detail',
  templateUrl: './driver-payments-detail.component.html',
  styleUrls: ['./driver-payments-detail.component.css']
})
export class DriverPaymentsDetailComponent implements OnInit {
  drivers = [];
  contacts = [];
  settlements = [];
  paymentID;
  paymentData = {
    paymentTo: null,
    entityId: null,
    paymentNo: '',
    txnDate: null,
    fromDate: null,
    toDate: null,
    settlementIds: [],
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    referenceNo: "",
    totalAmount:<any> 0,
    taxes:<any> 0,
    advance:<any> 0,
    finalAmount:<any> 0,
    pendingAmount:<any> 0,
    accountID: null,
    settlData: [],
    transactionLog: []
  };
  accounts = [];
  accountsObjects = {};
  accountsIntObjects = {};

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    this.fetchDrivers();
    this.fetchContactsList();
    this.fetchSettlement();
    this.fetchPaymentDetail();
    this.fetchAccountsByIDs();
    this.fetchAccountsByInternalIDs();
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

  fetchPaymentDetail() {
    this.accountService.getData(`driver-payments/detail/${this.paymentID}`).subscribe((result: any) => {
      this.paymentData = result[0];
      if(this.paymentData.payMode) {
        this.paymentData.payMode = this.paymentData.payMode.replace("_"," ");
      } else {
        this.paymentData.payMode = '';
      }
      this.paymentData.paymentTo = this.paymentData.paymentTo.replace("_", " ");
    });
  }

  fetchSettlement() {
    this.accountService.getData(`settlement/get/list`).subscribe((result: any) => {
      this.settlements = result;
    });
  }

  fetchAccountsByIDs() {
    this.accountService.getData('chartAc/get/list/all').subscribe((result: any) => {
      this.accountsObjects = result;
    });
  }
  fetchAccountsByInternalIDs() {
    this.accountService.getData('chartAc/get/internalID/list/all').subscribe((result: any) => {
      this.accountsIntObjects = result;
    });
  }
}

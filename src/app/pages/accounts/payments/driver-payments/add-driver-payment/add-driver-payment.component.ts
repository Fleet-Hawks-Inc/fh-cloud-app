import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';
import { CountryStateCity } from 'src/app/shared/utilities/countryStateCities';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-add-driver-payment',
  templateUrl: './add-driver-payment.component.html',
  styleUrls: ['./add-driver-payment.component.css']
})
export class AddDriverPaymentComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  dataMessageAdv: string = Constants.NO_RECORDS_FOUND;
  paymentData = {
    paymentTo: null,
    entityId: null,
    paymentNo: '',
    txnDate: moment().format('YYYY-MM-DD'),
    fromDate: null,
    toDate: null,
    settlementIds: [],
    advancePayIds: [],
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    totalAmount:<any> 0,
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
    taxes:<any> 0,
    advance:<any> 0,
    finalAmount:<any> 0,
    accountID: null,
    settlData: [],
    advData: [],
    transactionLog: [],
  };
  drivers = [];
  carriers = [];
  ownerOperators = [];
  payModeLabel = '';
  accounts;
  settlements = [];
  trips = [];
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = true;
  paymentID;
  searchDisabled = false;
  taxErr = '';
  advErr = '';
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  advancePayments = [];
  accList = [];
  payPeriods = [];
  states= [];
  claimCodes = [];
  provincalClaimCodes = [];

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private location: Location,
  ) {
    this.listService.paymentSaveList.subscribe((res: any) => {
      if(res === 'driver' || res === 'carrier' || res === 'owner_operator') {
        this.addRecord();
      }
    })
  }

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    if(this.paymentID) {
      this.fetchPaymentDetail();
    } else {
      this.dataMessage = Constants.NO_RECORDS_FOUND;
    }
    this.fetchDrivers();
    this.fetchCarriers();
    this.fetchtrips();
    this.fetchOwnerOperators();
    this.fetchAccounts();
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    this.fetchPayPeriods();
    this.getStates();
    this.fetchClaimCodes();
  }

  fetchDrivers() {
    this.apiService.getData(`drivers/get/list`).subscribe((result: any) => {
      this.drivers = result;
    });
  }

  fetchAccounts() {
    this.accountService.getData(`chartAc/get/all/list`).subscribe((result: any) => {
      this.accList = result;
    });
  }

  fetchCarriers() {
    this.apiService
      .getData(`contacts/get/list/carrier`)
      .subscribe((result: any) => {
        this.carriers = result;
      });
  }

  fetchOwnerOperators() {
    this.apiService
      .getData(`contacts/get/list/ownerOperator`)
      .subscribe((result: any) => {
        this.ownerOperators = result;
      });
  }

  changePaymentMode(type) {
    let label = "";
    if (type == "cash") {
      label = "Cash";
      this.paymentData.payModeNo = null;
    } else if (type == "cheque") {
      label = "Cheque";
      this.paymentData.payModeNo = Date.now().toString();
    } else if (type == "eft") {
      label = "EFT";
      this.paymentData.payModeNo = null;
    } else if (type == "credit_card") {
      label = "Credit Card";
      this.paymentData.payModeNo = null;
    } else if (type == "debit_card") {
      label = "Debit Card";
      this.paymentData.payModeNo = null;
    } else if (type == "demand_draft") {
      label = "Demand Draft";
      this.paymentData.payModeNo = null;
    }
    this.payModeLabel = label;
    this.paymentData.payModeDate = null;
  }

  resetEntityVal() {
    this.paymentData.entityId = null;
  }

  fetchSettlements() {
    this.settlements = [];
    this.advancePayments = [];
    if(!this.paymentID && this.paymentData.entityId != null) {
      if(this.paymentData.fromDate !== null && this.paymentData.toDate == null) {
        this.toaster.error('Please select to date');
        return false;
      }
      this.dataMessage = Constants.FETCHING_DATA;
      this.searchDisabled = true;
      this.accountService.getData(`settlement/entity/${this.paymentData.entityId}?from=${this.paymentData.fromDate}&to=${this.paymentData.toDate}`).subscribe((result: any) => {
        if(result.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.searchDisabled = false;
        this.settlements = result;
        this.settlements.map((v) => {
          v.selected = false;
          v.fullPayment = false;
          v.paidAmount = 0;
          v.newtype = v.type.replace("_"," ");
          v.paidStatus = false;
          v.prevPaidAmount = Number(v.finalTotal) - Number(v.pendingPayment);
          v.prevPaidAmount = v.prevPaidAmount.toFixed(2);
          v.status = v.status.replace("_"," ");
          v.errText = '';
        })
      });

      this.fetchAdvancePayments();
    } else {
      return false;
    }
  }

  fetchtrips() {
    this.apiService
      .getData(`trips/get/list`)
      .subscribe((result: any) => {
        this.trips = result;
      });
  }

  selectedSettlements() {
    this.paymentData.settlementIds = [];
    this.paymentData.settlData = [];

    for (const element of this.settlements) {
      if(element.selected) {
        if(!this.paymentData.settlementIds.includes(element.sttlID)) {
          let obj = {
            settlementId: element.sttlID,
            status: element.status,
            paidAmount: (element.status === 'unpaid') ? element.paidAmount : Number(element.finalTotal) - Number(element.pendingPayment),
            totalAmount: (element.status === 'unpaid') ? element.finalTotal : element.pendingPayment,
            pendingAmount: element.pendingPayment
          }
          this.paymentData.settlementIds.push(element.sttlID);
          this.paymentData.settlData.push(obj);
        }
      }
    }

    this.paymentCalculation();
  }

  paymentCalculation() {
    this.paymentData.totalAmount = 0;
    this.paymentData.finalAmount = 0;
    this.paymentData.advance = 0;
    let selectCount = 0;
    for (const element of this.settlements) {
      if(element.selected) {
        if(element.paidAmount > 0) {
          selectCount += 1;
        }
        this.paymentData.totalAmount += Number(element.paidAmount);
        this.paymentData.settlData.map((v) => {
          if(element.sttlID  === v.settlementId) {
            v.paidAmount = Number(element.paidAmount);
            v.pendingAmount = Number(element.pendingPayment) - Number(element.paidAmount);
            if(Number(element.paidAmount) === Number(element.pendingPayment)) {
              v.status = 'paid';
            } else if (Number(element.paidAmount) < Number(element.pendingPayment)) {
              v.status = 'partially_paid';
            } else {
              v.status = 'unpaid';
            }

            v.paidAmount = v.paidAmount.toFixed(2);
          }
        })
      }
    }

    for (const element of this.advancePayments) {
      if(element.selected) {
        this.paymentData.advance += Number(element.paidAmount);
        this.paymentData.advData.map((v) => {
          if(element.paymentID === v.paymentID) {
            v.paidAmount = Number(element.paidAmount);
            v.pendingAmount = Number(element.pendingPayment) - Number(element.paidAmount);

            if(Number(element.paidAmount) === Number(element.pendingPayment)) {
              v.status = 'deducted';
            } else if (Number(element.paidAmount) < Number(element.pendingPayment)) {
              v.status = 'partially_deducted';
            } else {
              v.status = 'not_deducted';
            }

            v.paidAmount = v.paidAmount.toFixed(2);
          }
        })
      }
    }
    if(selectCount > 0) {
      this.submitDisabled = false;
    } else {
      this.submitDisabled = true;
    }
    this.calculateFinalTotal();
    if(this.paymentData.paymentTo === 'driver') {
      this.calculatePayroll();
    }
  }

  calculateFinalTotal() {
    this.paymentData.advance = (this.paymentData.advance) ? Number(this.paymentData.advance) : 0;
    this.paymentData.taxes = (this.paymentData.taxes) ? Number(this.paymentData.taxes) : 0;
    this.paymentData.totalAmount = (this.paymentData.totalAmount) ? Number(this.paymentData.totalAmount) : 0;
    this.paymentData.totalAmount = this.paymentData.totalAmount.toFixed(2);
    this.paymentData.finalAmount = this.paymentData.totalAmount - this.paymentData.taxes - this.paymentData.taxdata.cpp - this.paymentData.taxdata.ei - this.paymentData.advance;
    this.paymentData.finalAmount = Number(this.paymentData.finalAmount).toFixed(2);

    if(this.paymentData.finalAmount > 0) {
      this.submitDisabled = false;
    } else {
      this.submitDisabled = true;
    }
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  addRecord() {
    if(this.paymentData.settlementIds.length === 0) {
      this.toaster.error("Please select settlement(s)");
      return false;
    }

    if(this.paymentData.finalAmount <= 0 ) {
      this.toaster.error("Net payable should be greated than 0");
      return false;
    }

    for (const element of this.settlements) {
      if(element.selected) {
        if(element.paidAmount === 0) {
          this.toaster.error("Please select settlement amount");
          return false;
        }
      }
    }
    this.submitDisabled = true;
    this.accountService.postData("driver-payments", this.paymentData).subscribe({
      complete: () => {},
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
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {},
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success("Driver payment added successfully.");
        this.router.navigateByUrl("/accounts/payments/driver-payments/list");
      },
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
      let settlementIDs = [];
      this.paymentData.settlData.map((v) => {
        settlementIDs.push(v.settlementId);
      });
      this.fetchSettledData(settlementIDs);
    });
  }

  updateRecord() {
    if(this.paymentData.settlementIds.length === 0) {
      this.toaster.error("Please select settlement(s)");
      return false;
    }

    if(this.paymentData.finalAmount <= 0 ) {
      this.toaster.error("Net payable should be greated than 0");
      return false;
    }

    for (const element of this.settlements) {
      if(element.selected) {
        if(element.paidAmount === 0) {
          this.toaster.error("Please select settlement amount");
          return false;
        }
      }
    }
    this.submitDisabled = true;
    this.accountService.putData(`driver-payments/${this.paymentID}`, this.paymentData).subscribe({
      complete: () => {},
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
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {},
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success("Driver payment updated successfully.");
        this.router.navigateByUrl("/accounts/payments/driver-payments/list");
      },
    });
  }

  assignFullPayment(type, index, data) {
    if(type === 'settlement') {
      if(data.fullPayment) {
        this.settlements[index].paidAmount = data.pendingPayment;
        this.settlements[index].paidStatus = true;
      } else {
        this.settlements[index].paidAmount = 0;
        this.settlements[index].paidStatus = false;
      }

    } else {
      if(data.fullPayment) {
        this.advancePayments[index].paidAmount = data.pendingPayment;
        this.advancePayments[index].paidStatus = true;
      } else {
        this.advancePayments[index].paidAmount = 0;
        this.advancePayments[index].paidStatus = false;
      }
      this.selectedAdvancepayments();
    }
    this.paymentCalculation();
  }

  fetchSettledData(settlementIDs) {
    let ids = encodeURIComponent(JSON.stringify(settlementIDs));
    this.dataMessage = Constants.FETCHING_DATA;
    this.accountService.getData(`settlement/get/selected?entities=${ids}`).subscribe((result: any) => {
      this.settlements = result;
      this.settlements.map((v) => {
        v.paidAmount = 0;
        v.newtype = v.type.replace("_"," ");
        v.status = v.status.replace("_"," ");
      })
    });
  }

  checkInput(type, index='') {
    if(type == 'setlAmount') {
      let settlementAmount = this.settlements[index]['pendingPayment'];
      let enteredAmount = this.settlements[index]['paidAmount'];
      if(enteredAmount > settlementAmount) {
        this.settlements[index]['errText'] = 'Please enter valid amount';
        this.submitDisabled = true;
      } else {
        this.settlements[index]['errText'] = '';
        this.submitDisabled = false;
      }
    } else if(type == 'tax') {
      if(this.paymentData.taxes > this.paymentData.totalAmount) {
        this.taxErr = 'Tax amount should be less than settlement amount';
        this.submitDisabled = true;
      } else {
        this.taxErr = '';
        this.submitDisabled = false;
      }
    } else if(type == 'advance') {
      if(this.paymentData.advance > this.paymentData.totalAmount) {
        this.advErr = 'Advance amount should be less than settlement amount';
        this.submitDisabled = true;
      } else {
        this.advErr = '';
        this.submitDisabled = false;
      }
    }
  }

  fetchAdvancePayments() {
    this.dataMessageAdv = Constants.FETCHING_DATA;
    this.accountService.getData(`advance/entity/${this.paymentData.entityId}?from=${this.paymentData.fromDate}&to=${this.paymentData.toDate}`).subscribe((result: any) => {
      if(result.length === 0) {
        this.dataMessageAdv = Constants.NO_RECORDS_FOUND;
      }
      this.advancePayments = result;
      this.advancePayments.map((v) => {
        v.selected = false;
        if(v.payMode) {
          v.payMode = v.payMode.replace("_"," ");
        }
        v.fullPayment = false;
        v.paidAmount = 0;
        v.paidStatus = false;
        v.status = v.status.replace("_"," ");
        v.errText = '';
        v.prevPaidAmount = Number(v.amount) - Number(v.pendingPayment);
        v.prevPaidAmount = v.prevPaidAmount.toFixed(2);
      })
    });
  }

  selectedAdvancepayments() {
    this.paymentData.advancePayIds = [];
    this.paymentData.advData = [];
    for (const element of this.advancePayments) {
      if(element.selected) {
        if(!this.paymentData.advancePayIds.includes(element.paymentID)) {
          let obj = {
            paymentID: element.paymentID,
            status: element.status,
            paidAmount: (element.status === 'not_deducted') ? element.paidAmount : Number(element.amount) - Number(element.pendingPayment),
            totalAmount: (element.status === 'not_deducted') ? element.amount : element.pendingPayment,
            pendingAmount: element.pendingPayment
          }
          this.paymentData.advancePayIds.push(element.paymentID);
          this.paymentData.advData.push(obj);
        }
      }
    }
    this.paymentCalculation();
  }

  showCheque() {
    let obj = {
      entityId: this.paymentData.entityId,
      chequeDate: this.paymentData.payModeDate,
      chequeAmount: this.paymentData.finalAmount,
      type: this.paymentData.paymentTo,
      chequeNo: this.paymentData.payModeNo,
      currency: 'CAD',
    }
    this.listService.openPaymentChequeModal(obj);
  }


  openPayrollModel() {
    $('#payrollModal').modal('show');
  }

  calculatePayroll() {
    if(!this.paymentID) {
      if(this.paymentData.taxdata.payPeriod && this.paymentData.taxdata.stateCode) {
        if(this.paymentData.totalAmount > 0) {
          this.accountService.getData(`employee-payments/payroll/calculate?amount=${this.paymentData.totalAmount}&pay-period=${this.paymentData.taxdata.payPeriod}&state=${this.paymentData.taxdata.stateCode}`).subscribe((result: any) => {
            this.paymentData.taxdata.cpp = result.cpp;
            this.paymentData.taxdata.ei = result.insurance;
            this.paymentData.taxdata.federalTax = result.federalTax;
            this.paymentData.taxdata.provincialTax = result.provncTax;
            this.paymentData.taxdata.emplCPP = result.employerCpp;
            this.paymentData.taxdata.emplEI = result.employerEI;
            this.paymentData.taxes = this.paymentData.taxdata.federalTax + this.paymentData.taxdata.provincialTax;
            this.paymentData.taxes = Number(this.paymentData.taxes.toFixed(2));

            this.calculateFinalTotal();
          })
        }
      } else {
        this.resetPayrollCalculations();
      }
    }
  }

  fetchPayPeriods() {
    this.httpClient.get('assets/jsonFiles/payroll/payPeriods.json').subscribe((data: any) => {
      this.payPeriods = data;
    });
  }

  fetchClaimCodes() {
    this.httpClient.get('assets/jsonFiles/payroll/claimCodes.json').subscribe((data: any) => {
      this.claimCodes = data;
    });
  }

  getStates() {
    this.states = CountryStateCity.GetStatesByCountryCode(['CA']);
  }

  assignProvincalCode() {
    if(this.paymentData.taxdata.stateCode == null || this.paymentData.taxdata.stateCode == undefined) {
      this.resetPayrollCalculations();
    }
    this.provincalClaimCodes = [];
    this.claimCodes[1].map((v) => {
      if(this.paymentData.taxdata.stateCode === v.stateCode) {
        this.provincalClaimCodes = v.codes;
      }
    });
    this.paymentData.taxdata.provincialCode = 'claim_code_1';
    this.calculatePayroll();
  }

  resetPayrollCalculations() {
    this.paymentData.taxdata.cpp = 0;
    this.paymentData.taxdata.ei = 0;
    this.paymentData.taxdata.federalTax = 0;
    this.paymentData.taxdata.provincialTax = 0;
    this.paymentData.taxdata.emplCPP = 0;
    this.paymentData.taxdata.emplEI = 0;
    this.paymentData.taxes = this.paymentData.taxdata.federalTax + this.paymentData.taxdata.provincialTax;
    this.calculateFinalTotal();
  }
}

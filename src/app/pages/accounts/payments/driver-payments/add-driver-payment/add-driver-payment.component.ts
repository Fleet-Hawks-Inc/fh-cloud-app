import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';

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
    taxes:<any> 0,
    advance:<any> 0,
    finalAmount:<any> 0,
    pendingPayment: <any> 0,
    accountID: null,
    settlData: [],
    advData: [],
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

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService
  ) {}

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
    } else if (type == "cheque") {
      label = "Cheque";
    } else if (type == "eft") {
      label = "EFT";
    } else if (type == "credit_card") {
      label = "Credit Card";
    } else if (type == "debit_card") {
      label = "Debit Card";
    } else if (type == "demand_draft") {
      label = "Demand Draft";
    }
    this.payModeLabel = label;
    this.paymentData.payModeNo = null;
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
    this.paymentData.advance = (this.paymentData.advance) ? Number(this.paymentData.advance) : 0;
    this.paymentData.taxes = (this.paymentData.taxes) ? Number(this.paymentData.taxes) : 0;
    this.paymentData.totalAmount = (this.paymentData.totalAmount) ? Number(this.paymentData.totalAmount) : 0;
    this.paymentData.pendingPayment = this.paymentData.totalAmount + this.paymentData.taxes - this.paymentData.advance;
    this.paymentData.finalAmount = this.paymentData.totalAmount + this.paymentData.taxes;
    this.paymentData.finalAmount = Number(this.paymentData.finalAmount);
  }

  addRecord() {
    if(this.paymentData.settlementIds.length === 0) {
      this.toaster.error("Please select settlement(s)");
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
}

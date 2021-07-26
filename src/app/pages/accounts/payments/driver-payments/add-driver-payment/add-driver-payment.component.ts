import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    accountID: null,
    settlData: []
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
  Error: string = '';
  Success: string = '';
  submitDisabled = false;
  paymentID;

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
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
  }

  fetchDrivers() {
    this.apiService.getData(`drivers/get/list`).subscribe((result: any) => {
      this.drivers = result;
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
  }

  resetEntityVal() {
    this.paymentData.entityId = null;
  }

  fetchSettlements() {
    this.accountService.getData(`settlement/entity/${this.paymentData.entityId}`).subscribe((result: any) => {
      if(result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.settlements = result;
      this.settlements.map((v) => {
        v.selected = false;
        v.fullPayment = false;
        v.paidAmount = 0;
        v.newtype = v.type.replace("_"," ");
      })
      console.log('this.settlements', this.settlements);
    });
  }

  fetchtrips() {
    this.apiService
      .getData(`trips/get/list`)
      .subscribe((result: any) => {
        this.trips = result;
        console.log('this.trips', this.trips);
      });
  }

  selectedTrip() {
    this.paymentData.settlementIds = [];
    this.paymentData.settlData = [];
    for (const element of this.settlements) {
      if(element.selected) {
        if(!this.paymentData.settlementIds.includes(element.sttlID)) {
          let obj = {
            settlementId: element.sttlID,
            fullPayment: element.fullPayment,
            paymentStatus: element.status,
            amount: element.paidAmount,
          }
          this.paymentData.settlementIds.push(element.sttlID);
          this.paymentData.settlData.push(obj);
        }
      }
    }
    // calculation
    this.paymentCalculation();
  }

  paymentCalculation() {
    this.paymentData.totalAmount = 0;
    this.paymentData.finalAmount = 0;
    for (const element of this.settlements) {
      if(element.selected) {
        console.log('element.paidAmount', element);
        this.paymentData.totalAmount += parseFloat(element.paidAmount);
      }
    }

    this.paymentData.finalAmount = parseFloat(this.paymentData.totalAmount) + parseFloat(this.paymentData.taxes) - parseFloat(this.paymentData.advance);
  }

  addRecord() {
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
      console.log('this.paymentData', this.paymentData);
      this.fetchSettlements();
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

  assignFullPayment(index, data) {
    console.log('index', index);
    console.log('data', data)
    if(data.fullPayment) {
      this.settlements[index].paidAmount = data.finalTotal;
    } else {
      this.settlements[index].paidAmount = 0;
    }
    this.paymentCalculation();
  }
}

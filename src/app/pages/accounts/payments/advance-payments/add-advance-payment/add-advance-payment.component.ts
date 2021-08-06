import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService, ApiService, ListService } from "src/app/services";

@Component({
  selector: "app-add-advance-payment",
  templateUrl: "./add-advance-payment.component.html",
  styleUrls: ["./add-advance-payment.component.css"],
})
export class AddAdvancePaymentComponent implements OnInit {
  paymentData = {
    paymentNo: "",
    paymentTo: null,
    entityId: null,
    amount: "",
    currency: null,
    payMode: null,
    payModeNo: "",
    payModeDate: null,
    txnDate: null,
    referenceNo: "",
    notes: "",
    accountID: null,
    status: "not_deducted",
    transactionLog: [],
  };
  drivers = [];
  carriers = [];
  ownerOperators = [];
  customers = [];
  vendors = [];
  employees = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  accounts;
  payModeLabel = "";
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
    this.paymentID = this.route.snapshot.params['paymentID'];
    if(this.paymentID) {
      this.fetchPaymentDetails();
    }
    this.fetchDrivers();
    this.fetchCarriers();
    this.fetchOwnerOperators();
    this.fetchEmployee();
    this.fetchVendor();
    this.fetchCustomer();
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

  fetchEmployee() {
    this.apiService
      .getData(`contacts/get/list/employee`)
      .subscribe((result: any) => {
        this.employees = result;
      });
  }

  fetchVendor() {
    this.apiService
      .getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      });
  }

  fetchCustomer() {
    this.apiService
      .getData(`contacts/get/list/customer`)
      .subscribe((result: any) => {
        this.customers = result;
      });
  }

  addRecord() {
    console.log("paymentData", this.paymentData);
    this.submitDisabled = true;
    this.accountService.postData("advance", this.paymentData).subscribe({
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
        this.toaster.success("Advance payment added successfully.");
        this.router.navigateByUrl("/accounts/payments/advance-payments/list");
      },
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

  fetchPaymentDetails() {
    this.accountService.getData(`advance/detail/${this.paymentID}`)
      .subscribe((result: any) => {
        this.paymentData = result[0];
        this.changePaymentMode(this.paymentData.payMode);
      });
  }

  updateRecord() {
    console.log("paymentData", this.paymentData);
    this.submitDisabled = true;
    this.accountService.putData(`advance/${this.paymentID}`, this.paymentData).subscribe({
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
        this.toaster.success("Advance payment updated successfully.");
        this.router.navigateByUrl("/accounts/payments/advance-payments/list");
      },
    });
  }

  resetEntityVal() {
    this.paymentData.entityId = null;
  }
}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService, ApiService, ListService } from "src/app/services";
import { Location } from "@angular/common";
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
    txnDate: moment().format("YYYY-MM-DD"),
    referenceNo: "",
    notes: "",
    accountID: null,
    status: "not_deducted",
    transactionLog: [],
    paymentLinked: false,
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
  accounts: any = [];
  payModeLabel = "";
  errors = {};
  response: any = "";
  hasError = false;
  hasSuccess = false;
  Error: string = "";
  Success: string = "";
  submitDisabled = false;
  paymentID;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit() {
    this.paymentID = this.route.snapshot.params["paymentID"];
    if (this.paymentID) {
      this.fetchPaymentDetails();
    }
    this.fetchDrivers();
    this.fetchCarriers();
    this.fetchOwnerOperators();
    this.fetchEmployee();
    // this.fetchVendor();
    this.listService.fetchVendors();
    let vendorList = new Array<any>();
    this.getValidVendors(vendorList);
    this.vendors = vendorList;
    // this.fetchCustomer();
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
  }

  fetchDrivers() {
    this.apiService
      .getData(`drivers/get/all/active`)
      .subscribe((result: any) => {
        // this.drivers = result.Items;
        result.Items.forEach((element) => {
          if (element.isDeleted === 0) {
            this.drivers.push(element);
          }
        });
      });
  }
  refreshAccount() {
    this.listService.fetchChartAccounts();
  }
  fetchCarriers() {
    this.apiService
      .getData(`contacts/get/type/carrier`)
      .subscribe((result: any) => {
        // this.carriers = result;
        result.forEach((element) => {
          if (element.isDeleted === 0) {
            this.carriers.push(element);
          }
        });
      });
  }

  fetchOwnerOperators() {
    this.apiService
      .getData(`contacts/get/type/ownerOperator`)
      .subscribe((result: any) => {
        // this.ownerOperators = result;
        result.forEach((element) => {
          if (element.isDeleted === 0) {
            this.ownerOperators.push(element);
          }
        });
      });
  }

  fetchEmployee() {
    this.apiService
      .getData(`contacts/get/all/employees`)
      .subscribe((result: any) => {
        this.employees = result;
      });
  }

  private getValidVendors(vendorList: any[]) {
    let ids = [];
    this.listService.vendorList.forEach((element) => {
      element.forEach((element2) => {
        if (element2.isDeleted === 0 && !ids.includes(element2.contactID)) {
          vendorList.push(element2);
          ids.push(element2.contactID);
        }
      });
    });
  }

  fetchCustomer() {
    this.apiService
      .getData(`contacts/get/list/customer`)
      .subscribe((result: any) => {
        this.customers = result;
      });
  }
  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
  addRecord() {
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
        this.cancel();
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
    this.paymentData.payModeNo = null;
    this.paymentData.payModeDate = null;
  }

  fetchPaymentDetails() {
    this.accountService
      .getData(`advance/detail/${this.paymentID}`)
      .subscribe((result: any) => {
        this.paymentData = result[0];
        this.changePaymentMode(this.paymentData.payMode);
      });
  }

  updateRecord() {
    this.submitDisabled = true;
    this.accountService
      .putData(`advance/${this.paymentID}`, this.paymentData)
      .subscribe({
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
          this.cancel();
        },
      });
  }

  resetEntityVal() {
    this.paymentData.entityId = null;
  }
}

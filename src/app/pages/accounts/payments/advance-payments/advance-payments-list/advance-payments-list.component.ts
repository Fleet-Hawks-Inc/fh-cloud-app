import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import Constants from "src/app/pages/fleet/constants";
import { AccountService, ApiService } from "src/app/services";

@Component({
  selector: "app-advance-payments-list",
  templateUrl: "./advance-payments-list.component.html",
  styleUrls: ["./advance-payments-list.component.css"],
})
export class AdvancePaymentsListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  payments = [];
  filter = {
    amount: '',
    startDate: null,
    endDate: null,
    type: null,
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  drivers = [];
  contacts = [];

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.fetchPayments()
    this.fetchDrivers();
    this.fetchContactsList();
  }

  fetchPayments() {
    this.accountService.getData(`advance/paging?type=${this.filter.type}&amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`).subscribe((result: any) => {
        if (result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        this.payments = result;
        this.payments.map((v) => {
          v.paymentTo = v.paymentTo.replace("_"," ");
          if(v.payMode) {
            v.payMode = v.payMode.replace("_"," ");  
          } else {
            v.payMode= '-';
          }
          v.status = v.status.replace("_"," ");
        })
      });
  }

  fetchDrivers() {
    this.apiService.getData(`drivers/get/list`).subscribe((result: any) => {
      this.drivers = result;
    });
  }

  fetchContactsList() {
    this.apiService
      .getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.contacts = result;
      });
  }

  deletePayment(paymentID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.accountService.deleteData(`advance/delete/${paymentID}`).subscribe((result: any) => {
        this.payments = [];
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchPayments();
        this.toaster.success('Advance payment deleted successfully.');
      })
    }
  }

  searchFilter() {
    if (this.filter.type !== null || this.filter.amount !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.payments = [];
      this.fetchPayments();
    }
  }

  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
        startDate: null,
        endDate: null,
        type: null,
        amount: ''
    }
    this.fetchPayments();
  }
}

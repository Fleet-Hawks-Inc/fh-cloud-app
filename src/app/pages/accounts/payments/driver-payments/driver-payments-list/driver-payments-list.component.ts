import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';

@Component({
  selector: 'app-driver-payments-list',
  templateUrl: './driver-payments-list.component.html',
  styleUrls: ['./driver-payments-list.component.css']
})
export class DriverPaymentsListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  drivers = [];
  contacts = [];
  payments = [];
  settlements = [];
  settlementIds = [];
  filter = {
    startDate: null,
    endDate: null,
    type: null,
    amount: ''
  }
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };

  constructor(
    private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.fetchDrivers();
    this.fetchContactsList();
    this.fetchDriverPayments();
    this.fetchSettlement();
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

  fetchDriverPayments() {
    this.accountService.getData(`driver-payments/paging?type=${this.filter.type}&amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`).subscribe((result: any) => {
      this.payments = result;
      if(result.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.payments.map((v) => {
        if(v.payMode) {
          v.payMode = v.payMode.replace("_"," ");
        } else {
          v.payMode = '-';
        }
        v.paymentTo = v.paymentTo.replace("_", " ");
        v.settlData.map((k) => {
          k.status = k.status.replace("_"," ");
        });
      })
    });
  }

  fetchSettlement() {
    this.accountService.getData(`settlement/get/list`).subscribe((result: any) => {
      this.settlements = result;
    });
  }

  searchFilter() {
    if (this.filter.type !== null || this.filter.amount !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
        this.dataMessage = Constants.FETCHING_DATA;
        this.payments = [];
        this.fetchDriverPayments();
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
    this.fetchDriverPayments();
}

}

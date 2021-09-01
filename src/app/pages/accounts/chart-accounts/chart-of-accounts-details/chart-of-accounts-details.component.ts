import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from '../../../../services';
import Constants from '../../../fleet/constants';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-chart-of-accounts-details',
  templateUrl: './chart-of-accounts-details.component.html',
  styleUrls: ['./chart-of-accounts-details.component.css']
})
export class ChartOfAccountsDetailsComponent implements OnInit {
  customersObject: any = {};
  drivers: any = {};
  actID = '';
  account = {
    actName: '',
    actType: '',
    actNo: 0,
    actDesc: '',
    opnBal: 0,
    opnBalCurrency: '',
    actDash: false,
    actDate: '',
    closingAmt: 0,
    transactionLog: [],
  };
  periodVariance = 0;
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    startDate: null,
    endDate: null,
  };
  merged = null;
  constructor(private accountService: AccountService,
              private toaster: ToastrService,
              private route: ActivatedRoute,
              private apiService: ApiService) { }

  ngOnInit() {
    this.getEntityList();
    this.actID = this.route.snapshot.params[`actID`];
    if (this.actID) {
      this.fetchAccount();
    }
  }
  getEntityList() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObject = result;
      if (result) {
        this.apiService.getData(`drivers/get/list`).subscribe((result1: any) => {
          this.drivers = result1;
          this.merged = {...result, ...result1};
        });
      }
    });

  }
  fetchAccount() {
    this.accountService.getData(`chartAc/account/${this.actID}`).subscribe((res) => {
      this.account = res;
      console.log('this.account', this.account);
      for (const element of this.account.transactionLog) {
        element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
      }
      if (this.account.closingAmt > this.account.opnBal) {
        this.periodVariance = +(this.account.closingAmt - this.account.opnBal).toFixed(2);
      } else if (this.account.opnBal > this.account.closingAmt && this.account.closingAmt === 0) {
        this.periodVariance = +(this.account.opnBal - this.account.closingAmt).toFixed(2);
      } else if (this.account.opnBal > this.account.closingAmt && this.account.closingAmt > 0) {
        this.periodVariance = +(this.account.opnBal - this.account.closingAmt).toFixed(2);
      } else if (this.account.opnBal === this.account.closingAmt) {
        this.periodVariance = +(this.account.closingAmt - this.account.opnBal).toFixed(2);
      } else if (this.account.closingAmt < 0 && this.account.opnBal > 0) {
        this.periodVariance = +(this.account.opnBal + this.account.closingAmt).toFixed(2);
      } else if (this.account.opnBal === 0 && this.account.closingAmt < 0) {
        this.periodVariance = -1 * +(this.account.closingAmt).toFixed(2);
      }
    });
  }

  searchFilter() {
    this.periodVariance = 0;
    if (this.filter.endDate !== null || this.filter.startDate !== null) {
      if (
        this.filter.startDate !== '' &&
        this.filter.endDate === ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (
        this.filter.startDate === '' &&
        this.filter.endDate !== ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error('Start date should be less than end date');
        return false;
      } else {
        this.account = {
          actName: '',
          actType: '',
          actNo: 0,
          actDesc: '',
          opnBal: 0,
          opnBalCurrency: '',
          actDash: false,
          actDate: '',
          closingAmt: 0,
          transactionLog: [],
        };
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchDetails();
      }

    }
  }
  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null
    };
    this.fetchAccount();
  }
  fetchDetails() {

    this.accountService.getData(`chartAc/search/detail-page?actID=${this.actID}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`)
      .subscribe((result: any) => {
        this.account = result[0];
        this.periodVariance = 0;
        for (const element of this.account.transactionLog) {
          element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
        }
        if (this.account.closingAmt > this.account.opnBal) {
          this.periodVariance = +(this.account.closingAmt - this.account.opnBal).toFixed(2);
        } else if (this.account.opnBal > this.account.closingAmt && this.account.closingAmt > 0) {
          this.periodVariance = +(this.account.opnBal - this.account.closingAmt).toFixed(2);
        } else if (this.account.opnBal > this.account.closingAmt && this.account.closingAmt === 0) {
          this.periodVariance = +(this.account.opnBal - this.account.closingAmt).toFixed(2);
        } else if (this.account.opnBal === this.account.closingAmt) {
          this.periodVariance = +(this.account.closingAmt - this.account.opnBal).toFixed(2);
        } else if (this.account.closingAmt < 0 && this.account.opnBal > 0) {
          this.periodVariance = +(this.account.opnBal + this.account.closingAmt).toFixed(2);
        } else if (this.account.opnBal === 0 && this.account.closingAmt < 0) {
          this.periodVariance = -1 * +(this.account.closingAmt).toFixed(2);
        }
      });
  }



}

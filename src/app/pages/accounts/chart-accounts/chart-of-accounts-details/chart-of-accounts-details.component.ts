import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from '../../../../services';
import Constants from '../../../fleet/constants';
@Component({
  selector: 'app-chart-of-accounts-details',
  templateUrl: './chart-of-accounts-details.component.html',
  styleUrls: ['./chart-of-accounts-details.component.css']
})
export class ChartOfAccountsDetailsComponent implements OnInit {
  customersObject: any = {};
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
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    startDate: null,
    endDate: null,
  };
  constructor(private accountService: AccountService, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.fetchCustomersByIDs();
    this.actID = this.route.snapshot.params[`actID`];
    if (this.actID) {
      this.fetchAccount();
    }
  }
  fetchAccount() {
    this.accountService.getData(`chartAc/account/${this.actID}`).subscribe((res) => {
      this.account = res;
      for (const element of this.account.transactionLog) {
        element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
      }
    });
  }
  /*
  * Get all customers's IDs of names from api
  */
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObject = result;
    });
  }

  searchFilter() {
    if ( this.filter.endDate !== null || this.filter.startDate !== null ) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchDetails();
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
       for (const element of this.account.transactionLog) {
        element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
      }
      });
  }
}

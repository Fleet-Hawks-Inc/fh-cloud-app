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
  categories: any = {};
  actID = '';
  account = {
    first: '',
    last: '',
    actName: '',
    actType: '',
    actNo: 0,
    actDesc: '',
    actDash: false,
    opnBalCAD: 0,
    opnBalTypeCAD: 'debit',
    actDateCAD: '',
    closingAmtCAD: 0,
    transactionLogCAD: [],
    opnBalUSD: 0,
    opnBalTypeUSD: 'debit',
    actDateUSD: '',
    closingAmtUSD: 0,
    transactionLogUSD: [],
  };
  periodVarianceCAD = 0;
  periodVarianceUSD = 0;
  dataMessage: string = Constants.FETCHING_DATA;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    startDate: null,
    endDate: null,
  };
  merged = {};
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
          if (result1) {
            this.accountService.getData(`income/categories/list`)
            .subscribe((res: any) => {
              this.categories = res;
              this.merged = {...this.customersObject, ...this.drivers, ...this.categories};
            });
          }
        });
      }
    });
  }
  fetchAccount() {
    this.accountService.getData(`chartAc/account/${this.actID}`).subscribe((res) => {
      this.account = res;

      this.account[`first`] = this.account.actName.substring(0, this.account.actName.indexOf(' '));
      this.account[`last`] = this.account.actName.substring(this.account.actName.indexOf(' ') + 1, this.account.actName.length);
      for (const element of this.account.transactionLogCAD) {
        element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
      }
      for (const element of this.account.transactionLogUSD) {
        element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
      }
      if (this.account.closingAmtCAD > this.account.opnBalCAD) {
        this.periodVarianceCAD = +(this.account.closingAmtCAD - this.account.opnBalCAD).toFixed(2);
      } else if (this.account.opnBalCAD > this.account.closingAmtCAD && this.account.closingAmtCAD === 0) {
        this.periodVarianceCAD = +(this.account.opnBalCAD - this.account.closingAmtCAD).toFixed(2);
      } else if (this.account.opnBalCAD > this.account.closingAmtCAD && this.account.closingAmtCAD > 0) {
        this.periodVarianceCAD = +(this.account.opnBalCAD - this.account.closingAmtCAD).toFixed(2);
      } else if (this.account.opnBalCAD === this.account.closingAmtCAD) {
        this.periodVarianceCAD = +(this.account.closingAmtCAD - this.account.opnBalCAD).toFixed(2);
      } else if (this.account.closingAmtCAD < 0 && this.account.opnBalCAD > 0) {
        this.periodVarianceCAD = +(this.account.opnBalCAD + this.account.closingAmtCAD).toFixed(2);
      } else if (this.account.opnBalCAD === 0 && this.account.closingAmtCAD < 0) {
        this.periodVarianceCAD = -1 * +(this.account.closingAmtCAD).toFixed(2);
      }

      if (this.account.closingAmtUSD > this.account.opnBalUSD) {
        this.periodVarianceUSD = +(this.account.closingAmtUSD - this.account.opnBalUSD).toFixed(2);
      } else if (this.account.opnBalUSD > this.account.closingAmtUSD && this.account.closingAmtUSD === 0) {
        this.periodVarianceUSD = +(this.account.opnBalUSD - this.account.closingAmtUSD).toFixed(2);
      } else if (this.account.opnBalUSD > this.account.closingAmtUSD && this.account.closingAmtUSD > 0) {
        this.periodVarianceUSD = +(this.account.opnBalUSD - this.account.closingAmtUSD).toFixed(2);
      } else if (this.account.opnBalUSD === this.account.closingAmtUSD) {
        this.periodVarianceUSD = +(this.account.closingAmtUSD - this.account.opnBalUSD).toFixed(2);
      } else if (this.account.closingAmtUSD < 0 && this.account.opnBalUSD > 0) {
        this.periodVarianceUSD = +(this.account.opnBalUSD + this.account.closingAmtUSD).toFixed(2);
      } else if (this.account.opnBalUSD === 0 && this.account.closingAmtUSD < 0) {
        this.periodVarianceUSD = -1 * +(this.account.closingAmtUSD).toFixed(2);
      }
    });
  }

  searchFilter() {
    this.periodVarianceUSD = 0;
    this.periodVarianceCAD = 0;
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
          first: '',
          last: '',
          actName: '',
          actType: '',
          actNo: 0,
          actDash: false,
          actDesc: '',
          opnBalCAD: 0,
          opnBalTypeCAD: 'debit',
          actDateCAD: '',
          closingAmtCAD: 0,
          transactionLogCAD: [],
          opnBalUSD: 0,
          opnBalTypeUSD: 'debit',
          actDateUSD: '',
          closingAmtUSD: 0,
          transactionLogUSD: [],
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
        this.periodVarianceCAD = 0;
        for (const element of this.account.transactionLogCAD) {
          element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
        }
        if (this.account.closingAmtCAD > this.account.opnBalCAD) {
          this.periodVarianceCAD = +(this.account.closingAmtCAD - this.account.opnBalCAD).toFixed(2);
        } else if (this.account.opnBalCAD > this.account.closingAmtCAD && this.account.closingAmtCAD > 0) {
          this.periodVarianceCAD = +(this.account.opnBalCAD - this.account.closingAmtCAD).toFixed(2);
        } else if (this.account.opnBalCAD > this.account.closingAmtCAD && this.account.closingAmtCAD === 0) {
          this.periodVarianceCAD = +(this.account.opnBalCAD - this.account.closingAmtCAD).toFixed(2);
        } else if (this.account.opnBalCAD === this.account.closingAmtCAD) {
          this.periodVarianceCAD = +(this.account.closingAmtCAD - this.account.opnBalCAD).toFixed(2);
        } else if (this.account.closingAmtCAD < 0 && this.account.opnBalCAD > 0) {
          this.periodVarianceCAD = +(this.account.opnBalCAD + this.account.closingAmtCAD).toFixed(2);
        } else if (this.account.opnBalCAD === 0 && this.account.closingAmtCAD < 0) {
          this.periodVarianceCAD = -1 * +(this.account.closingAmtCAD).toFixed(2);
        }

        this.periodVarianceUSD = 0;
        for (const element of this.account.transactionLogUSD) {
          element.type = element.type.replace('_', ' '); // replacing _ with white space in trx type
        }
        if (this.account.closingAmtUSD > this.account.opnBalUSD) {
          this.periodVarianceUSD = +(this.account.closingAmtUSD - this.account.opnBalUSD).toFixed(2);
        } else if (this.account.opnBalUSD > this.account.closingAmtUSD && this.account.closingAmtUSD > 0) {
          this.periodVarianceUSD = +(this.account.opnBalUSD - this.account.closingAmtUSD).toFixed(2);
        } else if (this.account.opnBalUSD > this.account.closingAmtUSD && this.account.closingAmtUSD === 0) {
          this.periodVarianceUSD = +(this.account.opnBalUSD - this.account.closingAmtUSD).toFixed(2);
        } else if (this.account.opnBalUSD === this.account.closingAmtUSD) {
          this.periodVarianceUSD = +(this.account.closingAmtUSD - this.account.opnBalUSD).toFixed(2);
        } else if (this.account.closingAmtUSD < 0 && this.account.opnBalUSD > 0) {
          this.periodVarianceUSD = +(this.account.opnBalUSD + this.account.closingAmtUSD).toFixed(2);
        } else if (this.account.opnBalUSD === 0 && this.account.closingAmtUSD < 0) {
          this.periodVarianceUSD = -1 * +(this.account.closingAmtUSD).toFixed(2);
        }
      });
  }



}

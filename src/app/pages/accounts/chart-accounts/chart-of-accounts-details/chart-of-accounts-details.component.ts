import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService, ApiService } from '../../../../services';

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
  constructor(private accountService: AccountService, private route: ActivatedRoute, private apiService: ApiService ) { }

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
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../services';

@Component({
  selector: 'app-chart-of-accounts-details',
  templateUrl: './chart-of-accounts-details.component.html',
  styleUrls: ['./chart-of-accounts-details.component.css']
})
export class ChartOfAccountsDetailsComponent implements OnInit {

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
  constructor(private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit() {
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
}

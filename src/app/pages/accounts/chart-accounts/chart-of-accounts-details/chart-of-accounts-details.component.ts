import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-chart-of-accounts-details',
  templateUrl: './chart-of-accounts-details.component.html',
  styleUrls: ['./chart-of-accounts-details.component.css']
})
export class ChartOfAccountsDetailsComponent implements OnInit {

  carrierID = '560';
  actID = '';
  account =  {
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
  this.accountService.getData(`chartAc/${this.carrierID}/${this.actID}`).subscribe((res) => {
    this.account = res[0];
    console.log('res', res);
    console.log('this.account', this.account);
    });
}
}

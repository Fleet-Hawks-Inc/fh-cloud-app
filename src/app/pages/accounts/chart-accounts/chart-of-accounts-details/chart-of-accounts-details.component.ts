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
  account = [];
  constructor(private accountService: AccountService,private route: ActivatedRoute,) { }

  ngOnInit() {
    this.actID = this.route.snapshot.params[`actID`];
    if (this.actID) {
      this.fetchAccount();
    }
  }
fetchAccount() {
  this.accountService.getData(`chartAc/${this.carrierID}/${this.actID}`).subscribe((res) => {
    this.account = res;
    });
}
}

import { Component, OnInit } from '@angular/core';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-transfers-list',
  templateUrl: './transfers-list.component.html',
  styleUrls: ['./transfers-list.component.css']
})
export class TransfersListComponent implements OnInit {

  transactions = [];
  dataMessage: string = Constants.FETCHING_DATA;
  
  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.fetchListing();
  }

  fetchListing() {
    this.accountService.getData(`transfer-transactions/paging?type=`).subscribe((result: any) => {
      this.transactions = result;
      if(this.transactions.length == 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND
      }

      this.transactions.map((v) => {
        v.url = `/accounts/transactions/transfers/detail/${v.transferID}`;
        v.editUrl = `/accounts/transactions/transfers/edit/${v.transferID}`;
        v.payMode = v.payMode.replace('_',' ')
      })
      console.log('this.transactions', this.transactions)
    })
  }
}

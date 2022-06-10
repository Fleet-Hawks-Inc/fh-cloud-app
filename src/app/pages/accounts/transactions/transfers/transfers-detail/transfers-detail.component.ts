import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-transfers-detail',
  templateUrl: './transfers-detail.component.html',
  styleUrls: ['./transfers-detail.component.css']
})
export class TransfersDetailComponent implements OnInit {

  transferID = '';
  transferData = {
    trNo: '',
    fAcc: null,
    tAcc: null,
    txnDate: null,
    amount: null,
    curr: '',
    payMode: null,
    payModeNo: '',
    payModeDate: '',
    desc: '',
    fromAccName: '',
    toAccName: '',
    transactionLog: []
  }
  constructor(private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.transferID = this.route.snapshot.params["transferID"];
    this.fetchDetail()
  }

  async fetchDetail() {
    let result: any = await this.accountService.getData(`transfer-transactions/detail/${this.transferID}`).toPromise();
    if(result && result.length > 0) {
      this.transferData = result[0];
      this.transferData.payMode = this.transferData.payMode.replace('_',' ');
    }
  }
}

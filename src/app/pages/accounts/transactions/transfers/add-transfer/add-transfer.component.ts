import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-add-transfer',
  templateUrl: './add-transfer.component.html',
  styleUrls: ['./add-transfer.component.css']
})
export class AddTransferComponent implements OnInit {

  accounts:any = [];
  transferData = {
    fAcc: null,
    tAcc: null,
    txnDate: null,
    amount: null,
    curr: 'CAD',
    payMode: null,
    payModeNo: '',
    payModeDate: '',
    desc: ''
  }
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  payModeLabel = '';
  errors = {};

  constructor(private listService: ListService, private accountService: AccountService,) { }

  ngOnInit() { 

    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;

    console.log('this.accounts', this.accounts)
  }

  changePaymentMode(type) {
    let label = "";
    if (type == "cash") {
      label = "Cash";
    } else if (type == "cheque") {
      label = "Cheque";
    } else if (type == "eft") {
      label = "EFT";
    } else if (type == "credit_card") {
      label = "Credit Card";
    } else if (type == "debit_card") {
      label = "Debit Card";
    } else if (type == "demand_draft") {
      label = "Demand Draft";
    }
    this.payModeLabel = label;
    this.transferData.payModeNo = null;
    this.transferData.payModeDate = null;
  }

  addRecord() {
    console.log('transfer data', this.transferData);
    this.accountService.postData("transfer-transactions", this.transferData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, "This Field");
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              // this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              // this.submitDisabled = false;
            },
            next: () => { },
          });
      },
      next: (res) => {
        // this.submitDisabled = false;
        // this.response = res;
        // this.toaster.success("Advance payment added successfully.");
        console.log('pay done')
      },
    });
  }
}

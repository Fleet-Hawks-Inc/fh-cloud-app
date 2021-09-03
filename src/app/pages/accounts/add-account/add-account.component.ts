import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService, ListService } from '../../../services';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  receivedActID = '';
  actName = null;
  actType = null;
  actNo: number;
  actDesc: '';
  opnBal: number;
  opnBalType = 'debit';
  opnBalCurrency: '';
  actDash = false;
  actDate: '';
  closingAmt: number;
  transactionLog = [];
  transLog = false;
  internalActID = '';
  errors = {};
  response: any = '';
  hasError = false;
  hasSuccess = false;
  Error = '';
  Success = '';
  submitDisabled = false;
  constructor(
    private accountService: AccountService,
    private listService: ListService,
    private toaster: ToastrService) { }

  ngOnInit() {}
  addAccount() {
    this.submitDisabled = true;
    const data = {
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      opnBal: this.opnBal,
      opnBalType: this.opnBalType,
      opnBalCurrency: this.opnBalCurrency,
      actDash: this.actDash,
      actDate: this.actDate,
      transactionLog: [],
      closingAmt: 0,
      internalActID: '',
    };

    this.accountService.postData('chartAc', data).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error)
          .pipe(
            map((val: any) => {
              val.message = val.message.replace(/".*"/, 'This Field');
              this.errors[val.context.key] = val.message;
            })
          )
          .subscribe({
            complete: () => {
              this.submitDisabled = false;
              // this.throwErrors();
            },
            error: () => {
              this.submitDisabled = false;
            },
            next: () => {
            },
          });
      },
      next: (res) => {
        this.submitDisabled = false;
        this.response = res;
        this.toaster.success('Account Added Successfully.');
        $('#addAccountModal').modal('hide');
        this.listService.fetchChartAccounts();
        this.actName = '';
        this.actType = '';
        this.actNo = null;
        this.actDesc = '';
        this.opnBal = null;
        this.opnBalCurrency = '';
        this.opnBalType = 'debit';
        this.actDash = false;
        this.actDate = '';
        this.closingAmt = null;
        this.transactionLog = [];
        this.internalActID = '';
        this.transLog = false;
      },
    });
  }
  onChangeType(value: any) {
    this.opnBalType = value;
}
  hideModal() {
    $('#addAccountModal').modal('hide');
    this.transLog = false;
  }


}

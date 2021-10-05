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
  futureDatesLimit = { year: this.date.getFullYear(), month: 12, day: 31 };
  receivedActID = '';
  actName = null;
  actType = null;
  actNo: number;
  actDesc: '';
  actDash = false;
  opnBalCAD = 0;
  opnBalTypeCAD = 'debit';
  actDateCAD: '';
  closingAmtCAD: number;
  transactionLogCAD = [];
  opnBalUSD = 0;
  opnBalTypeUSD = 'debit';
  actDateUSD: '';
  closingAmtUSD: number;
  transactionLogUSD = [];
  transLogCAD = false;
  transLogUSD = false;
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
      opnBalCAD: this.opnBalCAD,
      opnBalTypeCAD: this.opnBalTypeCAD,
      actDash: this.actDash,
      actDateCAD: this.actDateCAD,
      transactionLogCAD: [],
      closingAmtCAD: 0,
      opnBalUSD: this.opnBalUSD,
      opnBalTypeUSD: this.opnBalTypeUSD,
      actDateUSD: this.actDateUSD,
      transactionLogUSD: [],
      closingAmtUSD: 0,
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
        this.internalActID = '';
        this.actNo = null;
        this.actDash = false;
        this.actDesc = '';
        this.opnBalCAD = null;
        this.opnBalTypeCAD = 'debit';
        this.actDateCAD = '';
        this.closingAmtCAD = null;
        this.transactionLogCAD = [];
        this.transLogUSD = false;
        this.opnBalUSD = null;
        this.opnBalTypeUSD = 'debit';
        this.actDateUSD = '';
        this.closingAmtUSD = null;
        this.transactionLogUSD = [];
        this.transLogUSD = false;
      },
    });
  }
  onChangeType(value: any, type: string) {
    if (type === 'CAD') {
      this.opnBalTypeCAD = value;
    } else {
      this.opnBalTypeUSD = value;
    }
  }
  hideModal() {
    $('#addAccountModal').modal('hide');
    this.transLogCAD = false;
    this.transLogUSD = false;
  }


}

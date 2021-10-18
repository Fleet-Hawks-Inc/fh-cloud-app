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
  mainactType = null;
  actNo: number;
  actDesc: '';
  actDash = false;
  actClassID = null;
  opnBalCAD = 0;
  opnBalTypeCAD = 'debit';
  actDate: '';
  closingAmtCAD: number;
  transactionLogCAD = [];
  opnBalUSD = 0;
  opnBalTypeUSD = 'debit';
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
  actNoError = false;
  actNameError = false;
  classData = {
    acClassName: '',
    acClassDesc: ''
  };
  classDisabled = false;
  acClasses = [];
  constructor(
    private accountService: AccountService,
    private listService: ListService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.getAcClasses();
  }
  addAccount() {
    this.submitDisabled = true;
    const data = {
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actClassID: this.actClassID,
      mainactType: this.mainactType,
      actDesc: this.actDesc,
      actDash: this.actDash,
      opnBalCAD: this.opnBalCAD,
      opnBalTypeCAD: this.opnBalTypeCAD,
      actDate: this.actDate,
      transactionLogCAD: [],
      closingAmtCAD: 0,
      opnBalUSD: this.opnBalUSD,
      opnBalTypeUSD: this.opnBalTypeUSD,
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
        this.mainactType = '';
        this.actClassID = '';
        this.internalActID = '';
        this.actNo = null;
        this.actDash = false;
        this.actDesc = '';
        this.opnBalCAD = null;
        this.opnBalTypeCAD = 'debit';
        this.actDate = '';
        this.closingAmtCAD = null;
        this.transactionLogCAD = [];
        this.transLogUSD = false;
        this.opnBalUSD = null;
        this.opnBalTypeUSD = 'debit';
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
  getAcClasses() {
    this.accountService.getData('chartAc/get/acClasses').subscribe((res) => {
      this.acClasses = res;
    });
  }
  validateAcNumber(actNo) {
    this.accountService.getData(`chartAc/validate/accountNumber/${actNo}`).subscribe((res) => {
      if (res === true) {
        this.actNoError = true;
        this.submitDisabled = true;
      } else {
        this.actNoError = false;
        this.submitDisabled = true;
      }
    });
  }
  validateAcName(actName) {
    actName = actName.replace(/\s+/g, ' ').trim(); // trim the double or more spaces if in between words
    this.accountService.getData(`chartAc/validate/accountName/${actName}`).subscribe((res) => {
      if (res === true) {
        this.actNameError = true;
      } else {
        this.actNameError = false;
      }
    });
  }
  addAcClass() {
    this.classDisabled = true;
    this.errors = {};
    this.hasError = false;
    this.hasSuccess = false;
    this.accountService.postData('chartAc/acClass/add', this.classData).subscribe({
      complete: () => { },
      error: (err: any) => {
        from(err.error).pipe(map((val: any) => {
          val.message = val.message.replace(/".*"/, 'This Field');
          this.errors[val.context.key] = val.message;
        })).subscribe({
          complete: () => {
            this.classDisabled = false;
          },
          error: () => {
            this.classDisabled = false;
          },
          next: () => { },
        });
      },
      next: (res) => {
        this.getAcClasses();
        this.classDisabled = false;
        this.response = res;
        $('#addAccountClassModal').modal('hide');
        this.classData = {
          acClassName: '',
          acClassDesc: ''
        };
        this.toaster.success('Account class added successfully.');
      },
    });
  }
  refreshClass() {
    this.getAcClasses();
  }
}

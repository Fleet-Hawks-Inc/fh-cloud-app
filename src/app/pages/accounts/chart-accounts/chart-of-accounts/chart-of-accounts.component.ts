import { AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../../fleet/constants';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {
  modalTitle = 'Add Account';
  dataMessage = Constants.NO_RECORDS_FOUND;
  accounts: any = [];
  newAccounts = [];
  parentMessage: '';
  lastItemSK = '';
  filter = {
    actType: null,
    actName: null,
  };

  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  receivedActID = '';
  fetchedID = null;
  actName = null;
  actType = null;
  actNo: number;
  actDesc: '';
  opnBal: number;
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
  constructor(private accountService: AccountService, private toaster: ToastrService, private listService: ListService) { }

  ngOnInit() {
    this.fetchAccounts();
  }
  preAccounts() {
    this.accountService.getData('chartAc/predefinedAccounts').subscribe((res: any) => {
      this.toaster.success('Predefined  Accounts Created.');
      this.listService.fetchChartAccounts();
      this.accounts = this.listService.accountsList;
    });
  }
  deleteAccount(actID: string) {
    // this.accountService.deleteData(`chartAc/${this.carrierID}/${actID}`).subscribe((res) => {
    //   this.toaster.success('Account Deleted Successfully.');
    //   this.listService.fetchChartAccounts();
    //   });
  }
  showAcModal() {
    this.fetchedID = null;
    this.actName = '';
    this.actType = '';
    this.actNo = null;
    this.actDesc = '';
    this.opnBal = null;
    this.opnBalCurrency = '';
    this.actDash = false;
    this.actDate = '';
    this.closingAmt = null;
    this.transactionLog = [];
    this.internalActID = '';
    this.transLog = false;
    this.modalTitle = 'Add Account';
    $('#addAccountModal').modal('show');
  }
  searchAccounts() {
    if (this.filter.actType !== '' || this.filter.actType !== null || this.filter.actName !== null || this.filter.actName !== '') {
        this.accounts = [];
        this.lastItemSK = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchAccounts();
      }
  }
  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      actType: null,
      actName: null,
    };
    this.lastItemSK = '';
    this.accounts = [];
    this.fetchAccounts();
  }
  async fetchAccounts(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.accounts = [];
    }
    if (this.lastItemSK !== 'end') {
      let name = null;
      let type = null;
      if (this.filter.actType !== null || this.filter.actName !== null) {
        if (this.filter.actType !== null && this.filter.actType !== '') {
          type = this.filter.actType.toLowerCase();
        }
        if (this.filter.actName !== null && this.filter.actName !== '') {
          name = this.filter.actName.toLowerCase();
        }
        this.dataMessage = Constants.FETCHING_DATA;
      }
      this.accountService.getData(`chartAc/paging?actName=${name}&actType=${type}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            //  this.accounts = result;
            result.map((v) => {
              v.first = v.actName.substring(0, v.actName.indexOf(' '));
              v.last = v.actName.substring(v.actName.indexOf(' ') + 1, v.actName.length);
              this.accounts.push(v);
            });
            if (this.accounts[this.accounts.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(this.accounts[this.accounts.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
          }
        });
    }

  }
  onScroll() {
    this.fetchAccounts();
  }


  addAccount() {
    this.submitDisabled = true;
    const data = {
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      opnBal: this.opnBal,
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
        this.lastItemSK = '';
        this.accounts = [];
        this.fetchAccounts();
        this.actName = '';
        this.actType = '';
        this.actNo = null;
        this.actDesc = '';
        this.opnBal = null;
        this.opnBalCurrency = '';
        this.actDash = false;
        this.actDate = '';
        this.closingAmt = null;
        this.transactionLog = [];
        this.internalActID = '';
        this.transLog = false;
      },
    });
  }

  editAccount(ID: any) {
    this.fetchedID = ID;
    this.modalTitle = 'Edit Account';
    $('#addAccountModal').modal('show');
    if (ID !== '' && ID !== undefined) {
      this.fetchAccount(ID);
    } else {
      this.actName = '';
      this.actType = '';
      this.actNo = null;
      this.actDesc = '';
      this.opnBal = null;
      this.opnBalCurrency = '';
      this.actDash = false;
      this.actDate = '';
      this.closingAmt = null;
      this.internalActID = '';

    }
  }
  fetchAccount(ID: any) {
    this.fetchedID = ID;
    this.accountService.getData(`chartAc/account/${ID}`).subscribe((res) => {
      this.actName = res.actName;
      this.actType = res.actType;
      this.actNo = res.actNo;
      this.actDesc = res.actDesc;
      this.opnBal = res.opnBal;
      this.opnBalCurrency = res.opnBalCurrency;
      this.actDash = res.actDash;
      this.actDate = res.actDate;
      this.closingAmt = res.closingAmt;
      this.internalActID = res.internalActID;
      this.transactionLog = res.transactionLog;
      if (this.transactionLog.length > 0) {
        this.transLog = true;
      }

    });
  }

  updateAccount(ID: any) {
    this.submitDisabled = true;
    const data = {
      actID: ID,
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      opnBal: this.opnBal,
      opnBalCurrency: this.opnBalCurrency,
      actDash: this.actDash,
      actDate: this.actDate,
      transactionLog: this.transactionLog,
      closingAmt: this.closingAmt,
      internalActID: this.internalActID,
    };
    this.accountService.putData(`chartAc/update/${ID}`, data).subscribe({
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
        this.toaster.success('Account Updated Successfully.');
        $('#addAccountModal').modal('hide');
        this.lastItemSK = '';
        this.accounts = [];
        this.fetchAccounts();
        this.actName = '';
        this.actType = '';
        this.actNo = null;
        this.actDesc = '';
        this.opnBal = null;
        this.opnBalCurrency = '';
        this.actDash = false;
        this.actDate = '';
        this.closingAmt = null;
        this.transactionLog = [];
        this.internalActID = '';
        this.transLog = false;
      },
    });
  }

  hideModal() {
    $('#addAccountModal').modal('hide');
    this.transLog = false;
  }
}

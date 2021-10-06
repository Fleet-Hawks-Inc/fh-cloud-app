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
  dataMessage = Constants.FETCHING_DATA;
  accounts: any = [];
  newAccounts = [];
  parentMessage: '';
  lastItemSK = '';
  filter = {
    actType: null,
    actName: null,
  };
  classData = {
    acClassName: '',
    acClassDesc: ''
  };
  classDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear(), month: 12, day: 31 };
  receivedActID = '';
  fetchedID = null;
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
  acClasses = [];
  submitDisabled = false;
  deactivatePredefined = true;
  addPredefined = false;
  disableSearch = false;
  loaded = false;
  constructor(private accountService: AccountService, private toaster: ToastrService, private listService: ListService) { }

  ngOnInit() {
    this.checkPredefinedAccounts();
    this.fetchAccounts();
    this.getAcClasses();
  }
  preAccounts() {
    this.addPredefined = true;
    this.accountService.getData('chartAc/predefinedAccounts').subscribe((res: any) => {
      this.toaster.success('Predefined  Accounts Created.');
      this.fetchAccounts();
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
    this.actDash = false;
    this.internalActID = '';
    this.opnBalCAD = null;
    this.opnBalTypeCAD = 'debit';
    this.actDateCAD = '';
    this.closingAmtCAD = null;
    this.transactionLogCAD = [];
    this.transLogCAD = false;
    this.opnBalUSD = null;
    this.opnBalTypeUSD = 'debit';
    this.actDateUSD = '';
    this.closingAmtUSD = null;
    this.transactionLogUSD = [];
    this.transLogUSD = false;
    this.modalTitle = 'Add Account';
    $('#addAccountModal').modal('show');
  }
  onChangeType(value: any, type: string) {
    if (type === 'CAD') {
      this.opnBalTypeCAD = value;
    } else {
      this.opnBalTypeUSD = value;
    }
  }
  searchAccounts() {
    if (this.filter.actType !== '' || this.filter.actType !== null || this.filter.actName !== null || this.filter.actName !== '') {
      this.disableSearch = true;
      this.accounts = [];
      this.lastItemSK = '';
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchAccounts();
    }
  }
  resetFilter() {
    this.disableSearch = true;
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
            this.disableSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            this.disableSearch = false;
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
            this.loaded = true;
          }
        });
    }
    if (this.deactivatePredefined === false) {
      this.dataMessage = 'Please add predefined accounts';
    }
  }
  onScroll() {
    if (this.loaded) {
      this.fetchAccounts();
    }
    this.loaded = false;
  }
  checkPredefinedAccounts() {
    this.accountService.getData(`chartAc/get/internalID/list/all`).subscribe((res) => {
      if (res.ACT0 !== undefined && res.ACT66 !== undefined) {
        this.deactivatePredefined = true;
      } else {
        this.deactivatePredefined = false;
        this.dataMessage = 'Please add predefined accounts';
      }
    });
  }

  addAccount() {
    this.submitDisabled = true;
    const data = {
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      actDash: this.actDash,
      opnBalCAD: this.opnBalCAD,
      opnBalTypeCAD: this.opnBalTypeCAD,
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
        this.lastItemSK = '';
        this.accounts = [];
        this.fetchAccounts();
        this.toaster.success('Account Added Successfully.');
        $('#addAccountModal').modal('hide');
        this.actName = '';
        this.actType = '';
        this.actNo = null;
        this.actDesc = '';
        this.actDash = false;
        this.opnBalCAD = null;
        this.opnBalTypeCAD = 'debit';
        this.actDateCAD = '';
        this.closingAmtCAD = null;
        this.transactionLogCAD = [];
        this.opnBalUSD = null;
        this.opnBalTypeUSD = 'debit';
        this.actDateUSD = '';
        this.closingAmtUSD = null;
        this.transactionLogUSD = [];
        this.internalActID = '';
        this.transLogCAD = false;
        this.transLogUSD = false;
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
      this.actDash = false;
      this.internalActID = '';
      this.opnBalCAD = null;
      this.opnBalTypeCAD = 'debit';
      this.actDateCAD = '';
      this.closingAmtCAD = null;
      this.opnBalUSD = null;
      this.opnBalTypeUSD = 'debit';
      this.actDateUSD = '';
      this.closingAmtUSD = null;

    }
  }
  fetchAccount(ID: any) {
    this.fetchedID = ID;
    this.accountService.getData(`chartAc/account/${ID}`).subscribe((res) => {
      this.actName = res.actName;
      this.actType = res.actType;
      this.actNo = res.actNo;
      this.actDesc = res.actDesc;
      this.actDash = res.actDash;
      this.internalActID = res.internalActID;
      this.opnBalCAD = res.opnBalCAD;
      this.opnBalTypeCAD = res.opnBalTypeCAD;
      this.actDateCAD = res.actDateCAD;
      this.closingAmtCAD = res.closingAmtCAD;
      this.transactionLogCAD = res.transactionLogCAD;
      this.opnBalUSD = res.opnBalUSD;
      this.opnBalTypeUSD = res.opnBalTypeUSD;
      this.actDateUSD = res.actDateUSD;
      this.closingAmtUSD = res.closingAmtUSD;
      this.transactionLogUSD = res.transactionLogUSD;
      if (this.transactionLogCAD.length > 0) {
        this.transLogCAD = true;
      }
      if (this.transactionLogUSD.length > 0) {
        this.transLogUSD = true;
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
      actDash: this.actDash,
      opnBalCAD: this.opnBalCAD,
      opnBalTypeCAD: this.opnBalTypeCAD,
      actDateCAD: this.actDateCAD,
      transactionLogCAD: this.transactionLogCAD,
      closingAmtCAD: this.closingAmtCAD,
      opnBalUSD: this.opnBalUSD,
      opnBalTypeUSD: this.opnBalTypeUSD,
      actDateUSD: this.actDateUSD,
      transactionLogUSD: this.transactionLogUSD,
      closingAmtUSD: this.closingAmtUSD,
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
        this.lastItemSK = '';
        this.accounts = [];
        this.fetchAccounts();
        this.toaster.success('Account Updated Successfully.');
        $('#addAccountModal').modal('hide');
        this.actName = '';
        this.actType = '';
        this.actNo = null;
        this.internalActID = '';
        this.actDash = false;
        this.actDesc = '';
        this.opnBalCAD = null;
        this.opnBalTypeCAD = 'debit';
        this.actDateCAD = '';
        this.closingAmtCAD = null;
        this.transactionLogCAD = [];
        this.transLogCAD = false;
        this.opnBalUSD = null;
        this.opnBalTypeUSD = 'debit';
        this.actDateUSD = '';
        this.closingAmtUSD = null;
        this.transactionLogUSD = [];
        this.transLogUSD = false;
      },
    });
  }

  hideModal() {
    $('#addAccountModal').modal('hide');
    this.transLogCAD = false;
    this.transLogUSD = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      actType: null,
      actName: null,
    };
    this.lastItemSK = '';
    this.accounts = [];
    this.fetchAccounts();
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

  getAcClasses() {
    this.accountService.getData('chartAc/get/acClasses').subscribe((res) => {
      this.acClasses = res;
    });
  }
  refreshClass() {
    this.getAcClasses();
  }
}

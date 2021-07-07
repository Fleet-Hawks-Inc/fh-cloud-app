import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService, ListService } from '../../../services';
declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
   @Input() childMessage: string;
  receivedActID = '';
  actName: '';
  actType: '';
  actNo: number;
  actDesc: '';
  opnBal: number;
  opnBalCurrency: '';
  actDash = false;
  actDate: '';
  closingAmt: number;
  transactionLog = [];
  internalActID = '';

  constructor(
    private ngbCalendar: NgbCalendar,
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private accountService: AccountService,
    private listService: ListService,
    private toaster: ToastrService) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    if (this.receivedActID === '') {
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
  ngOnChanges() {
    this.receivedActID = this.childMessage;
    if (this.receivedActID !== '' && this.receivedActID !== undefined) {
      this.fetchAccount();
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
  addAccount() {
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
      internalActID : '',
    };
    this.accountService.postData(`chartAc`, data).subscribe((res: any) => {
      this.toaster.success('Account Added Successfully.');
      $('#addAccountModal').modal('hide');
      this.listService.fetchChartAccounts();
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

    });
  }
  fetchAccount() {
    this.accountService.getData(`chartAc/account/${this.childMessage}`).subscribe((res) => {
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

    });
  }
  updateAccount() {
    const data = {
      actID: this.receivedActID,
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      opnBal: this.opnBal,
      opnBalCurrency: this.opnBalCurrency,
      actDash: this.actDash,
      actDate: this.actDate,
      transactionLog: [],
      closingAmt: this.closingAmt,
      internalActID: this.internalActID,
    };
    this.accountService.putData(`chartAc/update/${this.receivedActID}`, data).subscribe((res: any) => {
      this.toaster.success('Account Updated Successfully.');
      this.listService.fetchChartAccounts();
      $('#addAccountModal').modal('hide');

    });
  }
  hideModal() {
    $('#addAccountModal').modal('hide');
  }
}

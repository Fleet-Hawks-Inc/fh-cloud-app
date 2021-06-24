import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { ListService } from 'src/app/services/list.service';
declare var $: any;
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
   @Input() childMessage: string;
  receivedActID = '';
  carrierID = '560';
  actName: '';
  actType: '';
  actNo: number;
  actDesc: '';
  opnBal: number;
  opnBalCurrency: '';
  actDash = false;
  actDate: '';
  closingAmt: number;
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
    if(this.receivedActID === ''){
      this.actName = '';
      this.actType = '';
      this.actNo = null;
      this.actDesc = '';
      this.opnBal = null;
      this.opnBalCurrency = '';
      this.actDash = false;
      this.actDate = '';
      this.closingAmt = null;
    }
  }
  ngOnChanges() {
    // this.receivedActID = this.childMessage;
    // if (this.receivedActID !== '' && this.receivedActID !== undefined) {
    //   this.fetchAccount();
    // } else {
    //   this.actName = '';
    //   this.actType = '';
    //   this.actNo = null;
    //   this.actDesc = '';
    //   this.opnBal = null;
    //   this.opnBalCurrency = '';
    //   this.actDash = false;
    //   this.actDate = '';
    //   this.closingAmt = null;
    // }
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
    };
    console.log('data', data);
    this.accountService.postData(`chartAc/${this.carrierID}`, data).subscribe((res: any) => {
      this.toaster.success('Account Added Successfully.');
      $('#addAccountModal').modal('hide');
      this.listService.fetchChartAccounts();
      this.router.navigateByUrl('/accounts/chart-accounts/list');
      this.actName = '';
      this.actType = '';
      this.actNo = null;
      this.actDesc = '';
      this.opnBal = null;
      this.opnBalCurrency = '';
      this.actDash = false;
      this.actDate = '';
      this.closingAmt = null;
    });
  }
  fetchAccount() {
    // this.accountService.getData(`chartAc/${this.carrierID}/${this.childMessage}`).subscribe((res) => {
    //   this.actName = res[0].actName;
    //   this.actType = res[0].actType;
    //   this.actNo = res[0].actNo;
    //   this.actDesc = res[0].actDesc;
    //   this.opnBal = res[0].opnBal;
    //   this.opnBalCurrency = res[0].opnBalCurrency;
    //   this.actDash = res[0].actDash;
    //   this.actDate = res[0].actDate;
    //   this.closingAmt = res[0].closingAmt;
    // });
  }
  updateAccount() {
    const data = {
      pk: this.carrierID,
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
    };
    console.log('data', data);
    this.accountService.putData(`chartAc/${this.carrierID}/${this.receivedActID}`, data).subscribe((res: any) => {
      this.toaster.success('Account Updated Successfully.');
      this.listService.fetchChartAccounts();
      this.router.navigateByUrl('/accounts/chart-accounts/list');
      $('#addAccountModal').modal('hide');

    });
  }
  hideModal() {
    $('#addAccountModal').modal('hide');
  }
}

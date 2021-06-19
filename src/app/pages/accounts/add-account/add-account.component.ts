import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
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
  actNo: '';
  actDesc: '';
  actBal: '';
  actBalCurrency: '';
  actDash: '';
  actDate: '';
  constructor(
    private ngbCalendar: NgbCalendar,
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private accountService: AccountService,
    private toaster: ToastrService) { }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  ngOnInit() {
    if(this.receivedActID === ''){
      this.actName = '';
      this.actType = '';
      this.actNo = '';
      this.actDesc = '';
      this.actBal = '';
      this.actBalCurrency = '';
      this.actDash = '';
      this.actDate = '';
    }
  }
  ngOnChanges() {
    this.receivedActID = this.childMessage;
    if (this.receivedActID !== '') {
      this.fetchAccount();
    }
    else {
      this.actName = '';
      this.actType = '';
      this.actNo = '';
      this.actDesc = '';
      this.actBal = '';
      this.actBalCurrency = '';
      this.actDash = '';
      this.actDate = '';
    }
  }
  addAccount() {
    const data = {
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      actBal: this.actBal,
      actBalCurrency: this.actBalCurrency,
      actDash: this.actDash,
      actDate: this.actDate
    };
    console.log('data', data);
    this.accountService.postData(`chartAc/${this.carrierID}`, data).subscribe((res: any) => {
      this.toaster.success('Account Added Successfully.');
      $('#addAccountModal').modal('hide');
      this.router.navigateByUrl('/accounts/chart-accounts/list');

    });
  }
  fetchAccount() {
    this.accountService.getData(`chartAc/${this.carrierID}/${this.childMessage}`).subscribe((res) => {
      this.actName = res.actName;
      this.actType = res.actType;
      this.actNo = res.actNo;
      this.actDesc = res.actDesc;
      this.actBal = res.actBal;
      this.actBalCurrency = res.actBalCurrency;
      this.actDash = res.actDash;
      this.actDate = res.actDate;
    });
  }
  updateAccount() {
    const data = {
      pk: this.carrierID,
      actID: this.receivedActID,
      actName: this.actName,
      actType: this.actType,
      actNo: this.actNo,
      actDesc: this.actDesc,
      actBal: this.actBal,
      actBalCurrency: this.actBalCurrency,
      actDash: this.actDash,
      actDate: this.actDate
    };
    console.log('data', data);
    this.accountService.putData(`chartAc/${this.carrierID}/${this.receivedActID}`, data).subscribe((res: any) => {
      this.toaster.success('Account Updated Successfully.');
      $('#addAccountModal').modal('hide');
      this.router.navigateByUrl('/accounts/chart-accounts/list');

    });
  }
  hideModal() {
    $('#addAccountModal').modal('hide');
  }
}

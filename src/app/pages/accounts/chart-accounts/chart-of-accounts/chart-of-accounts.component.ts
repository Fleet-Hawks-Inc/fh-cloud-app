import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
declare var $: any;
@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {
  modalTitle = 'Add Account';
  accounts = [];
  carrierID = '560';
  parentMessage: '';
  constructor(private accountService: AccountService, private toaster: ToastrService,) { }

  ngOnInit() {
    this.fetchAccounts();
  }
 fetchAccounts() {
  this.accountService.getData('chartAc').subscribe((res) => {
  this.accounts = res;
  console.log('this.accounts', this.accounts);
  });
}
deleteAccount(actID: string) {
  this.accountService.deleteData(`chartAc/${this.carrierID}/${actID}`).subscribe((res) => {
    this.toaster.success('Account Deleted Successfully.');
    this.fetchAccounts();
    });
}
showAcModal() {
  this.parentMessage = '';
  this.modalTitle = 'Add Account';
  $('#addAccountModal').modal('show');
}
editAccount(actID: any) {
  this.parentMessage = actID;
  this.modalTitle = 'Edit Account';
  $('#addAccountModal').modal('show');
}
}

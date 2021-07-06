import { AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {
  modalTitle = 'Add Account';
  accounts: any = [];
  parentMessage: '';
  constructor(private accountService: AccountService, private toaster: ToastrService, private listService: ListService) { }

  ngOnInit() {
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
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

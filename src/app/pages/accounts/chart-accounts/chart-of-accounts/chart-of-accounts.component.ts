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
  carrierID = '100';
  // receivedActID = '1uLSjFBJ3QUebg8vhjAAzL572JI';
  parentMessage: '';
  constructor(private accountService: AccountService, private toaster: ToastrService, private listService: ListService) { }

  ngOnInit() {
    // this.trxFn(); // test function to call debit credit api
    this.listService.fetchChartAccounts();
    this.accounts = this.listService.accountsList;
    console.log('this.accounts', this.accounts);

  }
 // debit/credit test function
trxFn() {
  let internalID = 'ACT35';
  const data = {
    trxDate: '2021-06-06',
    name: 'hello world',
    trxType: 'credit', // It can be debit or credit
    type: 'invoice', // Type means either it's from invoice, bill etc.
    amount: 500,
    currency: 'CAD',
    trxRunTotal: 0,
    desc: 'test desc'
  };
  this.accountService.putData(`chartAc/internalActID/${internalID}`, data).subscribe((res) => {
  });
}
preAccounts() {
  console.log('hello accounts');
  this.accountService.getData('chartAc/predefinedAccounts').subscribe((res: any) => {
    console.log('predefined accounts  function');
  });
}
deleteAccount(actID: string) {
  this.accountService.deleteData(`chartAc/${this.carrierID}/${actID}`).subscribe((res) => {
    this.toaster.success('Account Deleted Successfully.');
    this.listService.fetchChartAccounts();
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

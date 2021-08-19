import { AccountService, ListService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../../fleet/constants';
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
  constructor(private accountService: AccountService, private toaster: ToastrService, private listService: ListService) { }

  ngOnInit() {
    // this.listService.fetchChartAccounts();
    // this.accounts = this.listService.accountsList;
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
    this.parentMessage = '';
    this.modalTitle = 'Add Account';
    $('#addAccountModal').modal('show');
  }
  editAccount(actID: any) {
    this.parentMessage = actID;
    this.modalTitle = 'Edit Account';
    $('#addAccountModal').modal('show');
  }
  searchFilter() {
    this.lastItemSK = '';
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
     this.searchAccounts(name, type);
    }
  }
  searchAccounts(actName: string, actType: null) {
    this.accountService.getData(`chartAc/paging?actName=${actName}&actType=${actType}`).subscribe((res: any) => {
      this.accounts = res;
      if (this.accounts.length === 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
    });

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
      this.accountService.getData(`chartAc?lastKey=${this.lastItemSK}`)
      .subscribe(async (result: any) => {
        if (result.length === 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if (result.length > 0) {
        //  this.accounts = result;
          for (const element of result) {
            const acName =  element.actName.split(' ');
            if (acName[0] === 'cpp' || acName[0] === 'ei') {
                acName[0] = acName[0].toUpperCase();
            }
            element.actName = acName.join(' ');
            this.accounts.push(element);
          }
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
}

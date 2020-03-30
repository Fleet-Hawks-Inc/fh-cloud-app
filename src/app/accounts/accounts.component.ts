import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  title = 'Accounts List';
  accounts;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchAccounts();

  }

  fetchAccounts() {
    this.apiService.getData('accounts')
        .subscribe((result: any) => {
          this.accounts = result.Items;
        });
  }



  deleteAccount(accountID) {
    this.apiService.deleteData('accounts/' + accountID)
        .subscribe((result: any) => {
          this.fetchAccounts();
        })
  }

}

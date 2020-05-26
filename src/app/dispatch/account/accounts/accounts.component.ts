import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import { timer } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  title = 'Accounts List';
  accounts = [];

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchAccounts();

  }

  fetchAccounts() {
    this.apiService.getData('accounts')
        .subscribe({
          complete: () => {
            this.initDataTable();
          },
          error: () => {},
          next: (result: any) => {
            console.log("account result" + result);
            this.accounts = result.Items;
          },
        });
  }



  deleteAccount(accountID) {

     /******** Clear DataTable ************/
     if ($.fn.DataTable.isDataTable('#datatable-default')) {
      $('#datatable-default').DataTable().clear().destroy();
      }
      /******************************/

    this.apiService.deleteData('accounts/' + accountID)
        .subscribe((result: any) => {
          this.fetchAccounts();
        })
  }

  initDataTable() {
    timer(200).subscribe(() => {
      $("#datatable-default").DataTable();
    });
  }

}

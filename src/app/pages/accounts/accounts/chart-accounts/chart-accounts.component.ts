import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-accounts',
  templateUrl: './chart-accounts.component.html',
  styleUrls: ['./chart-accounts.component.css']
})
export class ChartAccountsComponent implements OnInit {
  form;
  account = {};
  constructor() { }

  ngOnInit() {
  }
  addAccount() {
  console.log("account", this.account);
  }
}

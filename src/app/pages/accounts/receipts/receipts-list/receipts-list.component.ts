
import { Component, OnInit } from '@angular/core';

import { AccountService } from './../../../../services';
@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css']
})
export class ReceiptsListComponent implements OnInit {
  dataMessage: string;
  receipts = [];
  constructor(private accountService: AccountService,) {}

  ngOnInit() {
    this.fetchReceipts();
  }

  fetchReceipts() {
    this.accountService.getData('receipts').subscribe((res) => {
    this.receipts = res;
    console.log('this.receipts', this.receipts);
    });
  }
}

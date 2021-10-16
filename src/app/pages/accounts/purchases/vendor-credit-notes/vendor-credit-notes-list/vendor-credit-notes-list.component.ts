import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services';

@Component({
  selector: 'app-vendor-credit-notes-list',
  templateUrl: './vendor-credit-notes-list.component.html',
  styleUrls: ['./vendor-credit-notes-list.component.css']
})
export class VendorCreditNotesListComponent implements OnInit {

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.getCredits();
  }

  getCredits() {
    this.accountService.getData(`vendor-credits`).subscribe(res => {
      console.log('res', res)
    });
  }
}

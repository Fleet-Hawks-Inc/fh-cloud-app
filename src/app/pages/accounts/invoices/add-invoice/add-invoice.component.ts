import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {

  constructor( private accountService: AccountService) { }

  ngOnInit() {
  }
   addInvoice() {
    const data = {
invoiceNo: 1234
    };
     this.accountService.postData(`invoices`, data).subscribe((res) => {
  console.log('res', res);
     });
   }
}

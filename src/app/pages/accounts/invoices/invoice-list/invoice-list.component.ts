import { AccountService, ApiService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
 invoices = [];
 customersObjects = {};
 invNewStatus: string;
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService, ) { }

  ngOnInit() {
    this.fetchInvoices();
    this.fetchCustomersByIDs();
  }
 fetchInvoices() {
   this.accountService.getData('invoices').subscribe((res: any) => {
    console.log('invoices response', res);
    this.invoices = res;
   });
 }
  /*
   * Get all customers's IDs of names from api
   */
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

  deleteInvoice(invID: string) {
    console.log('invoice delete');
    console.log('invID', invID);
    this.accountService.deleteData(`invoices/manual/${invID}`).subscribe(() => {
      this.toaster.success('Invoice Deleted Successfully.');
      this.fetchInvoices();
      });
  }

  changeStatus(invID: string) {
    console.log('invID', invID);
    $('#updateStatusModal').model('show');
  }
}

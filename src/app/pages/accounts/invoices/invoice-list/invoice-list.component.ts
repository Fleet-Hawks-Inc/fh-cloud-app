import { AccountService, ApiService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
declare var $: any;
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  noInvoicesMsg = Constants.NO_RECORDS_FOUND;
  invoices = [];
  customersObjects = {};
  invNewStatus: string;
  invID: string;
  total = 0;
  openInvoices = [];
  openTotal = 0;
  paidInvoices = [];
  paidTotal = 0;
  emailedInvoices = [];
  emailedTotal = 0;
  partiallyPaidInvoices = [];
  partiallyPaidTotal = 0;
  voidedInvoices = [];
  voidedTotal = 0;
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService,) { }

  ngOnInit() {
    this.fetchInvoices();
    this.fetchCustomersByIDs();
  }
  fetchInvoices() {
    this.accountService.getData('invoices').subscribe((res: any) => {
      this.invoices = res;
      this.invoices.map((v: any) => {
        v.invStatus = v.invStatus.replace('_', ' ');
      });
      this.categorizeInvoices();
    });
  }
  categorizeInvoices() {
    if (this.invoices.length > 0) {
      this.findOverDueInvoice(this.openInvoices);
      for (const element of this.invoices) {
        if (element.invStatus === 'open') {
          this.openTotal = this.openTotal + element.totalAmount;
          this.openTotal = +(this.openTotal).toFixed(2);
          this.openInvoices.push(element);
          this.findOverDueInvoice(this.openInvoices);
        } else if (element.invStatus === 'paid') {
          this.paidTotal = this.paidTotal + element.totalAmount;
          this.paidTotal = +(this.paidTotal).toFixed(2);
          this.paidInvoices.push(element);
        } else if (element.invStatus === 'emailed') {
          this.emailedTotal = this.emailedTotal + element.totalAmount;
          this.emailedTotal = +(this.emailedTotal).toFixed(2);
          this.emailedInvoices.push(element);
        } else if (element.invStatus === 'partially_paid') {
          this.partiallyPaidTotal = this.partiallyPaidTotal + element.totalAmount;
          this.partiallyPaidTotal = +(this.partiallyPaidTotal).toFixed(2);
          this.partiallyPaidInvoices.push(element);
        } else if (element.invStatus === 'voided') {
          this.voidedTotal = this.voidedTotal + element.totalAmount;
          this.voidedTotal = +(this.voidedTotal).toFixed(2);
          this.voidedInvoices.push(element);
        }
      }
      this.total = this.openTotal + this.paidTotal + this.emailedTotal + this.partiallyPaidTotal + this.voidedTotal;
      this.total = +(this.total).toFixed(2);
    }
  }
  findOverDueInvoice(openInvoices: any) {
    for (const operator of openInvoices) {
      const invDate = Date.parse(operator.txnDate);
      const dueDate = Date.parse(operator.invDueDate);
      console.log('invDate', invDate);
      console.log('dueDate', dueDate);
      console.log('operator.invStatus', operator.invStatus);
      if (dueDate >= invDate) {
        delete operator.invStatus;
        operator[`invStatus`] = 'overdue';
      } else {
        operator[`invStatus`] = 'open';
      }

    }
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
    this.accountService.deleteData(`invoices/manual/${invID}`).subscribe(() => {
      this.toaster.success('Invoice Deleted Successfully.');
      this.fetchInvoices();
    });
  }

  changeStatus(invID: string) {
    this.invID = invID;
    $('#updateStatusModal').modal('show');
  }

  updateInvStatus() {
    this.accountService.getData(`invoices/status/${this.invID}/${this.invNewStatus}`).subscribe(() => {
      this.toaster.success('Invoice Status Updated Successfully.');
      $('#updateStatusModal').modal('hide');
      this.fetchInvoices();
    });
  }
}

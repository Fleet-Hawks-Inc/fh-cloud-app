import { AccountService, ApiService } from '../../../../services';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from '../../../fleet/constants';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  dataMessage = Constants.NO_RECORDS_FOUND;
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

  // Order Invoice
  orderInvoices = [];
  openOrderInvoices = [];
  paidOrderInvoices = [];
  emailedOrderInvoices = [];
  partiallyPaidOrderInvoices = [];
  voidedOrderInvoices = [];
  invGenStatus: boolean;
  filter = {
    startDate: null,
    endDate: null,
    invNo: null
  };
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService, private router: Router) { }

  ngOnInit() {
    this.fetchCustomersByIDs();
    this.fetchInvoices();
  }
  fetchInvoices() {
    this.accountService.getData('order-invoice').subscribe((res: any) => {
      this.orderInvoices = res;
      this.orderInvoices.map((v: any) => {
        v.invStatus = v.invStatus.replace('_', ' ');
      });
      this.categorizeOrderInvoices(this.orderInvoices);
    });

    this.accountService.getData('invoices').subscribe((res: any) => {
      this.invoices = res;
      this.invoices.map((v: any) => {
        v.invStatus = v.invStatus.replace('_', ' ');
      });
      this.categorizeInvoices(this.invoices);
    });

  }
  routeFn(invID: string, type: string) {
    if (type === 'manual') {
      this.router.navigateByUrl(`/accounts/invoices/detail/${invID}`);
    } else {
      this.router.navigateByUrl(`/accounts/invoices/load-invoice-detail/${invID}`);
    }
  }
  categorizeOrderInvoices(invoices: any) {
    if (invoices.length > 0) {
      for (const element of invoices) {
        if (element.invStatus === 'open') {
          this.openTotal = this.openTotal + element.balance;
          this.openTotal = +(this.openTotal).toFixed(2);
          this.openOrderInvoices.push(element);
        } else if (element.invStatus === 'paid') {
          this.paidTotal = this.paidTotal + element.finalAmount;
          this.paidTotal = +(this.paidTotal).toFixed(2);
          this.paidOrderInvoices.push(element);
        } else if (element.invStatus === 'emailed') {
          this.emailedTotal = this.emailedTotal + element.balance;
          this.emailedTotal = +(this.emailedTotal).toFixed(2);
          this.emailedOrderInvoices.push(element);
        } else if (element.invStatus === 'partially paid') {
          this.partiallyPaidTotal = this.partiallyPaidTotal + element.balance;
          this.partiallyPaidTotal = +(this.partiallyPaidTotal).toFixed(2);
          this.partiallyPaidOrderInvoices.push(element);
        } else if (element.invStatus === 'voided') {
          this.voidedTotal = this.voidedTotal + element.finalAmount;
          this.voidedTotal = +(this.voidedTotal).toFixed(2);
          this.voidedOrderInvoices.push(element);
        }
      }
      this.total = this.openTotal + this.paidTotal + this.emailedTotal + this.partiallyPaidTotal + this.voidedTotal;
      this.total = +(this.total).toFixed(2);
    }
  }
  categorizeInvoices(invoices: any) {
    if (invoices.length > 0) {
      this.findOverDueInvoice(this.openInvoices);
      for (const element of invoices) {
        if (element.invStatus === 'open') {
          this.openTotal = this.openTotal + element.balance;
          this.openTotal = +(this.openTotal).toFixed(2);
          this.openInvoices.push(element);
          this.findOverDueInvoice(this.openInvoices);
        } else if (element.invStatus === 'paid') {
          this.paidTotal = this.paidTotal + element.finalAmount;
          this.paidTotal = +(this.paidTotal).toFixed(2);
          this.paidInvoices.push(element);
        } else if (element.invStatus === 'emailed') {
          this.emailedTotal = this.emailedTotal + element.balance;
          this.emailedTotal = +(this.emailedTotal).toFixed(2);
          this.emailedInvoices.push(element);
        } else if (element.invStatus === 'partially paid') {
          this.partiallyPaidTotal = this.partiallyPaidTotal + element.balance;
          this.partiallyPaidTotal = +(this.partiallyPaidTotal).toFixed(2);
          this.partiallyPaidInvoices.push(element);
        } else if (element.invStatus === 'voided') {
          this.voidedTotal = this.voidedTotal + element.finalAmount;
          this.voidedTotal = +(this.voidedTotal).toFixed(2);
          this.voidedInvoices.push(element);
        }
      }
      this.total = this.openTotal + this.paidTotal + this.emailedTotal + this.partiallyPaidTotal + this.voidedTotal;
      this.total = +(this.total).toFixed(2);
    }
  }
  findOverDueInvoice(invoices: any) {
    for (const operator of invoices) {
      const curDate = new Date().getTime();
      const dueDate = Date.parse(operator.invDueDate);
      if (curDate >= dueDate) {
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

  voidInvoice(invID: string) {
    if (confirm('Are you sure you want to void?') === true) {
      this.accountService.deleteData(`invoices/manual/${invID}`).subscribe(() => {
        this.toaster.success('Invoice Deleted Successfully.');
        this.fetchInvoices();
      });
    }
  }

  changeStatus(invID: string) {
    this.invID = invID;
    $('#updateStatusModal').modal('show');
  }
  editFn(invID: string) {
    this.router.navigateByUrl(`/accounts/invoices/edit/${invID}`);
  }
  updateInvStatus() {
    this.accountService.getData(`invoices/status/${this.invID}/${this.invNewStatus}`).subscribe(() => {
      this.toaster.success('Invoice Status Updated Successfully.');
      this.fetchInvoices();
      $('#updateStatusModal').modal('hide');
    });
  }
  voidOrderInvoice(invID: string, orderID: string) {
    if (confirm('Are you sure you want to void?') === true) {
      this.accountService.deleteData(`order-invoice/delete/${invID}`).subscribe(() => {
        this.invGenStatus = false;
        this.apiService.getData(`orders/invoiceStatus/${orderID}/${this.invGenStatus}`).subscribe((res) => {
          if (res) {
            this.toaster.success('Invoice Voided Successfully.');
          }
        });
        this.fetchInvoices();
      });
    }

  }

  searchFilter() {
    if (this.filter.endDate !== null || this.filter.startDate !== null || this.filter.invNo !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchDetails();
    }
  }

  fetchDetails() {
    this.accountService.getData(`invoices/paging?invNo=${this.filter.invNo}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`)
      .subscribe((result: any) => {
        this.invoices = result;
      });
    this.accountService.getData(`order-invoice/paging?invNo=${this.filter.invNo}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}`)
      .subscribe((result: any) => {
        this.orderInvoices = result;
      });
  }
  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      invNo: null
    };
    this.total = 0;
    this.openInvoices = [];
    this.openTotal = 0;
    this.paidInvoices = [];
    this.paidTotal = 0;
    this.emailedInvoices = [];
    this.emailedTotal = 0;
    this.partiallyPaidInvoices = [];
    this.partiallyPaidTotal = 0;
    this.voidedInvoices = [];
    this.voidedTotal = 0;
    this.invoices = [];
    this.orderInvoices = [];
    this.fetchInvoices();
  }
}

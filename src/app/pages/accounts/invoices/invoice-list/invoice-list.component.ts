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
  fetchedManualInvoices = [];
  fetchedOrderInvoices = [];
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
  lastItemSK = '';
  lastItemOrderSK = '';
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService, private router: Router) { }

  ngOnInit() {
    this.invoices = [];
    this.orderInvoices = [];
    this.fetchCustomersByIDs();
    this.fetchInvoices();
    this.getInvoices();
  }
  fetchInvoices() {
    this.accountService.getData('order-invoice/all/invoices').subscribe((res: any) => {

      this.fetchedOrderInvoices = res;
      this.getTotalInvoices(this.fetchedOrderInvoices);
    });
    this.accountService.getData('invoices/all/invoices').subscribe((res: any) => {
      this.fetchedManualInvoices = res;
      this.getTotalInvoices(this.fetchedManualInvoices);
    });
  }

  getTotalOrderInvoices(invoices: any) {
    if (invoices.length > 0) {
      for (const element of invoices) {
        if (element.invStatus === 'open') {
          this.openTotal = this.openTotal + Number(element.finalAmount);
          this.openTotal = +(this.openTotal).toFixed(2);
        } else if (element.invStatus === 'paid') {
          this.paidTotal = this.paidTotal + Number(element.finalAmount);
          this.paidTotal = +(this.paidTotal).toFixed(2);
        } else if (element.invStatus === 'emailed') {
          this.emailedTotal = this.emailedTotal + Number(element.finalAmount);
          this.emailedTotal = +(this.emailedTotal).toFixed(2);
        } else if (element.invStatus === 'partially_paid') {
          this.partiallyPaidTotal = this.partiallyPaidTotal + Number(element.finalAmount);
          this.partiallyPaidTotal = +(this.partiallyPaidTotal).toFixed(2);
        } else if (element.invStatus === 'voided') {
          this.voidedTotal = this.voidedTotal + Number(element.finalAmount);
          this.voidedTotal = +(this.voidedTotal).toFixed(2);
        }
      }
      this.total = this.openTotal + this.paidTotal + this.emailedTotal + this.partiallyPaidTotal + this.voidedTotal;
      this.total = +(this.total).toFixed(2);
    }
  }
  getTotalInvoices(invoices: any) {
    if (invoices.length > 0) {
      for (const element of invoices) {
        if (element.invStatus === 'open') {
          this.openTotal = this.openTotal + Number(element.finalAmount);
          this.openTotal = +(this.openTotal).toFixed(2);
        } else if (element.invStatus === 'paid') {
          this.paidTotal = this.paidTotal + Number(element.finalAmount);
          this.paidTotal = +(this.paidTotal).toFixed(2);
        } else if (element.invStatus === 'emailed') {
          this.emailedTotal = this.emailedTotal + Number(element.finalAmount);
          this.emailedTotal = +(this.emailedTotal).toFixed(2);
        } else if (element.invStatus === 'partially_paid') {
          this.partiallyPaidTotal = this.partiallyPaidTotal + Number(element.finalAmount);
          this.partiallyPaidTotal = +(this.partiallyPaidTotal).toFixed(2);
        } else if (element.invStatus === 'voided') {
          this.voidedTotal = this.voidedTotal + Number(element.finalAmount);
          this.voidedTotal = +(this.voidedTotal).toFixed(2);
        }
      }
      this.total = this.openTotal + this.paidTotal + this.emailedTotal + this.partiallyPaidTotal + this.voidedTotal;
      this.total = +(this.total).toFixed(2);
    }
  }
  getInvoices(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.invoices = [];
      this.paidInvoices = [];
      this.emailedInvoices = [];
      this.partiallyPaidInvoices = [];
      this.voidedInvoices = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`invoices?lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            for (const element of result) {
              this.invoices.push(element);
            }
            if (this.invoices[this.invoices.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(this.invoices[this.invoices.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            this.invoices.map((v: any) => {
              v.invStatus = v.invStatus.replace('_', ' ');
            });
            this.categorizeInvoices(this.invoices);
          }
        });
    }
    // Order invoices
    if (refresh === true) {
      this.lastItemOrderSK = '';
      this.orderInvoices = [];
      this.openOrderInvoices = [];
      this.paidOrderInvoices = [];
      this.emailedOrderInvoices = [];
      this.partiallyPaidOrderInvoices = [];
      this.voidedOrderInvoices = [];
    }
    if (this.lastItemOrderSK !== 'end') {
      this.accountService.getData(`order-invoice?lastKey=${this.lastItemOrderSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.dataMessage = Constants.NO_RECORDS_FOUND;
          }
          if (result.length > 0) {
            for (const element of result) {
              this.orderInvoices.push(element);
            }
            if (this.orderInvoices[this.orderInvoices.length - 1].sk !== undefined) {
              this.lastItemOrderSK = encodeURIComponent(this.orderInvoices[this.orderInvoices.length - 1].sk);
            } else {
              this.lastItemOrderSK = 'end';
            }
            this.orderInvoices.map((v: any) => {
              v.invStatus = v.invStatus.replace('_', ' ');
            });
            this.categorizeOrderInvoices(this.orderInvoices);
          }
        });
    }

  }
  onScroll() {
    this.getInvoices();
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
          this.openOrderInvoices.push(element);
        } else if (element.invStatus === 'paid') {
          this.paidOrderInvoices.push(element);
        } else if (element.invStatus === 'emailed') {
          this.emailedOrderInvoices.push(element);
        } else if (element.invStatus === 'partially paid') {
          this.partiallyPaidOrderInvoices.push(element);
        } else if (element.invStatus === 'voided') {
          this.voidedOrderInvoices.push(element);
        }
      }
    }
  }
  categorizeInvoices(invoices: any) {
    if (invoices.length > 0) {
      this.findOverDueInvoice(this.openInvoices);
      for (const element of invoices) {
        if (element.invStatus === 'open') {
          this.openInvoices.push(element);
          this.findOverDueInvoice(this.openInvoices);
        } else if (element.invStatus === 'paid') {
          this.paidInvoices.push(element);
        } else if (element.invStatus === 'emailed') {
          this.emailedInvoices.push(element);
        } else if (element.invStatus === 'partially paid') {
          this.partiallyPaidInvoices.push(element);
        } else if (element.invStatus === 'voided') {
          this.voidedInvoices.push(element);
        }
      }
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
    this.lastItemSK = '';
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
    this.lastItemSK = '';
    this.lastItemOrderSK = '';
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
    this.fetchedManualInvoices = [];
    this.fetchedOrderInvoices = [];
    this.fetchInvoices();
    this.getInvoices();

  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';
import { OverlayPanel } from "primeng/overlaypanel";
@Component({
  selector: 'app-sales-invoices-list',
  templateUrl: './sales-invoices-list.component.html',
  styleUrls: ['./sales-invoices-list.component.css']
})
export class SalesInvoicesListComponent implements OnInit {
  @ViewChild("op") overlaypanel: OverlayPanel;
  isSearch: boolean = false;
  dataMessage = Constants.FETCHING_DATA;

  allInvoices = [];

  filterData = {
    customerID: null,
    startDate: '',
    endDate: '',
    lastItemSK: ''
  }
  lastItemSK = '';
  loaded = false;

  customersObjects: any = {};
  emailDisabled = false;
  _selectedColumns: any[];
  dataColumns: any[];
  get = _.get;
  find = _.find;
  constructor(public accountService: AccountService, private toaster: ToastrService, public apiService: ApiService) { }

  ngOnInit() {
    this.fetchSales();
    this.dataColumns = [
      { field: 'txnDate', header: 'Date', type: "text" },
      { field: 'sInvNo', header: 'Sales Invoice#', type: "text" },
      { field: 'sRef', header: 'Reference#', type: "text" },
      { field: 'customerName', header: 'Customer', type: "text" },
      { field: 'dueDate', header: 'Due Date', type: "text" },
      { field: 'total.finalTotal', header: 'Amount', type: "text" },
      { field: 'payStatus', header: 'Payment Status', type: "text" },
      { field: 'status', header: 'Status', type: "text" },
    ];


    this._selectedColumns = this.dataColumns;
    this.setToggleOptions()
  }
  setToggleOptions() {
    this.selectedColumns = this.dataColumns;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.dataColumns.filter(col => val.includes(col));
  }


  /*
* Get all customers's IDs of names from api
*/
  voidOrderInvoice(i: any, saleID: string) {
    if (confirm("Are you sure you want to void?") === true) {
      this.accountService
        .deleteData(`sales-invoice/delete/${saleID}`)
        .subscribe((res) => {
          if (res) {
            this.allInvoices[i].status = 'voided';
            this.allInvoices[i].payStatus = '';
          }
        })
    }
  }


  async fetchSales(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.allInvoices = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`sales-invoice/paging?customer=${this.filterData.customerID}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.isSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true;

          }

          if (result.length > 0) {
            this.isSearch = false;
            result.map((v) => {
              this.allInvoices.push(v);
            });

            if (this.allInvoices[this.allInvoices.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(this.allInvoices[this.allInvoices.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            this.loaded = true;

          }
        });
    }

  }

  searchSale() {
    if (this.filterData.customerID !== '' || this.filterData.startDate !== '' || this.filterData.endDate !== '' || this.filterData.lastItemSK !== '') {
      if (
        this.filterData.startDate !== '' &&
        this.filterData.endDate === ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (
        this.filterData.startDate === '' &&
        this.filterData.endDate !== ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        return false;
      } else if (this.filterData.startDate > this.filterData.endDate) {
        this.toaster.error('Start date should be less then end date');
        return false;
      } else {
        this.isSearch = true;
        this.allInvoices = [];
        this.lastItemSK = '';
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchSales();
      }

    }
  }

  resetFilter() {
    this.isSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filterData = {
      customerID: null,
      startDate: '',
      endDate: '',
      lastItemSK: ''
    };
    this.lastItemSK = '';
    this.allInvoices = [];
    this.fetchSales();
  }

  deleteSale(id: string) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.accountService.deleteData(`sales-invoice/delete/${id}`).subscribe(res => {
        if (res) {
          this.dataMessage = Constants.FETCHING_DATA;
          this.allInvoices = [];
          this.lastItemSK = '';
          this.fetchSales();
          this.toaster.success('Order deleted successfully!')
        }
      });
    }
  }

  onScroll() {
    if (this.loaded) {
      this.fetchSales();
    }
    this.loaded = false;
  }

  async sendConfirmationEmail(i: any, saleID: any) {

    this.emailDisabled = true;
    let result: any = await this.accountService
      .getData(`sales-invoice/send/confirmation-email/${saleID}`)
      .toPromise();
    this.emailDisabled = false;
    if (result) {
      this.toaster.success("Email sent successfully");
      this.allInvoices[i].status = 'sent';
    } else {
      this.toaster.error("Something went wrong.");
    }
  }
  clear(table: Table) {
    table.clear();
  }
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import * as _ from "lodash";
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.css']
})
export class SalesOrderListComponent implements OnInit {
  @ViewChild('dt') table: Table;
  isSearch: boolean = false;
  dataMessage = Constants.FETCHING_DATA;

  allSales = [];

  filterData = {
    category: null,
    unit: '',
    status: null,
    startDate: '',
    endDate: '',
  }
  lastItemSK = '';

  customersObjects: any = {};
  loaded = false;

  allStatus = [
    {
      name: 'Open',
      value: 'open'
    },
    {
      name: 'Sent',
      value: 'sent'
    },
    {
      name: 'Closed',
      value: 'closed'
    },
    {
      name: 'Voided',
      value: 'voided'
    }
  ];
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
      { field: 'sOrNo', header: 'Sales Order#', type: "text" },
      { field: 'sRef', header: 'Reference#', type: "text" },
      { field: 'customerName', header: 'Customer', type: "text" },
      { field: 'shipDate', header: 'Shipment Date', type: "text" },
      { field: 'total.finalTotal', header: 'Amount', type: "text" },
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

  getSales() {
    this.accountService.getData(`sales-orders`).subscribe(res => {
      this.allSales = res;
    });
  }

  deleteSale(id: string) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.accountService.deleteData(`sales-orders/delete/${id}`).subscribe(res => {
        if (res) {
          this.toaster.success('Order deleted successfully!')
          this.getSales();
        }
      });
    }
  }

  resetUnit() {
    this.filterData.unit = '';
  }

  async fetchSales(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = '';
      this.allSales = [];
    }
    if (this.lastItemSK !== 'end') {
      if (
        this.filterData.unit !== null &&
        this.filterData.unit !== ""
      ) {
        searchParam = this.filterData.category === 'saleOrder' ? encodeURIComponent(`"${this.filterData.unit}"`) : `${this.filterData.unit}`;
      }

      this.accountService.getData(`sales-orders/paging?category=${this.filterData.category}&unit=${searchParam}&status=${this.filterData.status}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.isSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
            this.loaded = true
          }

          if (result.length > 0) {
            this.isSearch = false;
            result.map((v) => {
              this.allSales.push(v);
            });

            if (this.allSales[this.allSales.length - 1].sk !== undefined) {
              this.lastItemSK = encodeURIComponent(this.allSales[this.allSales.length - 1].sk);
            } else {
              this.lastItemSK = 'end';
            }
            this.loaded = true;

          }
        }, err => {
          this.isSearch = true;
        });
    }

  }

  searchSale() {
    if (this.filterData.category !== null || this.filterData.unit !== '' || this.filterData.status !== null || this.filterData.startDate !== '' || this.filterData.endDate !== '') {
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
        this.allSales = [];
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
      category: null,
      unit: '',
      status: null,
      startDate: '',
      endDate: '',
    };
    this.lastItemSK = '';
    this.allSales = [];
    this.fetchSales();
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
      .getData(`sales-orders/send/confirmation-email/${saleID}`)
      .toPromise();
    this.emailDisabled = false;
    if (result) {
      this.allSales[i].status = 'sent';
      this.toaster.success("Email sent successfully");
    } else {
      this.toaster.error("Something went wrong.");
    }
  }
  clear(table: Table) {
    table.clear();
  }
}

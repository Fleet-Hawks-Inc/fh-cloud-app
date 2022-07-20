import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService } from 'src/app/services';

@Component({
  selector: 'app-sales-invoices-list',
  templateUrl: './sales-invoices-list.component.html',
  styleUrls: ['./sales-invoices-list.component.css']
})
export class SalesInvoicesListComponent implements OnInit {

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

  constructor(public accountService: AccountService, private toaster: ToastrService, public apiService: ApiService) { }

  ngOnInit() {
    this.fetchSales();
    this.fetchCustomersByIDs();
  }


  /*
* Get all customers's IDs of names from api
*/
  fetchCustomersByIDs() {
    this.apiService.getData('contacts/get/list').subscribe((result: any) => {
      this.customersObjects = result;
    });
  }

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

}

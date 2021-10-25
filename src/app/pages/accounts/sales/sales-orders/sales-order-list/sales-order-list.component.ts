import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';


@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.css']
})
export class SalesOrderListComponent implements OnInit {
  isSearch: boolean = false;
  dataMessage = Constants.FETCHING_DATA;

  allSales = [];

  filterData = {
    customerID: null,
    startDate: '',
    endDate: '',
    lastItemSK: ''
  }
  lastItemSK = '';

  customersObjects: any = {};

  constructor(public accountService: AccountService, private toaster: ToastrService, public apiService: ApiService) { }

  ngOnInit() {
    this.fetchCustomersByIDs();
    this.fetchSales();
  }

  getSales() {
    this.accountService.getData(`sales-orders`).subscribe(res => {
      this.allSales = res;
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


  deleteSale(id: string) {
    if (confirm('Are you sure you want to delete this order?') === true) {
      this.accountService.deleteData(`sales-orders/delete/${id}`).subscribe(res => {
        if (res) {
          this.toaster.success('Order deleted successfully!')
          this.getSales();
        }
      });
    }
  }

  async fetchSales(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.allSales = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`sales-orders/paging?customer=${this.filterData.customerID}&startDate=${this.filterData.startDate}&endDate=${this.filterData.endDate}&lastKey=${this.lastItemSK}`)
        .subscribe(async (result: any) => {
          if (result.length === 0) {
            this.isSearch = false;
            this.dataMessage = Constants.NO_RECORDS_FOUND;
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
            // this.loaded = true;

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
      customerID: null,
      startDate: '',
      endDate: '',
      lastItemSK: ''
    };
    this.lastItemSK = '';
    this.allSales = [];
    this.fetchSales();
  }

}

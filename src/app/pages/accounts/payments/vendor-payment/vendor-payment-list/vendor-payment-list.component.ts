import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Constants from 'src/app/pages/fleet/constants';
import { AccountService, ApiService, ListService } from 'src/app/services';
@Component({
  selector: 'app-vendor-payment-list',
  templateUrl: './vendor-payment-list.component.html',
  styleUrls: ['./vendor-payment-list.component.css']
})
export class VendorPaymentListComponent implements OnInit {
  dataMessage: string = Constants.FETCHING_DATA;
  payments = [];
  vendors = [];
  filter = {
    startDate: null,
    endDate: null,
    paymentNo: null
  };
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastItemSK = '';
  loaded = false;
  disableSearch = false;
  constructor(private toaster: ToastrService,
    private accountService: AccountService,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchPayments();
    this.fetchVendors();
  }

  fetchPayments(refresh?: boolean) {
    let searchParam = null;
    if (refresh === true) {
      this.lastItemSK = '';
      this.payments = [];
    }
    if (this.lastItemSK !== 'end') {
      if (this.filter.paymentNo !== null && this.filter.paymentNo !== '') {
        searchParam = encodeURIComponent(`"${this.filter.paymentNo}"`);
      } else {
        searchParam = null;
      }
      this.accountService.getData(`vendor-payments/paging?paymentNo=${searchParam}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&lastKey=${this.lastItemSK}`).subscribe((result: any) => {
        if (result.length === 0) {
          this.disableSearch = false;
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if (result.length > 0) {
          this.disableSearch = false;
          if (result[result.length - 1].sk !== undefined) {
            this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
          } else {
            this.lastItemSK = 'end';
          }

          result.map((v) => {
            v.url = `/accounts/payments/vendor-payments/detail/${v.paymentID}`;
            v.payMode = v.payMode.replace('_', ' ');
            this.payments.push(v);
          });
          this.loaded = true;
        }
      });
    }
  }
  fetchVendors() {
    this.apiService.getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      });
  }
  searchFilter() {
    if (this.filter.paymentNo !== '' || this.filter.endDate !== null || this.filter.startDate !== null) {
      this.disableSearch = true;
      if (
        this.filter.startDate !== '' &&
        this.filter.endDate === ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        this.disableSearch = false;
        return false;
      } else if (
        this.filter.startDate === '' &&
        this.filter.endDate !== ''
      ) {
        this.toaster.error('Please select both start and end dates.');
        this.disableSearch = false;
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error('Start date should be less then end date');
        this.disableSearch = false;
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.payments = [];
        this.lastItemSK = '';
        this.fetchPayments();
      }
    }
  }

  resetFilter() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      paymentNo: null
    };
    this.payments = [];
    this.lastItemSK = '';
    this.fetchPayments();
  }

  onScroll() {
    if (this.loaded) {
      this.fetchPayments();
    }
    this.loaded = false;
  }

  refreshData() {
    this.disableSearch = true;
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      startDate: null,
      endDate: null,
      paymentNo: null
    };
    this.payments = [];
    this.lastItemSK = '';
    this.fetchPayments();
  }

}

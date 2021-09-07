import { Component, OnInit } from '@angular/core';
import { AccountService, ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import  Constants  from '../../../fleet/constants';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.css']
})
export class IncomeListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  incomeAccounts = [];
  customers = [];
  categories = [];
  invoices = [];
  filter = {
    amount: '',
    startDate: null,
    endDate: null,
    categoryID: null,
  };
  searchDisabled = false;
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  lastItemSK = '';
  loaded = false;
  constructor(private accountService: AccountService, private apiService: ApiService, private router: Router, private toaster: ToastrService) { }

  ngOnInit() {
    this.fetchAccounts();
   // this.fetchCustomers();
    this.fetchIncomeCategories();
   // this.fetchInvoices();
  }

  fetchAccounts(refresh?: boolean) {
    if (refresh === true) {
      this.lastItemSK = '';
      this.incomeAccounts = [];
    }
    if (this.lastItemSK !== 'end') {
      this.accountService.getData(`income/paging?amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&category=${this.filter.categoryID}&lastKey=${this.lastItemSK}`)
      .subscribe((result: any) => {
        if(result.length == 0) {
          this.dataMessage = Constants.NO_RECORDS_FOUND;
        }
        if(result.length > 0) {
         // this.searchDisabled = false;
          if (result[result.length - 1].sk !== undefined) {
            this.lastItemSK = encodeURIComponent(result[result.length - 1].sk);
          } else {
            this.lastItemSK = 'end';
          }
          result.map((v) => {
            if(v.paymentMode === 'creditCard') {
              v.paymentMode = 'Credit Card';
            } else if(v.paymentMode === 'debitCard') {
              v.paymentMode = 'Debit Card';
            } else if(v.paymentMode === 'demandDraft') {
              v.paymentMode = 'Demand Card';
            } else if(v.paymentMode === 'eft') {
              v.paymentMode = 'EFT';
            } else if(v.paymentMode === 'cash') {
              v.paymentMode = 'Cash';
            } else if(v.paymentMode === 'cheque') {
              v.paymentMode = 'Cheque';
            }
            this.incomeAccounts.push(v);
          });
          this.loaded = true;
        }

      });
    }
  }

  fetchCustomers() {
    this.apiService.getData(`contacts/get/list`)
      .subscribe((result: any) => {
        this.customers = result;
      })
  }

  deleteIncome(incomeID) {
    if (confirm('Are you sure you want to delete?') === true) {
      this.accountService.getData(`income/delete/${incomeID}`)
      .subscribe((result: any) => {
        if (result !== undefined) {
          this.dataMessage = Constants.FETCHING_DATA;
          this.lastItemSK = '';
          this.incomeAccounts = [];
          this.fetchAccounts();
          this.toaster.success('Income transaction deleted successfully.');
        }
      });
    }
  }

  fetchIncomeCategories() {
    this.accountService.getData(`income/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }

  fetchInvoices() {
    this.accountService.getData('invoices/get/list').subscribe((res: any) => {
      this.invoices = res;
    });
  }

  searchFilter() {
    if(this.filter.amount !== '' || this.filter.categoryID !== null || this.filter.endDate !== null || this.filter.startDate !== null) {
     // this.searchDisabled = true;
      if (
        this.filter.startDate != "" &&
        this.filter.endDate == ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (
        this.filter.startDate == "" &&
        this.filter.endDate != ""
      ) {
        this.toaster.error("Please select both start and end dates.");
        return false;
      } else if (this.filter.startDate > this.filter.endDate) {
        this.toaster.error("Start date should be less then end date");
        return false;
      } else {
        this.dataMessage = Constants.FETCHING_DATA;
        this.lastItemSK = '';
        this.incomeAccounts = [];
        this.fetchAccounts();
      }
    }
  }

  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      amount: '',
      startDate: null,
      endDate: null,
      categoryID: null,
    }
    this.lastItemSK = '';
    this.incomeAccounts = [];
    this.fetchAccounts();
  }

  onScroll() {
    if (this.loaded) {
    this.fetchAccounts();
    }
  }

  refreshData() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      amount: '',
      startDate: null,
      endDate: null,
      categoryID: null,
    }
    this.lastItemSK = '';
    this.incomeAccounts = [];
    this.fetchAccounts();
  }
}

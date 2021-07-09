import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import  Constants  from '../../../fleet/constants'; 

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {

  dataMessage: string = Constants.FETCHING_DATA;
  noRecrdMessage: string = Constants.NO_RECORDS_FOUND;
  expenses = [];
  vendors = [];
  categories = [];
  dateMinLimit = { year: 1950, month: 1, day: 1 };
  date = new Date();
  futureDatesLimit = { year: this.date.getFullYear() + 30, month: 12, day: 31 };
  filter = {
    amount: '',
    startDate: null,
    endDate: null,
    typeId: null,
  }
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService) { }

  ngOnInit() {
    this.fetchExpenses();
    this.fetchVendors();
    this.fetchExpenseCategories();
  }

  fetchExpenses() {
    this.accountService.getData(`expense/paging?amount=${this.filter.amount}&startDate=${this.filter.startDate}&endDate=${this.filter.endDate}&category=${this.filter.typeId}`).subscribe((res: any) => {
      if(res.length == 0) {
        this.dataMessage = Constants.NO_RECORDS_FOUND;
      }
      this.expenses = res;
    });
  }

  fetchVendors() {
    this.apiService.getData(`contacts/get/list/vendor`)
      .subscribe((result: any) => {
        this.vendors = result;
      })
  }

  deleteExpense(expenseID) {
    this.accountService.getData(`expense/delete/${expenseID}`)
      .subscribe((result: any) => {
        this.dataMessage = Constants.FETCHING_DATA;
        this.fetchExpenses();
        this.toaster.success('Expense transaction deleted successfully.');
      })
  }

  fetchExpenseCategories() {
    this.accountService.getData(`expense/categories/list`)
      .subscribe((result: any) => {
        this.categories = result;
      })
  }

  searchFilter() {
    if(this.filter.amount !== '' || this.filter.typeId !== null || this.filter.endDate !== null || this.filter.startDate !== null) {
      this.dataMessage = Constants.FETCHING_DATA;
      this.fetchExpenses();
    }
  }

  resetFilter() {
    this.dataMessage = Constants.FETCHING_DATA;
    this.filter = {
      amount: '',
      startDate: null,
      endDate: null,
      typeId: null,
    }
    this.fetchExpenses();

  }
}

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
  expenses = [];
  vendors = [];
  categories = [];
  constructor(private accountService: AccountService, private apiService: ApiService, private toaster: ToastrService) { }

  ngOnInit() {
    this.fetchExpenses();
    this.fetchVendors();
    this.fetchExpenseCategories();
  }

  fetchExpenses() {
    this.accountService.getData('expense').subscribe((res: any) => {
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
}

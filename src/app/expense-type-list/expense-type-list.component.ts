import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-expense-type-list',
  templateUrl: './expense-type-list.component.html',
  styleUrls: ['./expense-type-list.component.css']
})
export class ExpenseTypeListComponent implements OnInit {
  title = 'Expense Type List';
  expenseTypes;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {

    this.fetchExpenseTypes();

  }

  fetchExpenseTypes() {
    this.apiService.getData('expenseTypes')
        .subscribe((result: any) => {
          this.expenseTypes = result.Items;
        });
  }

  deleteExpenseType(expenseTypeId) {
    this.apiService.deleteData('expenseTypes/' + expenseTypeId)
        .subscribe((result: any) => {
          this.fetchExpenseTypes();
        })
  }

}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.css']
})
export class ExpensesListComponent implements OnInit {
  title = 'Expenses List';
  expenses;

  constructor(private apiService: ApiService,
              private router: Router) { }

  ngOnInit() {
    this.fetchExpenses();
  }

  fetchExpenses() {
    this.apiService.getData('expenses')
        .subscribe((result: any) => {
          this.expenses = result.Items;
        });
  }



  deleteExpenses(expenseId) {
    this.apiService.deleteData('expenses/' + expenseId)
        .subscribe((result: any) => {
          this.fetchExpenses();
        })
  }

}

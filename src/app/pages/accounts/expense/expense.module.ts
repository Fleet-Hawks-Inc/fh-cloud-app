import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'list', component: ExpenseListComponent},
  { path: 'add', component: AddExpenseComponent},
  { path: 'detail', component: ExpenseDetailComponent},

];

@NgModule({
  declarations: [AddExpenseComponent, ExpenseListComponent, ExpenseDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ExpenseModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IncomeListComponent } from './income-list/income-list.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { IncomeDetailComponent } from './income-detail/income-detail.component';

const routes: Routes = [
  { path: 'list', component: IncomeListComponent},
  { path: 'add', component: AddIncomeComponent},
  { path: 'detail', component: IncomeDetailComponent},
];

@NgModule({
  declarations: [IncomeListComponent, AddIncomeComponent, IncomeDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class IncomeModule { }

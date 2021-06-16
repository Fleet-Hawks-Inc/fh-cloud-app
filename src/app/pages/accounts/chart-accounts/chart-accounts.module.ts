import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { ChartOfAccountsDetailsComponent } from './chart-of-accounts-details/chart-of-accounts-details.component';

const routes: Routes = [
  { path: 'list', component: ChartOfAccountsComponent},
  { path: 'detail', component: ChartOfAccountsDetailsComponent},

];

@NgModule({
  declarations: [ChartOfAccountsComponent, ChartOfAccountsDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ChartAccountsModule { }

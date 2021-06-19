import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { ChartOfAccountsDetailsComponent } from './chart-of-accounts-details/chart-of-accounts-details.component';
import { AddAccountComponent } from '../add-account/add-account.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: 'list', component: ChartOfAccountsComponent},
  { path: 'detail/:actID', component: ChartOfAccountsDetailsComponent},

];

@NgModule({
  declarations: [ChartOfAccountsComponent, ChartOfAccountsDetailsComponent,AddAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]

})
export class ChartAccountsModule { }

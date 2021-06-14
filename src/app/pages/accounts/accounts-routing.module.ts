import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: 'chart-accounts',
    loadChildren: () => import('./chart-accounts/chart-accounts.module').then((m) => m.ChartAccountsModule) , },
    {
      path: 'income',
      loadChildren: () => import('./income/income.module').then((m) => m.IncomeModule) , },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}

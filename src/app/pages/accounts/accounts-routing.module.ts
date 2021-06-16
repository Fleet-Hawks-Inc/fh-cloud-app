import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  { path: 'overview', component: HomeComponent },
  {
    path: 'chart-accounts',
    loadChildren: () => import('./chart-accounts/chart-accounts.module').then((m) => m.ChartAccountsModule),
  },
  {
    path: 'income',
    loadChildren: () => import('./income/income.module').then((m) => m.IncomeModule),
  },
  {
    path: 'expense',
    loadChildren: () => import('./expense/expense.module').then((m) => m.ExpenseModule),
  },
  {
    path: 'manual-journal',
    loadChildren: () => import('./manual-journal/manual-journal.module').then((m) => m.ManualJournalModule),
  },
  {
    path: 'invoices',
    loadChildren: () => import('./invoices/invoices.module').then((m) => m.InvoicesModule),
  },
  {
    path: 'receipts',
    loadChildren: () => import('./receipts/receipts.module').then((m) => m.ReceiptsModule),
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then((m) => m.SalesModule),
  },
  {
    path: 'purchases',
    loadChildren: () => import('./purchases/purchases.module').then((m) => m.PurchasesModule),
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then((m) => m.PaymentsModule),
  },
  {
    path: 'settlements',
    loadChildren: () => import('./settlements/settlements.module').then((m) => m.SettlementsModule),
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then((m) => m.TransactionsModule),
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/account-reports.module').then((m) => m.AccountReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule { }

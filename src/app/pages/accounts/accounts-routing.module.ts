import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
const routes: Routes = [
  { path: "overview", component: HomeComponent },
  {
    path: "chart-accounts",
    loadChildren: () =>
      import("./chart-accounts/chart-accounts.module").then(
        (m) => m.ChartAccountsModule
      ),
    data: { title: "Chart Accounts" },
  },
  {
    path: "income",
    loadChildren: () =>
      import("./income/income.module").then((m) => m.IncomeModule),
    data: { title: "Income" },
  },
  {
    path: "expense",
    loadChildren: () =>
      import("./expense/expense.module").then((m) => m.ExpenseModule),
    data: { title: "Expense" },
  },
  {
    path: "manual-journal",
    loadChildren: () =>
      import("./manual-journal/manual-journal.module").then(
        (m) => m.ManualJournalModule
      ),
    data: { title: "Manual Journal" },
  },
  {
    path: "invoices",
    loadChildren: () =>
      import("./invoices/invoices.module").then((m) => m.InvoicesModule),
    data: { title: "Invoices" },
  },
  {
    path: "receipts",
    loadChildren: () =>
      import("./receipts/receipts.module").then((m) => m.ReceiptsModule),
    data: { title: "Receipts" },
  },
  {
    path: "sales",
    loadChildren: () =>
      import("./sales/sales.module").then((m) => m.SalesModule),
    data: { title: "Sales" },
  },
  {
    path: "purchases",
    loadChildren: () =>
      import("./purchases/purchases.module").then((m) => m.PurchasesModule),
    data: { title: "Purchases" },
  },
  {
    path: "payments",
    loadChildren: () =>
      import("./payments/payments.module").then((m) => m.PaymentsModule),
    data: { title: "Payments" },
  },
  {
    path: "settlements",
    loadChildren: () =>
      import("./settlements/settlements.module").then(
        (m) => m.SettlementsModule
      ),
    data: { title: "Settlements" },
  },
  {
    path: "transactions",
    loadChildren: () =>
      import("./transactions/transactions.module").then(
        (m) => m.TransactionsModule
      ),
    data: { title: "Transactions" },
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/account-reports.module").then(
        (m) => m.AccountReportsModule
      ),
    data: { title: "Reports" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}

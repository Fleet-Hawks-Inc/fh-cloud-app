import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllInvoicesComponent } from "./invoices/all-invoices/all-invoices.component";
import { ChartAccountsComponent } from "./accounts/chart-accounts/chart-accounts.component";
import { DriverPaymentsComponent } from "./driver-settlements/driver-payments/driver-payments.component";
import { EmailedInvoicesComponent } from "./invoices/emailed-invoices/emailed-invoices.component";
import { ExpenseTransactionsComponent } from "./accounts/expenses/expense-transactions/expense-transactions.component";
import { IncomeTransactionsComponent } from "./accounts/income-transactions/income-transactions.component";
import { AgingReportComponent } from "./invoices/aging-report/aging-report.component";
import { OpenInvoicesComponent } from "./invoices/open-invoices/open-invoices.component";
import { PaidInvoicesComponent } from "./invoices/paid-invoices/paid-invoices.component";
import { PartiallyPaidInvoicesComponent } from "./invoices/partially-paid-invoices/partially-paid-invoices.component";
import { ReceivePaymentsComponent } from "./accounts/receive-payments/receive-payments.component";
import {RecurringDeductionsComponent } from "./driver-settlements/recurring-deductions/recurring-deductions.component";
import {VoidedInvoicesComponent} from "./invoices/voided-invoices/voided-invoices.component";
import {InvoicesComponent} from "./invoices/invoices/invoices.component";

const routes: Routes = [
  {
    path: "accounts",
    children: [
      { path: "Chart-Accounts", component: ChartAccountsComponent },
      { path: "Income-Transactions", component: IncomeTransactionsComponent },
      { path: "Receive-Payments", component: ReceivePaymentsComponent },

      {
        path: "expenses",
        children: [
          {
            path: "Expense-Transactions",
            component: ExpenseTransactionsComponent,
          },
        ],
      },
    ],
  },
  {
    path: "invoices",
    children: [
      { path: "All-Invoices", component: InvoicesComponent },
      { path: "Emailed-Invoices", component: EmailedInvoicesComponent },
      { path: "Aging-Report", component: AgingReportComponent },
      { path: "Open-Invoices", component: OpenInvoicesComponent },
      { path: "Paid-Invoices", component: PaidInvoicesComponent },
      {
        path: "Partially-Paid-Invoices",
        component: PartiallyPaidInvoicesComponent,
      },
      { path: "Voided-Invoices", component: VoidedInvoicesComponent }

    ],
  },
  {
    path: "driver-settlements",
    children: [
      { path: "Driver-Payments", component: DriverPaymentsComponent },
      { path: "Recurring-Deductions", component: RecurringDeductionsComponent },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}

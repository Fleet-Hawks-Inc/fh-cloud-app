import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AllInvoicesComponent } from './invoices/all-invoices/all-invoices.component';
import { ChartAccountsComponent } from './accounts/chart-accounts/chart-accounts.component';
import { DriverPaymentsComponent } from './driver-settlements/driver-payments/driver-payments.component';
import { EmailedInvoicesComponent } from './invoices/emailed-invoices/emailed-invoices.component';
import {ExpenseTransactionsComponent } from './accounts/expenses/expense-transactions/expense-transactions.component';
import { IncomeTransactionsComponent } from './accounts/income-transactions/income-transactions.component';
import { AgingReportComponent } from './invoices/aging-report/aging-report.component';
import { InvoicesComponent } from './invoices/invoices/invoices.component';
import { OpenInvoicesComponent } from './invoices/open-invoices/open-invoices.component';
import { PaidInvoicesComponent } from './invoices/paid-invoices/paid-invoices.component';
import { PartiallyPaidInvoicesComponent } from './invoices/partially-paid-invoices/partially-paid-invoices.component';
import { ReceivePaymentsComponent } from './accounts/receive-payments/receive-payments.component';
import { RecurringDeductionsComponent } from './driver-settlements/recurring-deductions/recurring-deductions.component';
import { VoidedInvoicesComponent } from './invoices/voided-invoices/voided-invoices.component';

@NgModule({
  declarations: [
    AllInvoicesComponent,
    ChartAccountsComponent,
    DriverPaymentsComponent,
    EmailedInvoicesComponent,
    ExpenseTransactionsComponent,
    IncomeTransactionsComponent,
    AgingReportComponent,
    InvoicesComponent,
    OpenInvoicesComponent,
    PaidInvoicesComponent,
    PartiallyPaidInvoicesComponent,
    ReceivePaymentsComponent,
    RecurringDeductionsComponent,
    VoidedInvoicesComponent],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
  ]
})
export class AccountsModule { }

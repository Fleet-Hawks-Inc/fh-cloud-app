import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralLedgerDetailComponent } from './general-ledger/general-ledger-detail/general-ledger-detail.component';
import { GeneralLedgerListComponent } from './general-ledger/general-ledger-list/general-ledger-list.component';
import { RouterModule, Routes } from '@angular/router';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { ProfitLossReportComponent } from './profit-loss-report/profit-loss-report.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { CashFlowStatementComponent } from './cash-flow-statement/cash-flow-statement.component';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  { path: 'general-ledger/list', component: GeneralLedgerListComponent },
  { path: 'general-ledger/detail', component: GeneralLedgerDetailComponent },
  { path: 'balance-sheet', component: BalanceSheetComponent },
  { path: 'profit-loss-report', component: ProfitLossReportComponent },
  { path: 'trial-balance', component: TrialBalanceComponent },
  { path: 'cash-flow-statement', component: CashFlowStatementComponent },
  { path: 'tax-report', component: TaxReportComponent }
];

@NgModule({
  declarations: [
    GeneralLedgerDetailComponent,
    GeneralLedgerListComponent,
    BalanceSheetComponent,
    ProfitLossReportComponent,
    TrialBalanceComponent,
    CashFlowStatementComponent,
    TaxReportComponent],
  imports: [
    CommonModule,
    ChartsModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountReportsModule { }

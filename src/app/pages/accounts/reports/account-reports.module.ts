import { Injectable, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralLedgerDetailComponent } from './general-ledger/general-ledger-detail/general-ledger-detail.component';
import { GeneralLedgerListComponent } from './general-ledger/general-ledger-list/general-ledger-list.component';
import { RouterModule, Routes } from '@angular/router';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { ProfitLossReportComponent } from './profit-loss-report/profit-loss-report.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { CashFlowStatementComponent } from './cash-flow-statement/cash-flow-statement.component';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { ChartsModule } from 'ng2-charts';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string): NgbDateStruct {
    if (!value)
      return null
    const parts = value.split(this.DELIMITER);
    return {
      year: + parseInt(parts[0]),
      month: + parseInt(parts[1]),
      day: + parseInt(parts[2])
    }
  }

  toModel(date: NgbDateStruct): string // from internal model -> your mode
  {
    return date ? date.year + this.DELIMITER + ('0' + date.month).slice(-2)
      + this.DELIMITER + ('0' + date.day).slice(-2) : null
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        year: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[0], 10),

      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
  }
}
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
    FormsModule,
    CommonModule,
    ChartsModule,
    InfiniteScrollModule,
    NgSelectModule,
    NgbModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class AccountReportsModule { }

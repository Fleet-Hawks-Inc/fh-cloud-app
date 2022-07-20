import { Injectable, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "./../../../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { GeneralLedgerDetailComponent } from "./general-ledger/general-ledger-detail/general-ledger-detail.component";
import { GeneralLedgerListComponent } from "./general-ledger/general-ledger-list/general-ledger-list.component";
import { RouterModule, Routes } from "@angular/router";
import { BalanceSheetComponent } from "./balance-sheet/balance-sheet.component";
import { ProfitLossReportComponent } from "./profit-loss-report/profit-loss-report.component";
import { TrialBalanceComponent } from "./trial-balance/trial-balance.component";
import { CashFlowStatementComponent } from "./cash-flow-statement/cash-flow-statement.component";
import { TaxReportComponent } from "./tax-report/tax-report.component";
import { ChartsModule } from "ng2-charts";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { EmployerPayComponent } from './employer-pay/employer-pay.component';
import { EmployeePayComponent } from './employee-pay/employee-pay.component';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string): NgbDateStruct {
    if (!value) return null;
    const parts = value.split(this.DELIMITER);
    return {
      year: +parseInt(parts[0]),
      month: +parseInt(parts[1]),
      day: +parseInt(parts[2]),
    };
  }

  toModel(date: NgbDateStruct): string {
    // from internal model -> your mode
    return date
      ? date.year +
          this.DELIMITER +
          ("0" + date.month).slice(-2) +
          this.DELIMITER +
          ("0" + date.day).slice(-2)
      : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = "/";

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
    return date
      ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day
      : "";
  }
}
const routes: Routes = [
  {
    path: "general-ledger/list",
    component: GeneralLedgerListComponent,
    data: { title: "General Ledger List" },
  },
  {
    path: "general-ledger/detail/:actID",
    component: GeneralLedgerDetailComponent,
    data: { title: "General Ledger Detail" },
  },
  {
    path: "balance-sheet",
    component: BalanceSheetComponent,
    data: { title: "Balance Sheet" },
  },
  {
    path: "profit-loss-report",
    component: ProfitLossReportComponent,
    data: { title: "Profit Loss Report" },
  },
  {
    path: "trial-balance",
    component: TrialBalanceComponent,
    data: { title: "Trial Balance" },
  },
  {
    path: "cash-flow-statement",
    component: CashFlowStatementComponent,
    data: { title: "Cash Flow Statement" },
  },
  {
    path: "tax-report",
    component: TaxReportComponent,
    data: { title: "Tax Report" },
  },
  {
    path: "employer-pay",
    component: EmployerPayComponent,
    data: { title: "Employer Pay" },
  },
  {
    path: "employee-pay",
    component: EmployeePayComponent,
    data: { title: "Employee Pay" },
  },
];

@NgModule({
  declarations: [
    GeneralLedgerDetailComponent,
    GeneralLedgerListComponent,
    BalanceSheetComponent,
    ProfitLossReportComponent,
    TrialBalanceComponent,
    CashFlowStatementComponent,
    TaxReportComponent,
    EmployerPayComponent,
    EmployeePayComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ChartsModule,
    InfiniteScrollModule,
    NgSelectModule,
    NgbModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AccountReportsModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddAdvancePaymentComponent } from "./advance-payments/add-advance-payment/add-advance-payment.component";
import { AdvancePaymentsListComponent } from "./advance-payments/advance-payments-list/advance-payments-list.component";
import { AdvancePaymentsDetailComponent } from "./advance-payments/advance-payments-detail/advance-payments-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { DriverPaymentsListComponent } from "./driver-payments/driver-payments-list/driver-payments-list.component";
import { AddDriverPaymentComponent } from "./driver-payments/add-driver-payment/add-driver-payment.component";
import { DriverPaymentsDetailComponent } from "./driver-payments/driver-payments-detail/driver-payments-detail.component";
import { AddEmployeePaymentComponent } from "./employee-payment/add-employee-payment/add-employee-payment.component";
import { EmployeePaymentListComponent } from "./employee-payment/employee-payment-list/employee-payment-list.component";
import { EmployeePaymentDetailComponent } from "./employee-payment/employee-payment-detail/employee-payment-detail.component";
import { AddAccountModule } from "../add-account/add-account.module";
import { PaymentChequeComponent } from "../payment-cheque/payment-cheque.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string): NgbDateStruct {
    if (!value) return null;
    let parts = value.split(this.DELIMITER);
    return {
      year: +parseInt(parts[0]),
      month: +parseInt(parts[1]),
      day: +parseInt(parts[2]),
    };
  }

  toModel(date: NgbDateStruct): string { // from internal model -> your mode
    let month: any = "";
    let day: any = "";
    if (date) {
      month = date.month < 10 ? "0" + date.month : date.month;
      day = date.day < 10 ? "0" + date.day : date.day;
    }
    return date
      ? date.year + this.DELIMITER + month + this.DELIMITER + day
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
    let month: any = "";
    let day: any = "";
    if (date) {
      month = date.month < 10 ? "0" + date.month : date.month;
      day = date.day < 10 ? "0" + date.day : date.day;
    }

    return date
      ? date.year + this.DELIMITER + month + this.DELIMITER + day
      : "";
  }
}

const routes: Routes = [
  { path: "advance-payments/list", component: AdvancePaymentsListComponent },
  { path: "advance-payments/add", component: AddAdvancePaymentComponent },
  { path: "advance-payments/edit/:paymentID", component: AddAdvancePaymentComponent },
  { path: "advance-payments/detail/:paymentID", component: AdvancePaymentsDetailComponent },
  { path: "driver-payments/list", component: DriverPaymentsListComponent },
  { path: "driver-payments/add", component: AddDriverPaymentComponent },
  { path: "driver-payments/edit/:paymentID", component: AddDriverPaymentComponent },
  { path: "driver-payments/detail/:paymentID", component: DriverPaymentsDetailComponent },
  { path: "employee-payments/list", component: EmployeePaymentListComponent },
  { path: "employee-payments/add", component: AddEmployeePaymentComponent },
  { path: "employee-payments/edit/:paymentID", component: AddEmployeePaymentComponent },
  { path: "employee-payments/detail/:paymentID", component: EmployeePaymentDetailComponent },
];

@NgModule({
  declarations: [
    AddAdvancePaymentComponent,
    AdvancePaymentsListComponent,
    AdvancePaymentsDetailComponent,
    DriverPaymentsListComponent,
    AddDriverPaymentComponent,
    DriverPaymentsDetailComponent,
    EmployeePaymentDetailComponent,
    AddEmployeePaymentComponent,
    EmployeePaymentListComponent,
    // PaymentChequeComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    AddAccountModule,
    InfiniteScrollModule,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class PaymentsModule {}

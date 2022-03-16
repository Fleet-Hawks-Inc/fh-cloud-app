import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct, NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AddAccountModule } from "../add-account/add-account.module";
import { PaymentChequeComponent } from "../payment-cheque/payment-cheque.component";
import { PaymentPdfsComponent } from "../payment-pdfs/payment-pdfs.component";
import { AddAdvancePaymentComponent } from "./advance-payments/add-advance-payment/add-advance-payment.component";
import { AdvancePaymentsDetailComponent } from "./advance-payments/advance-payments-detail/advance-payments-detail.component";
import { AdvancePaymentsListComponent } from "./advance-payments/advance-payments-list/advance-payments-list.component";
import { AddDriverPaymentComponent } from "./driver-payments/add-driver-payment/add-driver-payment.component";
import { DriverPaymentsDetailComponent } from "./driver-payments/driver-payments-detail/driver-payments-detail.component";
import { DriverPaymentsListComponent } from "./driver-payments/driver-payments-list/driver-payments-list.component";
import { AddEmployeePaymentComponent } from "./employee-payment/add-employee-payment/add-employee-payment.component";
import { EmployeePaymentDetailComponent } from "./employee-payment/employee-payment-detail/employee-payment-detail.component";
import { EmployeePaymentListComponent } from "./employee-payment/employee-payment-list/employee-payment-list.component";
import { AddExpensePaymentComponent } from "./expense-payments/add-expense-payment/add-expense-payment.component";
import { ExpensePaymentDetailComponent } from "./expense-payments/expense-payment-detail/expense-payment-detail.component";
import { ExpensePaymentListComponent } from "./expense-payments/expense-payment-list/expense-payment-list.component";
import { AddVendorPaymentComponent } from "./vendor-payment/add-vendor-payment/add-vendor-payment.component";
import { VendorPaymentDetailComponent } from "./vendor-payment/vendor-payment-detail/vendor-payment-detail.component";
import { VendorPaymentListComponent } from "./vendor-payment/vendor-payment-list/vendor-payment-list.component";

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string): NgbDateStruct {
    if (!value) {
      return null;
    }
    let parts = value.split(this.DELIMITER);
    return {
      year: +parseInt(parts[0]),
      month: +parseInt(parts[1]),
      day: +parseInt(parts[2]),
    };
  }

  toModel(date: NgbDateStruct): string {
    // from internal model -> your mode
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
  {
    path: "advance-payments/list",
    component: AdvancePaymentsListComponent,
    data: { title: "Advance Payments List" },
  },
  {
    path: "advance-payments/add",
    component: AddAdvancePaymentComponent,
    data: { title: "Add Advance Payments" },
  },
  {
    path: "advance-payments/edit/:paymentID",
    component: AddAdvancePaymentComponent,
    data: { title: "Edit Advance Payments" },
  },
  {
    path: "advance-payments/detail/:paymentID",
    component: AdvancePaymentsDetailComponent,
    data: { title: "Advance Payments Detail" },
  },
  {
    path: "driver-payments/list",
    component: DriverPaymentsListComponent,
    data: { title: "Driver Payments List" },
  },
  {
    path: "driver-payments/add",
    component: AddDriverPaymentComponent,
    data: { title: "Add Driver Payments" },
  },
  {
    path: "driver-payments/edit/:paymentID",
    component: AddDriverPaymentComponent,
    data: { title: "Edit Driver Payments" },
  },
  {
    path: "driver-payments/detail/:paymentID",
    component: DriverPaymentsDetailComponent,
    data: { title: "Driver Payments Detail" },
  },
  {
    path: "employee-payments/list",
    component: EmployeePaymentListComponent,
    data: { title: "Employee Payments List" },
  },
  {
    path: "employee-payments/add",
    component: AddEmployeePaymentComponent,
    data: { title: "Add Employee Payment" },
  },
  {
    path: "employee-payments/edit/:paymentID",
    component: AddEmployeePaymentComponent,
    data: { title: "Edit Employee Payment" },
  },
  {
    path: "employee-payments/detail/:paymentID",
    component: EmployeePaymentDetailComponent,
    data: { title: "Employee Payment Detail" },
  },
  {
    path: "vendor-payments/list",
    component: VendorPaymentListComponent,
    data: { title: "Vendor Payment List" },
  },
  {
    path: "vendor-payments/add",
    component: AddVendorPaymentComponent,
    data: { title: "Add Vendor Payment" },
  },
  {
    path: "vendor-payments/detail/:paymentID",
    component: VendorPaymentDetailComponent,
    data: { title: "Vendor Payment Detail" },
  },
  {
    path: "expense-payments/list",
    component: ExpensePaymentListComponent,
    data: { title: "Expense Payment List" },
  },
  {
    path: "expense-payments/add",
    component: AddExpensePaymentComponent,
    data: { title: "Add Expense Payment" },
  },
  {
    path: "expense-payments/detail/:paymentID",
    component: ExpensePaymentDetailComponent,
    data: { title: "Expense Payment Detail" },
  },
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
    PaymentChequeComponent,
    PaymentPdfsComponent,
    AddVendorPaymentComponent,
    VendorPaymentListComponent,
    VendorPaymentDetailComponent,
    AddExpensePaymentComponent,
    ExpensePaymentListComponent,
    ExpensePaymentDetailComponent,
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
    NgxMaskModule.forRoot(),
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class PaymentsModule { }

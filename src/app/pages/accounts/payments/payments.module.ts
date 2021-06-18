import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAdvancePaymentComponent } from './advance-payments/add-advance-payment/add-advance-payment.component';
import { AdvancePaymentsListComponent } from './advance-payments/advance-payments-list/advance-payments-list.component';
import { AdvancePaymentsDetailComponent } from './advance-payments/advance-payments-detail/advance-payments-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { DriverPaymentsListComponent } from './driver-payments/driver-payments-list/driver-payments-list.component';
import { AddDriverPaymentComponent } from './driver-payments/add-driver-payment/add-driver-payment.component';
import { DriverPaymentsDetailComponent } from './driver-payments/driver-payments-detail/driver-payments-detail.component';
import { AddEmployeePaymentComponent } from './employee-payment/add-employee-payment/add-employee-payment.component';
import { EmployeePaymentListComponent } from './employee-payment/employee-payment-list/employee-payment-list.component';
import { EmployeePaymentDetailComponent } from './employee-payment/employee-payment-detail/employee-payment-detail.component';

const routes: Routes = [
  { path: 'advance-payments/list', component: AdvancePaymentsListComponent },
  { path: 'advance-payments/add', component: AddAdvancePaymentComponent },
  { path: 'advance-payments/detail', component: AdvancePaymentsDetailComponent },
  { path: 'driver-payments/list', component: DriverPaymentsListComponent },
  { path: 'driver-payments/add', component: AddDriverPaymentComponent },
  { path: 'driver-payments/detail', component: DriverPaymentsDetailComponent },
  { path: 'employee-payments/list', component: EmployeePaymentListComponent },
  { path: 'employee-payments/add', component: AddEmployeePaymentComponent },
  { path: 'employee-payments/detail', component: EmployeePaymentDetailComponent },
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
    EmployeePaymentListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PaymentsModule { }

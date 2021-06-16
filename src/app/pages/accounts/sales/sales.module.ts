import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSalesOrderComponent } from './sales-orders/add-sales-order/add-sales-order.component';
import { SalesOrderListComponent } from './sales-orders/sales-order-list/sales-order-list.component';
import { SalesOrderDetailComponent } from './sales-orders/sales-order-detail/sales-order-detail.component';
import { SalesInvoicesListComponent } from './sales-invoices/sales-invoices-list/sales-invoices-list.component';
import { SalesInvoiceDetailComponent } from './sales-invoices/sales-invoice-detail/sales-invoice-detail.component';
import { AddSalesInvoiceComponent } from './sales-invoices/add-sales-invoice/add-sales-invoice.component';
import { AddSalesReceiptsComponent } from './receipts/add-sales-receipts/add-sales-receipts.component';
import { SalesReceiptsListComponent } from './receipts/sales-receipts-list/sales-receipts-list.component';
import { SalesReceiptsDetailComponent } from './receipts/sales-receipts-detail/sales-receipts-detail.component';
import { AddCreditNoteComponent } from './credit-notes/add-credit-note/add-credit-note.component';
import { CreditNotesListComponent } from './credit-notes/credit-notes-list/credit-notes-list.component';

const routes: Routes = [
  { path: 'orders/list', component: SalesOrderListComponent },
  { path: 'orders/add', component: AddSalesOrderComponent },
  { path: 'orders/detail', component: SalesOrderDetailComponent },
  { path: 'invoices/list', component: SalesInvoicesListComponent },
  { path: 'invoices/add', component: AddSalesInvoiceComponent },
  { path: 'invoices/detail', component: SalesInvoiceDetailComponent },
  { path: 'receipts/list', component: SalesReceiptsListComponent },
  { path: 'receipts/add', component: AddSalesReceiptsComponent },
  { path: 'receipts/detail', component: SalesReceiptsDetailComponent },
  { path: 'credit-notes/list', component: CreditNotesListComponent },
  { path: 'credit-notes/add', component: AddCreditNoteComponent },
  // { path: 'credit-notes/detail', component: SalesReceiptsDetailComponent },
];

@NgModule({
  declarations: [
    AddSalesOrderComponent,
    SalesOrderListComponent,
    SalesOrderDetailComponent,
    SalesInvoicesListComponent,
    SalesInvoiceDetailComponent,
    AddSalesInvoiceComponent,
    SalesReceiptsListComponent,
    SalesReceiptsDetailComponent,
    AddSalesReceiptsComponent,
    CreditNotesListComponent,
    AddCreditNoteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }

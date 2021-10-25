import { RouterModule, Routes } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from "@ng-select/ng-select";
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
  { path: 'orders/list', component: SalesOrderListComponent },
  { path: 'orders/add', component: AddSalesOrderComponent },
  { path: 'orders/edit/:saleID', component: AddSalesOrderComponent },
  { path: 'orders/detail/:saleID', component: SalesOrderDetailComponent },
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
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }

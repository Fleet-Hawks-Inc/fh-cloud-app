import { CommonModule } from "@angular/common";
import { Injectable, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { AddAccountModule } from "../add-account/add-account.module";
import { AddCreditNoteComponent } from "./credit-notes/add-credit-note/add-credit-note.component";
import { CreditNoteDetailComponent } from "./credit-notes/credit-note-detail/credit-note-detail.component";
import { CreditNotesListComponent } from "./credit-notes/credit-notes-list/credit-notes-list.component";
import { AddSalesReceiptsComponent } from "./receipts/add-sales-receipts/add-sales-receipts.component";
import { SalesReceiptsDetailComponent } from "./receipts/sales-receipts-detail/sales-receipts-detail.component";
import { SalesReceiptsListComponent } from "./receipts/sales-receipts-list/sales-receipts-list.component";
import { AddSalesInvoiceComponent } from "./sales-invoices/add-sales-invoice/add-sales-invoice.component";
import { SalesInvoiceDetailComponent } from "./sales-invoices/sales-invoice-detail/sales-invoice-detail.component";
import { SalesInvoicesListComponent } from "./sales-invoices/sales-invoices-list/sales-invoices-list.component";
import { AddSalesOrderComponent } from "./sales-orders/add-sales-order/add-sales-order.component";
import { SalesOrderDetailComponent } from "./sales-orders/sales-order-detail/sales-order-detail.component";
import { SalesOrderListComponent } from "./sales-orders/sales-order-list/sales-order-list.component";
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
  {
    path: "orders/list/:sessionID",
    component: SalesOrderListComponent,
    data: { title: "Sales Order List", reuseRoute: true },
  },
  {
    path: "orders/add",
    component: AddSalesOrderComponent,
    data: { title: "Add Sale Order" },
  },
  {
    path: "orders/edit/:saleID",
    component: AddSalesOrderComponent,
    data: { title: "Edit Sale Order" },
  },
  {
    path: "orders/detail/:saleID",
    component: SalesOrderDetailComponent,
    data: { title: "Sale Order Detail" },
  },
  {
    path: "invoices/list",
    component: SalesInvoicesListComponent,
    data: { title: "Sales Invoices List" },
  },
  {
    path: "invoices/add",
    component: AddSalesInvoiceComponent,
    data: { title: "Add Sale Invoices" },
  },
  {
    path: "invoices/edit/:saleID",
    component: AddSalesInvoiceComponent,
    data: { title: "Edit Sale Invoices" },
  },
  {
    path: "invoices/detail/:saleID",
    component: SalesInvoiceDetailComponent,
    data: { title: "Sale Invoices Detail" },
  },
  {
    path: "receipts/list/:sessionID",
    component: SalesReceiptsListComponent,
    data: { title: "Sales Receipts List" , reuseRoute: true },
  },
  {
    path: "receipts/add",
    component: AddSalesReceiptsComponent,
    data: { title: "Add Sales Receipt" },
  },
  {
    path: "receipts/detail/:saleID",
    component: SalesReceiptsDetailComponent,
    data: { title: "Sales Receipt Detail" },
  },
  {
    path: "credit-notes/list",
    component: CreditNotesListComponent,
    data: { title: "Credit Notes List" },
  },
  {
    path: "credit-notes/add",
    component: AddCreditNoteComponent,
    data: { title: "Add Credit Note" },
  },
  {
    path: "credit-notes/edit/:creditID",
    component: AddCreditNoteComponent,
    data: { title: "Edit Customer Credit Note" },
  },
  {
    path: "credit-notes/detail/:creditID",
    component: CreditNoteDetailComponent,
    data: { title: "Credit Note Detail" },
  },
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
    AddCreditNoteComponent,
    CreditNoteDetailComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule.forChild(routes),
    TableModule,
    AddAccountModule,
    AutoCompleteModule,
    ButtonModule,
    MultiSelectModule,
    SplitButtonModule,
    OverlayPanelModule
  ],
})
export class SalesModule { }

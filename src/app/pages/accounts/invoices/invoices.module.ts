import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { LoadInvoiceDetailComponent } from './load-invoice-detail/load-invoice-detail.component';
import { AddLoadInvoiceComponent } from './add-load-invoice/add-load-invoice.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'list', component: InvoiceListComponent},
  { path: 'add', component: AddInvoiceComponent},
  { path: 'detail/:invID', component: InvoiceDetailComponent},
  { path: 'edit/:invID', component: AddInvoiceComponent},
  { path: 'add-load-invoice', component: AddLoadInvoiceComponent},
  { path: 'load-invoice-detail', component: LoadInvoiceDetailComponent},
];

@NgModule({
  declarations: [AddInvoiceComponent, InvoiceListComponent, InvoiceDetailComponent, LoadInvoiceDetailComponent, AddLoadInvoiceComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class InvoicesModule { }

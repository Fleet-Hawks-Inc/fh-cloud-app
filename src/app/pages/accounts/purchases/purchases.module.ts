import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPurchaseOrderComponent } from './purchase-orders/add-purchase-order/add-purchase-order.component';
import { PurchaseOrdersListComponent } from './purchase-orders/purchase-orders-list/purchase-orders-list.component';
import { PurchaseOrderDetailComponent } from './purchase-orders/purchase-order-detail/purchase-order-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { VendorPaymentsListComponent } from './vendor-payments/vendor-payments-list/vendor-payments-list.component';
import { AddVendorPaymentComponent } from './vendor-payments/add-vendor-payment/add-vendor-payment.component';
import { VendorPaymentDetailComponent } from './vendor-payments/vendor-payment-detail/vendor-payment-detail.component';
import { VendorCreditNotesListComponent } from './vendor-credit-notes/vendor-credit-notes-list/vendor-credit-notes-list.component';
import { VendorCreditNoteDetailComponent } from './vendor-credit-notes/vendor-credit-note-detail/vendor-credit-note-detail.component';
import { AddVendorCreditNoteComponent } from './vendor-credit-notes/add-vendor-credit-note/add-vendor-credit-note.component';

const routes: Routes = [
  { path: 'orders/list', component: PurchaseOrdersListComponent },
  { path: 'orders/add', component: AddPurchaseOrderComponent },
  { path: 'orders/detail', component: PurchaseOrderDetailComponent },
  { path: 'vendor-payments/list', component: VendorPaymentsListComponent },
  { path: 'vendor-payments/add', component: AddVendorPaymentComponent },
  { path: 'vendor-payments/detail', component: VendorPaymentDetailComponent },
  { path: 'vendor-credit-notes/list', component: VendorCreditNotesListComponent },
  { path: 'vendor-credit-notes/add', component: AddVendorCreditNoteComponent },
  { path: 'vendor-credit-notes/detail', component: VendorCreditNoteDetailComponent },
];

@NgModule({
  declarations: [
    AddPurchaseOrderComponent,
    PurchaseOrdersListComponent,
    PurchaseOrderDetailComponent,
    VendorPaymentsListComponent,
    VendorPaymentDetailComponent,
    AddVendorPaymentComponent,
    VendorCreditNotesListComponent,
    VendorCreditNoteDetailComponent,
    AddVendorCreditNoteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PurchasesModule { }

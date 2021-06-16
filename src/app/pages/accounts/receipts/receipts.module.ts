import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';
import { ReceiptDetailComponent } from './receipt-detail/receipt-detail.component';
import { ReceiptsListComponent } from './receipts-list/receipts-list.component';
import { Routes, Router, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'list', component: ReceiptsListComponent},
  { path: 'add', component: AddReceiptComponent},
  { path: 'detail', component: ReceiptDetailComponent},
];

@NgModule({
  declarations: [AddReceiptComponent, ReceiptDetailComponent, ReceiptsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ReceiptsModule { }

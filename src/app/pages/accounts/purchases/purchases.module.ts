import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { AddPurchaseOrderComponent } from "./purchase-orders/add-purchase-order/add-purchase-order.component";
import { PurchaseOrdersListComponent } from "./purchase-orders/purchase-orders-list/purchase-orders-list.component";
import { PurchaseOrderDetailComponent } from "./purchase-orders/purchase-order-detail/purchase-order-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { VendorPaymentsListComponent } from "./vendor-payments/vendor-payments-list/vendor-payments-list.component";
import { AddVendorPaymentComponent } from "./vendor-payments/add-vendor-payment/add-vendor-payment.component";
import { VendorPaymentDetailComponent } from "./vendor-payments/vendor-payment-detail/vendor-payment-detail.component";
import { VendorCreditNotesListComponent } from "./vendor-credit-notes/vendor-credit-notes-list/vendor-credit-notes-list.component";
import { VendorCreditNoteDetailComponent } from "./vendor-credit-notes/vendor-credit-note-detail/vendor-credit-note-detail.component";
import { AddVendorCreditNoteComponent } from "./vendor-credit-notes/add-vendor-credit-note/add-vendor-credit-note.component";
import { AddBillComponent } from "./bills/add-bill/add-bill.component";
import { BillDetailsComponent } from "./bills/bill-details/bill-details.component";
import { BillListComponent } from "./bills/bill-list/bill-list.component";
import { PaymentChequeComponent } from "../payment-cheque/payment-cheque.component";


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
    path: "orders/list",
    component: PurchaseOrdersListComponent,
    data: { title: "Purchase Orders List" },
  },
  {
    path: "orders/add",
    component: AddPurchaseOrderComponent,
    data: { title: "Add Purchase Orders" },
  },
  {
    path: "orders/edit/:purchaseID",
    component: AddPurchaseOrderComponent,
    data: { title: "Edit Purchase Orders" },
  },
  {
    path: "orders/detail/:purchaseID",
    component: PurchaseOrderDetailComponent,
    data: { title: "Purchase Orders Detail" },
  },
  {
    path: "vendor-payments/list",
    component: VendorPaymentsListComponent,
    data: { title: "Vendor Payments List" },
  },
  {
    path: "vendor-payments/add",
    component: AddVendorPaymentComponent,
    data: { title: "Add Vendor Payment" },
  },
  {
    path: "vendor-payments/detail/:paymentID",
    component: VendorPaymentDetailComponent,
    data: { title: "Vendor Payments Detail" },
  },
  {
    path: "vendor-credit-notes/list",
    component: VendorCreditNotesListComponent,
    data: { title: "Vendor Credit Notes List" },
  },
  {
    path: "vendor-credit-notes/add",
    component: AddVendorCreditNoteComponent,
    data: { title: "Add Vendor Credit Notes" },
  },
  {
    path: "vendor-credit-notes/edit/:creditID",
    component: AddVendorCreditNoteComponent,
    data: { title: "Edit Vendor Credit Notes" },
  },
  {
    path: "vendor-credit-notes/detail/:creditID",
    component: VendorCreditNoteDetailComponent,
    data: { title: "Vendor Credit Notes Detail" },
  },
  {
    path: "bills/list",
    component: BillListComponent,
    data: { title: "Bills List" },
  },
  {
    path: "bills/add",
    component: AddBillComponent,
    data: { title: "Add Bill" },
  },
  {
    path: "bills/edit/:billID",
    component: AddBillComponent,
    data: { title: "Edit Bill" },
  },
  {
    path: "bills/details/:billID",
    component: BillDetailsComponent,
    data: { title: "Bill Detail" },
  },
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
    AddVendorCreditNoteComponent,
    AddBillComponent,
    BillDetailsComponent,
    BillListComponent,
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
    InfiniteScrollModule,
  ],
})
export class PurchasesModule { }

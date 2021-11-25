import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { SharedModule } from "../../../shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { unsavedChangesGuard } from "src/app/guards/unsaved-changes.guard";
import { AddOrdersComponent } from "./add-orders/add-orders.component";
import { OrdersListComponent } from "./orders-list/orders-list.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import { PdfAutomationComponent } from "../pdf-automation/pdf-automation.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { BrokeragePdfComponent } from "./brokerage-pdf/brokerage-pdf.component";
import { BolPdfComponent } from "./bol-pdf/bol-pdf.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SlickCarouselModule } from "ngx-slick-carousel";
const routes: Routes = [
  {
    path: "order-list/:sessionId", component: OrdersListComponent, data: {
      reuseRoute: true
    }
  },
  { path: "edit/:orderID", component: AddOrdersComponent },
  { path: "add", component: AddOrdersComponent },
  { path: "detail/:orderID", component: OrderDetailComponent },
  { path: "pdfautomation", component: PdfAutomationComponent },
];
@NgModule({
  declarations: [
    OrdersListComponent,
    AddOrdersComponent,
    OrderDetailComponent,
    PdfAutomationComponent,
    BrokeragePdfComponent,
    BolPdfComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule,
    PdfViewerModule,
    SlickCarouselModule,
    InfiniteScrollModule
  ],
  providers: [unsavedChangesGuard],
})
export class OrderModule { }

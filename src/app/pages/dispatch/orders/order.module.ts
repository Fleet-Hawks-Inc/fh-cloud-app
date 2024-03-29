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
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { OverlayPanelModule } from 'primeng/overlaypanel';


import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from "primeng/badge";
import { DialogModule } from 'primeng/dialog';
const routes: Routes = [
  {
    path: "order-list/:sessionId",
    component: OrdersListComponent,
    data: {
      reuseRoute: true,
      title: "Order List",
    },
  },
  {
    path: "edit/:orderID",
    component: AddOrdersComponent,
    data: { title: "Edit Order" },
  },
  { path: "add", component: AddOrdersComponent, data: { title: "Add Order" } },
  {
    path: "detail/:orderID",
    component: OrderDetailComponent,
    data: { title: "Detail Order" },
  },
  {
    path: "pdfautomation",
    component: PdfAutomationComponent,
    data: { title: "PDF Automation" },
  },
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
    InfiniteScrollModule,
    TableModule,
    MultiSelectModule,
    MenuModule,
    SplitButtonModule,
    AutoCompleteModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    BadgeModule,
    OverlayPanelModule,
    DialogModule
  ],
  providers: [unsavedChangesGuard],
})
export class OrderModule { }

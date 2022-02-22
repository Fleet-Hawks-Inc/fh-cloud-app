import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { CustomerCollectionComponent } from "./customer-collection/customer-collection.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { PaymentReportComponent } from "./payment-report/payment-report.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgSelectModule } from "@ng-select/ng-select";

const routes: Routes = [
  {
    path: "overview",
    component: OverviewComponent,
    data: { title: "Accounts Report" },
  },
  {
    path: "collections",
    component: CustomerCollectionComponent,
    data: { title: "Customer Collection Report" },
  },
  {
    path: "payment",
    component: PaymentReportComponent,
    data: { title: "Payment Report" },
  },
];

@NgModule({
  declarations: [
    OverviewComponent,
    CustomerCollectionComponent,
    PaymentReportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    NgbModule,
    FormsModule,
    InfiniteScrollModule,
    NgSelectModule,
  ],
})
export class ManageAccountsReportsModule {}

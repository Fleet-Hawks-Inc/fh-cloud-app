import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";

import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { SummaryComponent } from "./summary/summary.component";
import { DetailreportComponent } from "./detailreport/detailreport.component";
import { CurrencyPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";

const routes: Routes = [
  { path: "overview", component: OverviewComponent },
  { path: "summary", component: SummaryComponent },
  {
    path: "detailreport",
    component: DetailreportComponent,
    data: { title: "Order Detail Report" },
  },
];

@NgModule({
  declarations: [OverviewComponent, SummaryComponent, DetailreportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    FormsModule,
    ToastrModule,
  ],
  providers: [CurrencyPipe],
})
export class ManageOrdersModule {}

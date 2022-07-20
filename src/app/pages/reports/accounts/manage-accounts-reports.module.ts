import { NgModule, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { CustomerCollectionComponent } from "./customer-collection/customer-collection.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PaymentReportComponent } from "./payment-report/payment-report.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { unsavedChangesGuard } from "src/app/guards/unsaved-changes.guard";
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { GoogleMapsModule } from "@angular/google-maps";
import { SharedModule } from 'src/app/shared/shared.module';
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
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    InfiniteScrollModule,
    GoogleMapsModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
  ],
})
export class ManageAccountsReportsModule {}

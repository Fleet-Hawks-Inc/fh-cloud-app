import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { LogsComponent } from "./logs/logs.component";
import { EditComponent } from "./edit/edit.component";
import { DetailedComponent } from "./detailed/detailed.component";
import { UnidentifiedComponent } from "./unidentified/unidentified.component";
import { UncertifiedComponent } from "./uncertified/uncertified.component";
import { ChartsModule } from "ng2-charts";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgSelectModule } from "@ng-select/ng-select";
import { HosChartComponent } from "./hos-chart/hos-chart.component";
import { TableModule } from "primeng/table";
import { RippleModule } from "primeng/ripple";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { CalendarModule } from "primeng/calendar";
import { InputSwitchModule } from "primeng/inputswitch";
import { DialogModule } from "primeng/dialog";

import { PdfViewerModule } from "ng2-pdf-viewer";
const routes: Routes = [
  { path: "logs", component: LogsComponent },
  { path: "edit/:userName/:eventDate", component: EditComponent },
  { path: "detailed/:hosDriverId", component: DetailedComponent },
  { path: "unidentified", component: UnidentifiedComponent },
  { path: "uncertified", component: UncertifiedComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    NgbModule,
    ChartsModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    NgSelectModule,
    TableModule,
    RippleModule,
    MultiSelectModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    CalendarModule,
    InputSwitchModule,
    DialogModule,
    PdfViewerModule,
  ],
  declarations: [
    LogsComponent,
    EditComponent,
    DetailedComponent,
    UnidentifiedComponent,
    UncertifiedComponent,
    HosChartComponent,
  ],
})
export class HosModule {}

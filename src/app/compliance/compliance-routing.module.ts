import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogsComponent } from "./hos/logs/logs.component";
import { EditComponent } from "./hos/edit/edit.component";
import { DetailedComponent } from "./hos/detailed/detailed.component";
import { SummaryComponent } from "./hos/summary/summary.component";
import { DailyInspectionComponent } from "./dvir/daily-inspection/daily-inspection.component";
import { InspectionDetailComponent } from "./hos/inspection-detail/inspection-detail.component";
import {DriverHosComponent} from "./hos/driver-hos/driver-hos.component";
import {InspectionReportComponent} from "./dvir/inspection-report/inspection-report.component";
import {MileageComponent} from "./ifta/mileage/mileage.component";
import {ReportComponent} from "./ifta/report/report.component";

const routes: Routes = [
  {
    path: 'hos',
    children: [
      { path: 'logs', component: LogsComponent },
      { path: 'edit/:userName/:eventDate', component: EditComponent },
      { path: 'detailed', component: DetailedComponent },
      { path: 'uncertified', component: LogsComponent },
      { path: 'summary', component: SummaryComponent },     
      { path: 'inspection-detail', component: InspectionDetailComponent },
      { path: 'driver-hos', component: DriverHosComponent },
    ],
  },
  {
    path: 'dvir',
    children: [
      { path: 'Inspection-Report', component: InspectionReportComponent },
      { path: 'daily-inspection', component: DailyInspectionComponent },
      { path: 'Inspection-Summary', component: InspectionReportComponent },
    ],
  },
  {
    path: 'ifta',
    children: [
      { path: 'Mileage', component: MileageComponent },
      { path: 'Report', component: ReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceRoutingModule {}

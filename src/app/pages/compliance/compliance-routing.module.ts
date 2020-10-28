import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsComponent } from './hos/logs/logs.component';
import { EditComponent } from './hos/edit/edit.component';
import { DetailedComponent } from './hos/detailed/detailed.component';
import { SummaryComponent } from './hos/summary/summary.component';
import { DriverHosComponent } from './hos/driver-hos/driver-hos.component';
import { MileageComponent } from './ifta/mileage/mileage.component';
import { ReportComponent } from './ifta/report/report.component';
import { UnidentifiedComponent } from './hos/unidentified/unidentified.component';
import { InspectionSummaryComponent } from './dvir/inspection-summary/inspection-summary.component';
import {InspectionDetailComponent} from './dvir/inspection-detail/inspection-detail.component';

const routes: Routes = [
  {
    path: 'hos',
    children: [
      { path: 'logs', component: LogsComponent },
      { path: 'edit/:userName/:eventDate', component: EditComponent },
      { path: 'detailed/:userName/:eventDate', component: DetailedComponent },
      { path: 'unidentified', component: UnidentifiedComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'driver-hos', component: DriverHosComponent },
    ],
  },
  {
    path: 'dvir',
    children: [
      { path: 'inspection-summary', component: InspectionSummaryComponent },
      { path: 'inspection-detail/:inspectionID', component: InspectionDetailComponent },
    ],
  },
  {
    path: 'ifta',
    children: [
      { path: 'mileage', component: MileageComponent },
      { path: 'report', component: ReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceRoutingModule {}

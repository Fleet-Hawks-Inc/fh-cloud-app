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
import { UncertifiedComponent } from './hos/uncertified/uncertified.component';
import { InspectionSummaryComponent } from './dvir/inspection-summary/inspection-summary.component';
import {InspectionDetailComponent} from './dvir/inspection-detail/inspection-detail.component';
import { GenerateQuarterlyReportComponent } from './ifta/generate-quarterly-report/generate-quarterly-report.component';
import { IftaReportHistoryComponent } from './ifta/ifta-report-history/ifta-report-history.component';
import { IftaReturnDetailsComponent } from './ifta/ifta-return-details/ifta-return-details.component';
import {AddInspectionComponent} from './dvir/inspection/add-inspection/add-inspection.component';
import {EditInspectionComponent} from './dvir/inspection/edit-inspection/edit-inspection.component';
import {ListInspectionComponent} from './dvir/inspection/list-inspection/list-inspection.component'
import {ViewInspectionComponent} from './dvir/inspection/view-inspection/view-inspection.component'

const routes: Routes = [
  {
    path: 'hos',
    children: [
      { path: 'logs', component: LogsComponent },
      { path: 'edit/:userName/:eventDate', component: EditComponent },
      { path: 'detailed/:userName/:eventDate', component: DetailedComponent },
      { path: 'unidentified', component: UnidentifiedComponent },
      { path: 'uncertified', component:  UncertifiedComponent},
      { path: 'summary', component: SummaryComponent },
      { path: 'driver-hos', component: DriverHosComponent },
    ],
  },
  
  {
    path: 'dvir',
    children: [
      {path:'inspections',component: ListInspectionComponent},
      {path: 'inspection-add',component:AddInspectionComponent},
      {path: 'inspection-details/:inspectionID',component: ViewInspectionComponent},
      {path: 'inspection-edit/:inspectionID', component:EditInspectionComponent},
      { path: 'inspection-summary', component: InspectionSummaryComponent },
      { path: 'inspection-detail/:inspectionID', component: InspectionDetailComponent },
    ],
  },
  {
    path: 'ifta',
    children: [
      { path: 'mileage', component: MileageComponent },
      { path: 'report', component: ReportComponent },
      { path: 'new-quarterly-report', component:  GenerateQuarterlyReportComponent },
      { path: 'report-history', component: IftaReportHistoryComponent},
      { path: 'return-details', component: IftaReturnDetailsComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceRoutingModule {}

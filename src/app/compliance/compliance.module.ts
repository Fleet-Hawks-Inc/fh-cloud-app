import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { ComplianceRoutingModule } from "./compliance-routing.module";
import { LogsComponent } from "./hos/logs/logs.component";
import { EditComponent } from "./hos/edit/edit.component";
import { DetailedComponent } from './hos/detailed/detailed.component';
import {NgbDateAdapter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SummaryComponent } from './hos/summary/summary.component';
import { DailyInspectionComponent } from './dvir/daily-inspection/daily-inspection.component';
import { InspectionDetailComponent } from './hos/inspection-detail/inspection-detail.component';
import { DriverHosComponent } from './hos/driver-hos/driver-hos.component';
import { InspectionReportComponent } from './dvir/inspection-report/inspection-report.component';
import { MileageComponent } from './ifta/mileage/mileage.component';
import { ReportComponent } from './ifta/report/report.component';

@NgModule({
  imports: [CommonModule, ComplianceRoutingModule, FormsModule, SharedModule, NgbModule],
  declarations: [LogsComponent, EditComponent, DetailedComponent, SummaryComponent, DailyInspectionComponent, InspectionDetailComponent, DriverHosComponent, InspectionReportComponent, MileageComponent, ReportComponent],
})
export class ComplianceModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ComplianceRoutingModule } from './compliance-routing.module';
import { LogsComponent } from './hos/logs/logs.component';
import { EditComponent } from './hos/edit/edit.component';
import { DetailedComponent } from './hos/detailed/detailed.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SummaryComponent } from './hos/summary/summary.component';
import { DriverHosComponent } from './hos/driver-hos/driver-hos.component';
import { MileageComponent } from './ifta/mileage/mileage.component';
import { ReportComponent } from './ifta/report/report.component';
import { UnidentifiedComponent } from './hos/unidentified/unidentified.component';
import { InspectionSummaryComponent } from './dvir/inspection-summary/inspection-summary.component';
import {InspectionDetailComponent} from './dvir/inspection-detail/inspection-detail.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GenerateQuarterlyReportComponent } from './ifta/generate-quarterly-report/generate-quarterly-report.component';
import { IftaReportHistoryComponent } from './ifta/ifta-report-history/ifta-report-history.component';
import { IftaReturnDetailsComponent } from './ifta/ifta-return-details/ifta-return-details.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {AddInspectionComponent} from './dvir/inspection/add-inspection/add-inspection.component';
import {EditInspectionComponent} from './dvir/inspection/edit-inspection/edit-inspection.component';
import {ListInspectionComponent} from './dvir/inspection/list-inspection/list-inspection.component'
import {ViewInspectionComponent} from './dvir/inspection/view-inspection/view-inspection.component';
import { UncertifiedComponent } from './hos/uncertified/uncertified.component'

@NgModule({
  imports: [CommonModule,
    ComplianceRoutingModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    MatExpansionModule,
    NgbModule],
  declarations: [
    LogsComponent,
    EditComponent,
    DetailedComponent,
    SummaryComponent,
    InspectionDetailComponent,
    DriverHosComponent,
    MileageComponent,
    ReportComponent,
    UnidentifiedComponent,
    InspectionSummaryComponent,
    GenerateQuarterlyReportComponent,
    IftaReportHistoryComponent,
    AddInspectionComponent,
    EditInspectionComponent,
    ListInspectionComponent,
    ViewInspectionComponent,
    IftaReturnDetailsComponent,
    UncertifiedComponent],
})
export class ComplianceModule {
}

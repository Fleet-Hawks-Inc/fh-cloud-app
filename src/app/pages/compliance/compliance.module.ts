import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ComplianceRoutingModule } from './compliance-routing.module';
import { LogsComponent } from './hos/logs/logs.component';
import { EditComponent } from './hos/edit/edit.component';
import { DetailedComponent } from './hos/detailed/detailed.component';
import {NgbDateAdapter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SummaryComponent } from './hos/summary/summary.component';
import { InspectionDetailComponent } from './hos/inspection-detail/inspection-detail.component';
import { DriverHosComponent } from './hos/driver-hos/driver-hos.component';
import { MileageComponent } from './ifta/mileage/mileage.component';
import { ReportComponent } from './ifta/report/report.component';
import { UnidentifiedComponent } from './hos/unidentified/unidentified.component';
import { InspectionSummaryComponent } from './dvir/inspection-summary/inspection-summary.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelect2Module } from 'ng-select2';
@NgModule({
  imports: [CommonModule,
    ComplianceRoutingModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    NgSelect2Module,
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
    InspectionSummaryComponent],
})
export class ComplianceModule {
}

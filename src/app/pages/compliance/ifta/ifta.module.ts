import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { MileageComponent } from './mileage/mileage.component';
import { ReportComponent } from './report/report.component';
import { GenerateQuarterlyReportComponent } from './generate-quarterly-report/generate-quarterly-report.component';
import { IftaReportHistoryComponent } from './ifta-report-history/ifta-report-history.component';
import { IftaReturnDetailsComponent } from './ifta-return-details/ifta-return-details.component';
import { ChartsModule } from 'ng2-charts';
import { MatExpansionModule } from "@angular/material/expansion";
const routes: Routes = [
    
    { path: 'detail/:quarter', component: MileageComponent },
    { path: 'report', component: ReportComponent },
    { path: 'new-quarterly-report', component: GenerateQuarterlyReportComponent },
    { path: 'report-history', component: IftaReportHistoryComponent},
    { path: 'return-details', component: IftaReturnDetailsComponent}
    
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    NgbModule,
    ChartsModule,
    RouterModule.forChild(routes),
    MatExpansionModule
  ],
  declarations: [
    MileageComponent,
    ReportComponent,
    GenerateQuarterlyReportComponent,
    IftaReportHistoryComponent,
    IftaReturnDetailsComponent
  ],
})
export class IftaModule {}

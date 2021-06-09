import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import {NgSelectModule} from '@ng-select/ng-select'
import { InspectionSummaryComponent } from './inspection-summary/inspection-summary.component';
import {InspectionDetailComponent} from './inspection-detail/inspection-detail.component';

import {AddInspectionComponent} from './inspection/add-inspection/add-inspection.component';
import {EditInspectionComponent} from './inspection/edit-inspection/edit-inspection.component';
import {ListInspectionComponent} from './inspection/list-inspection/list-inspection.component'
import {ViewInspectionComponent} from './inspection/view-inspection/view-inspection.component'
import { ChartsModule } from 'ng2-charts';
import { MatExpansionModule } from "@angular/material/expansion";
const routes: Routes = [
  {path:'inspections',component: ListInspectionComponent},
  {path: 'inspection-add',component:AddInspectionComponent},
  {path: 'inspection-details/:inspectionID',component: ViewInspectionComponent},
  {path: 'inspection-add/:inspectionID', component:AddInspectionComponent},
  { path: 'inspection-summary', component: InspectionSummaryComponent },
  { path: 'inspection-detail/:inspectionID', component: InspectionDetailComponent },
    
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    NgbModule,
    ChartsModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    NgSelectModule
  ],
  declarations: [
    ListInspectionComponent,
    AddInspectionComponent,
    ViewInspectionComponent,
    EditInspectionComponent,
    InspectionSummaryComponent,
    InspectionDetailComponent
  ],
})
export class InspectionModule {}

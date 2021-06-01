import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { LogsComponent } from './logs/logs.component';
import { EditComponent } from './edit/edit.component';
import { DetailedComponent } from './detailed/detailed.component';
import { UnidentifiedComponent } from './unidentified/unidentified.component';
import { UncertifiedComponent } from './uncertified/uncertified.component';
import { ChartsModule } from 'ng2-charts';
import { MatExpansionModule } from "@angular/material/expansion";
import { NgSelectModule } from '@ng-select/ng-select';
import { HosChartComponent } from './hos-chart/hos-chart.component';
const routes: Routes = [
    
    { path: 'logs', component: LogsComponent },
    { path: 'edit/:userName/:eventDate', component: EditComponent },
    { path: 'detailed/:userName/:eventDate', component: DetailedComponent },
    { path: 'unidentified', component: UnidentifiedComponent },
    { path: 'uncertified', component:  UncertifiedComponent},
    
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
    LogsComponent,
    EditComponent,
    DetailedComponent,
    UnidentifiedComponent,
    UncertifiedComponent,
    HosChartComponent
  ],
})
export class HosModule {}

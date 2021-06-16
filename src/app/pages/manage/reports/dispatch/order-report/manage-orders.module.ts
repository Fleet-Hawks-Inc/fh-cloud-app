import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { SummaryComponent } from './summary/summary.component';
import { DetailreportComponent } from './detailreport/detailreport.component';




const routes: Routes = [
  { path: 'overview', component: OverviewComponent  },
  { path: 'summary', component: SummaryComponent },
  { path: 'detailreport', component: DetailreportComponent },
]

@NgModule({
  declarations: [
    OverviewComponent,
    SummaryComponent,
    DetailreportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageOrdersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   
   {
     path: 'hossummary',
     loadChildren: () => import('./hos-summary-reports/mange-hos-summary-reports.module').then((m) => m.ManageHosSummaryReportsModule) ,
   }
   
  
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageComplianceReportsModule { }

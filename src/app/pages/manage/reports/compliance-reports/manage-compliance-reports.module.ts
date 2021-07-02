import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
   
   {
     path: 'hossummary',
     loadChildren: () => import('./hos-summary-reports/mange-hos-summary-reports.module').then((m) => m.ManageHosSummaryReportsModule) ,
   },
   {
    path: 'logs',
    loadChildren: () => import('./logs-reports/mange-logs-reports.module').then((m) => m.ManageLogsReportsModule) ,
  },
  {
    path: 'umiles',
    loadChildren: () => import('./um-reports/mange-um-reports.module').then((m) => m.ManageUnidentifiedMilesReportsModule) ,
  },
  {
    path: 'ulreports',
    loadChildren: () => import('./uncertified-logs-reports/mange-uncertified-logs-reports.module').then((m) => m.ManageUncertifiedLogsReportsModule) ,
  },
  {
    path: 'isreports',
    loadChildren: () => import('./inspection-summary-reports/mange-inspection-summary-reports.module').then((m) => m.ManageInspectionSummaryReportsModule) ,
  },
  {
    path: 'iftareports',
    loadChildren: () => import('./ifta-reports/mange-ifta-reports.module').then((m) => m.ManageIftaReportsModule) ,
  }
  
  
 
  
]

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageComplianceReportsModule { }

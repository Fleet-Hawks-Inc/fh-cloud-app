import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   
   {
     path: 'safetyoverview',
     loadChildren: () => import('./safety-overview/mange-safety-overview.module').then((m) => m.ManageSafetyModule) ,
   },
   {
    path: 'criticalevents',
    loadChildren: () => import('./critical-events/mange-critical-events.module').then((m) => m.ManageCriticalEventsModule) ,
  },
  {
    path: 'incidents',
    loadChildren: () => import('./incidents/mange-incidents.module').then((m) => m.ManageIncidentsModule) ,
  },
  {
    path: 'hosviolations',
    loadChildren: () => import('./hos-violations/mange-hos-violations.module').then((m) => m.ManageHOSViolationsModule) ,
  },
  {
    path: 'scorecard',
    loadChildren: () => import('./driver-scorecard/mange-driver-scorecard.module').then((m) => m.ManageDriverScorecardModule) ,
  }
  
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageSafetyReportsModule { }

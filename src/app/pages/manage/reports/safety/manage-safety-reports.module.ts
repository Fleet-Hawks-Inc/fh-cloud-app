import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SafetyOverviewComponent } from './safety-overview/safety-overview.component';
import { CriticalEventsComponent } from './critical-events/critical-events.component';

const routes: Routes = [
   
   {
     path: 'safetyoverview',
     loadChildren: () => import('./safety-overview/mange-safety-overview.module').then((m) => m.ManageSafetyModule) ,
   },
   {
    path: 'criticalevents',
    loadChildren: () => import('./critical-events/mange-critical-events.module').then((m) => m.ManageCriticalEventsModule) ,
  }
]

@NgModule({
  declarations: [SafetyOverviewComponent, CriticalEventsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageSafetyReportsModule { }

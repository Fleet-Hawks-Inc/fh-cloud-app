import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafetyOverviewComponent } from './home/safety-overview/safety-overview.component';

import { ScorecardListComponent } from './driver-scorecard/scorecard-list/scorecard-list.component';
import { ScorecardDetailComponent } from './driver-scorecard/scorecard-detail/scorecard-detail.component';

const routes: Routes = [
  {
    path: "overview",
    children: [
      { path: '', component: SafetyOverviewComponent},
    ]
  },
  {
    path: "critical-events",
    loadChildren: () => import('./critical-events/critical-events.module').then((m) => m.CriticalEventsModule) ,
  },
  {
    path: "incidents",
    loadChildren: () => import('./incidents/incidents.module').then((m) => m.IncidentsModule) ,
  },
  {
    path: "hos-violations",
    loadChildren: () => import('./hos-violation/hos.module').then((m) => m.HosModule) ,
  },
  {
    path: "drivers-scorecard",
    children: [
      { path: '', component: ScorecardListComponent},
      { path: 'details/:driverID/:rank', component: ScorecardDetailComponent},
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SafetyRoutingModule { }

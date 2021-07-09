import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListInspectionComponent} from '../compliance/dvir/inspection/list-inspection/list-inspection.component'
import {EditInspectionComponent} from '../compliance/dvir/inspection/edit-inspection/edit-inspection.component'
import {ViewInspectionComponent} from '../compliance/dvir/inspection/view-inspection/view-inspection.component'
import {AddInspectionComponent} from '../compliance/dvir/inspection/add-inspection/add-inspection.component'
import { SafetyOverviewComponent } from './home/safety-overview/safety-overview.component';
import { EventListComponent } from './critical-events/event-list/event-list.component';
import { AddEventComponent } from './critical-events/add-event/add-event.component';
import { EventDetailComponent } from './critical-events/event-detail/event-detail.component';
import { IncidentListComponent } from './incidents/incident-list/incident-list.component';
import { AddIncidentComponent } from './incidents/add-incident/add-incident.component';
import { IncidentDetailComponent } from './incidents/incident-detail/incident-detail.component';
import { HosListComponent } from './hos-violation/hos-list/hos-list.component';
import { HosDetailComponent } from './hos-violation/hos-detail/hos-detail.component';
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
    children: [
      { path: '', component: EventListComponent},
      { path: 'add-event', component: AddEventComponent},
      { path: 'event-details/:eventID', component: EventDetailComponent},
    ]
  },
  {
    path: "incidents",
    children: [
      { path: '', component: IncidentListComponent},
      { path: 'add-incident', component: AddIncidentComponent},
      { path: 'incident-details/:incidentID', component: IncidentDetailComponent},
    ]
  },
  {
    path: "hos-violations",
    children: [
      { path: '', component: HosListComponent},
      { path: 'details/:eventID', component: HosDetailComponent},
    ]
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

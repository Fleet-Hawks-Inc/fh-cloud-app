import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AllReportsComponent } from '../reports/all-reports/all-reports.component';
const routes: Routes = [

  {
    path: 'allreport',
    component: AllReportsComponent
  },
  {
    path: 'fleet',
    loadChildren: () => import('./fleet/manage-fleet-reports.module').then((m) => m.ManageFleetReportsModule),
  },
  {
    path: 'dispatch',
    loadChildren: () => import('./dispatch/manage-dispatch-reports.module').then((m) => m.ManageDispatchReportsModule),
  },
  {
    path: 'safety',
    loadChildren: () => import('./safety/manage-safety-reports.module').then((m) => m.ManageSafetyReportsModule),
  },
  {
    path: 'compliance',
    loadChildren: () => import('./compliance-reports/manage-compliance-reports.module').then((m) => m.ManageComplianceReportsModule),
  }



]

@NgModule({
  declarations: [AllReportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class ManageReportsModule { }

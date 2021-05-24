import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dvir',
    loadChildren: () => import('./dvir/inspection.module').then((m) => m.InspectionModule) ,
  },
  {
    path: 'ifta',
    loadChildren: () => import('./ifta/ifta.module').then((m) => m.IftaModule) ,
  },
  {
    path: 'hos',
    loadChildren: () => import('./hos/hos.module').then((m) => m.HosModule) ,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplianceRoutingModule {}

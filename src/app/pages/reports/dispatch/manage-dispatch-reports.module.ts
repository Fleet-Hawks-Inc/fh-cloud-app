import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  
  {
    path: 'orders',
    loadChildren: () => import('./order-report/manage-orders.module').then((m) => m.ManageOrdersModule) ,
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/manage-trips.module').then((m) => m.ManageTripsModule) ,
  },
  {
    path: 'routes-report',
    loadChildren: () => import('./routes-report/manage-routes-report.module').then((m) => m.ManageRoutesReportModule) ,
  },
  {
    path: 'planner-report',
    loadChildren: () => import('./planner-report/manage-planner-report.module').then((m) => m.ManagePlannerReportModule) ,
  },
  {
    path: 'crossborder',
    loadChildren: () => import('./crossborder/manage-crossborder.module').then((m) => m.ManageCrossborderModule) ,
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/manage-documents.module').then((m) => m.ManageDocumentsModule) ,
  }
 
  
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageDispatchReportsModule { }

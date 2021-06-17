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

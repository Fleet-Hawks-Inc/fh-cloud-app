import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelReportComponent } from './fuel-report/fuel-report.component';
import { GeofenceReportComponent } from './geofence-report/geofence-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { IssuesReportComponent } from './issues-report/issues-report.component';
import { MaintenanceReportComponent } from './maintenance-report/maintenance-report.component';
import { RemindersReportComponent } from './reminders-report/reminders-report.component';


import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';


const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  
  {
    path: 'fuel-report',
    component: FuelReportComponent
  },
  {
    path: 'reminders-report',
    component: RemindersReportComponent
  },
  {
    path: 'issues-report',
    component: IssuesReportComponent
  },
  {
    path: 'maintenance-report',
    component: MaintenanceReportComponent
  },
  {
    path: 'inventory-report',
    component: InventoryReportComponent
  },
  {
    path: 'geofence-report',
    component: GeofenceReportComponent
  },
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/mange-drivers.module').then((m) => m.ManageDriverModule) ,
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./vehicle-report/mange-vehicle.module').then((m) => m.ManageVehicleModule) ,
  },
  {
    path: 'asset',
    loadChildren: () => import('./asset-report/mange-asset.module').then((m) => m.ManageAssetModule) ,
  }
]

@NgModule({
  declarations: [
    FuelReportComponent,
    GeofenceReportComponent,
    InventoryReportComponent,
    IssuesReportComponent,
    MaintenanceReportComponent,
    RemindersReportComponent,
  
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageReportsModule { }

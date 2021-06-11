import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuelReportComponent } from './fuel-report/fuel-report.component';
import { GeofenceReportComponent } from './geofence-report/geofence-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { IssuesReportComponent } from './issues-report/issues-report.component';
import { MaintenanceReportComponent } from './maintenance-report/maintenance-report.component';
import { RemindersReportComponent } from './reminders-report/reminders-report.component';
import { VehicleReportComponent } from './vehicle-report/vehicle-report.component';

import { AssetReportComponent } from './asset-report/asset-report.component';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';


const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'vehicle-report',
    component: VehicleReportComponent
  },
  {
    path: 'asset-report',
    component: AssetReportComponent
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
    VehicleReportComponent,
    AssetReportComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageReportsModule { }

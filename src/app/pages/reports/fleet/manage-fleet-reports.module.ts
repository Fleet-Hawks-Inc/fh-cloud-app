import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
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
  },
  {
    path: 'fuel',
    loadChildren: () => import('./fuel-report/mange-fuel.module').then((m) => m.ManageFuelModule) ,
  },
  {
    path: 'reminders',
    loadChildren: () => import('./reminders-report/mange-reminders.module').then((m) => m.ManageRemindersModule) ,
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance-report/mange-maintenance.module').then((m) => m.ManageMaitenanceModule) ,
  },
  {
    path: 'issues',
    loadChildren: () => import('./issues-report/mange-issues.module').then((m) => m.ManageIssuesModule) ,
  },
  {
    path: 'inventory',
    loadChildren: () => import('./inventory-report/mange-inventory.module').then((m) => m.ManageInventoryModule) ,
  },
  {
    path: 'geofence',
    loadChildren: () => import('./geofence-report/mange-geofence.module').then((m) => m.ManageGeofenceModule) ,
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageFleetReportsModule { }

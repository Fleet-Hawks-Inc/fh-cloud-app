import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartsModule} from 'ng2-charts';
import {
  DashboardDriverComponent,
} from './index';


const COMPONENTS = [
  DashboardDriverComponent,
];

const routes: Routes = [
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then((m) => m.DriversModule) ,
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./vehicles/vehicles.module').then((m) => m.VehiclesModule) ,
  },
  {
    path: 'assets',
    loadChildren: () => import('./assets/assets.module').then((m) => m.AssetsModule) ,
  },
  {
    path: 'fuel',
    loadChildren: () => import('./fuel/fuel.module').then((m) => m.FuelModule) ,
  },
  {
    path: 'reminders',
    loadChildren: () => import('./reminders/reminders.module').then((m) => m.RemindersModule) ,
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance/maintenance.module').then((m) => m.MaintenanceModule) ,
  },
  {
    path: 'geofence',
    loadChildren: () => import('./geofence/geofence.module').then((m) => m.GeofenceModule) ,
  },

  {
    path: 'live-driver',
    component: DashboardDriverComponent,
  },
  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.module').then((m) => m.InventroysModule) ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ChartsModule],
  exports: [RouterModule],
})
export class FleetRoutingModule {}

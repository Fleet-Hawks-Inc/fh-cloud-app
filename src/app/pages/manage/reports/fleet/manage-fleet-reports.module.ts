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
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageFleetReportsModule { }

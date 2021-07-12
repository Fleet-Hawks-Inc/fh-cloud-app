import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  
  // {
  //   path: 'geofence',
  //   loadChildren: () => import('./geofence-report/mange-geofence.module').then((m) => m.ManageGeofenceModule) ,
  // }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageGeneralSettingsModule { }

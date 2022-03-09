import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingRoutingModule } from './tracking-routing.module';

import { GMapModule } from 'primeng/gmap';
import { AssetTrackerComponent } from './asset-tracker/asset-tracker.component';
import { VehicleDashCamTrackerComponent } from './vehicle-dash-cam-tracker/vehicle-dash-cam-tracker.component';

@NgModule({
  declarations: [AssetTrackerComponent, VehicleDashCamTrackerComponent],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    GMapModule
  ]
})
export class TrackingModule { }

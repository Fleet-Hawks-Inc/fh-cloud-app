import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AssetTrackerComponent } from './asset-tracker/asset-tracker.component';
import { TrackingRoutingModule } from './tracking-routing.module';
import { VehicleDashCamTrackerComponent } from './vehicle-dash-cam-tracker/vehicle-dash-cam-tracker.component';




@NgModule({
  declarations: [AssetTrackerComponent, VehicleDashCamTrackerComponent],
  imports: [
    CommonModule,
    TrackingRoutingModule,

    GoogleMapsModule,
    ButtonModule,
    TooltipModule,
    ToastModule
  ]
})
export class TrackingModule { }

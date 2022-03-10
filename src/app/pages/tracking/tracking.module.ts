import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AssetTrackerComponent } from './asset-tracker/asset-tracker.component';
import { TrackingRoutingModule } from './tracking-routing.module';
import { VehicleDashCamTrackerComponent } from './vehicle-dash-cam-tracker/vehicle-dash-cam-tracker.component';
import { DialogModule } from 'primeng/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgSelectModule } from '@ng-select/ng-select';

import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [AssetTrackerComponent, VehicleDashCamTrackerComponent],
  imports: [
    CommonModule,
    TrackingRoutingModule,

    GoogleMapsModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
    DialogModule,
    RxReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    ClipboardModule,
    NgSelectModule
  ]
})
export class TrackingModule { }

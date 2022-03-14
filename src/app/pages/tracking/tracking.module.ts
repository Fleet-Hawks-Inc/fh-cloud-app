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
import { TableModule } from 'primeng/table';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ClipboardModule } from 'ngx-clipboard';
import { RippleModule } from 'primeng/ripple';
import { SplitterModule } from 'primeng/splitter';
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
    NgSelectModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    RippleModule,
    SplitterModule
  ]
})
export class TrackingModule { }

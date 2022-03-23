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
import { NgxEchartsModule } from 'ngx-echarts';
import { AccordionModule } from 'primeng/accordion';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
// Import bar charts, all with Chart suffix
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';
// Import the Canvas renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers';
import { TabViewModule } from 'primeng/tabview';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
echarts.use([TitleComponent, TooltipComponent, ToolboxComponent, GridComponent, DataZoomComponent, LineChart, CanvasRenderer]);
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
    SplitterModule,
    NgxEchartsModule.forRoot({

      echarts
    }),
    TabViewModule,
    AccordionModule,
    NgbModule
  ]
})
export class TrackingModule { }

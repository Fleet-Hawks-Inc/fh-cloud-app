import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { AddDeviceComponent } from "./add-device/add-device.component";
import { DeviceDetailComponent } from "./device-detail/device-detail.component";
import { DeviceListComponent } from "./device-list/device-list.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { Injectable } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
const routes: Routes = [
  {
    path: "add",
    component: AddDeviceComponent,
    data: { title: "Add Device" },
  },
  {
    path: "edit/:deviceType/:deviceSerialNo",
    component: AddDeviceComponent,
    data: { title: "Edit Device" },
  },
  {
    path: "list/:sessionID",
    component: DeviceListComponent,
    data: { title: "Devices List", reuseRoute: true  },
  },
  {
    path: "detail/:deviceType/:deviceSerialNo",
    component: DeviceDetailComponent,
    data: { title: "Device Detail" },
  },
];

@NgModule({
  declarations: [
    AddDeviceComponent,
    DeviceDetailComponent,
    DeviceListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    InfiniteScrollModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    ChartsModule,
    NgxDatatableModule,
    GoogleMapsModule,
    TableModule,
    MultiSelectModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule
  ],
})
export class DeviceModule { }

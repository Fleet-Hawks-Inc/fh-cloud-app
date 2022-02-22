import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { AddDeviceComponent } from "./add-device/add-device.component";
import { DeviceDetailComponent } from "./device-detail/device-detail.component";
import { DeviceListComponent } from "./device-list/device-list.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

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
    path: "list",
    component: DeviceListComponent,
    data: { title: "Devices List" },
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
  ],
})
export class DeviceModule {}

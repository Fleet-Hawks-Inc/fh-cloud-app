import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { DeletedVehiclesComponent } from "./deleted-vehicles/deleted-vehicles.component";
import { ImportedVehiclesComponent } from "./imported-vehicles/imported-vehicles.component";
import { VehicleSettingsComponent } from "./vehicle-settings.component";

const routes: Routes = [
  {
    path: "deleted-vehicles",
    component: DeletedVehiclesComponent,
    data: { title: "Deleted vehicles" },
  },
  {
    path: "imported-vehicles",
    component: ImportedVehiclesComponent,
    data: { title: "Imported vehicles" },
  },
  {
    path: "overview",
    component: VehicleSettingsComponent,
    data: { title: "Vehicles Settings" },
  },
];

@NgModule({
  declarations: [DeletedVehiclesComponent, ImportedVehiclesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    InfiniteScrollModule,
    NgSelectModule,
  ],
})
export class VehiclesSettingsModule {}

import { NgModule } from "@angular/core";

import { FleetRoutingModule } from "./fleet-routing.module";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";

import { AddVehicleNewComponent } from "../add-vehicle-new/add-vehicle-new.component";
import { EditVehicleNewComponent } from "./vehicles/edit-vehicle-new/edit-vehicle-new.component";
import { VehicleListComponent } from "./vehicles/vehicle-list/vehicle-list.component";

import { UserListComponent } from "./fleet-manager/user-list/user-list.component";
import { AddUserComponent } from "./fleet-manager/add-user/add-user.component";
import { EditUserComponent } from "./fleet-manager/edit-user/edit-user.component";

import { AddDriverComponent } from "./drivers/add-driver/add-driver.component";
import { EditDriverComponent } from "./drivers/edit-driver/edit-driver.component";
import { DriverListComponent } from "./drivers/driver-list/driver-list.component";
import { YardsComponent } from "./yards/yards/yards.component";
import { AddYardComponent } from "./yards/add-yard/add-yard.component";
import { EditYardComponent } from "./yards/edit-yard/edit-yard.component";

import { AddAssetsComponent } from "./assets/add-assets/add-assets.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";
import { EditAssetComponent } from "./assets/edit-asset/edit-asset.component";

@NgModule({
  imports: [FleetRoutingModule, FormsModule, CommonModule, SharedModule],
  declarations: [
    AddDriverComponent,
    EditDriverComponent,
    DriverListComponent,

    AddVehicleNewComponent,
    EditVehicleNewComponent,
    VehicleListComponent,

    UserListComponent,
    AddUserComponent,
    EditUserComponent,

    YardsComponent,
    AddYardComponent,
    EditYardComponent,

    AddAssetsComponent,
    EditAssetComponent,
    AssetListComponent,
  ],
  providers: [],
})
export class FleetModule {}

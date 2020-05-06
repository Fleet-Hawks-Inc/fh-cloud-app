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

import { AddFuelEntryComponent } from "./expenses/fuel-entry/add-fuel-entry/add-fuel-entry.component";
import { FuelEntryListComponent } from "./expenses/fuel-entry/fuel-entry-list/fuel-entry-list.component";
import { EditFuelEntryComponent } from "./expenses/fuel-entry/edit-fuel-entry/edit-fuel-entry.component";

import { AddTicketComponent } from "./expenses/tickets/add-ticket/add-ticket.component";
import { EditTicketComponent } from "./expenses/tickets/edit-ticket/edit-ticket.component";
import { TicketsComponent } from "./expenses/tickets/tickets/tickets.component";

import { AddExpenseTypeComponent } from "./expenses/types/add-expense-type/add-expense-type.component";
import { EditExpenseTypeComponent } from "./expenses/types/edit-expense-type/edit-expense-type.component";
import { ExpenseTypeListComponent } from "./expenses/types/expense-type-list/expense-type-list.component";

import { AddVendorComponent } from "./maintenance/vendor/add-vendor/add-vendor.component";
import { EditVendorComponent } from "./maintenance/vendor/edit-vendor/edit-vendor.component";
import { VendorsListComponent } from "./maintenance/vendor/vendors-list/vendors-list.component";

import { AddVehicleServiceLogComponent } from "./maintenance/vehicle-service-log/add-vehicle-service-log/add-vehicle-service-log.component";
import { EditVehicleServiceLogComponent } from "./maintenance/vehicle-service-log/edit-vehicle-service-log/edit-vehicle-service-log.component";
import { VehicleServiceLogsComponent } from "./maintenance/vehicle-service-log/vehicle-service-logs/vehicle-service-logs.component";

import { AddServiceProgramComponent } from "./maintenance/service-program/add-service-program/add-service-program.component";
import { EditServiceProgramComponent } from "./maintenance/service-program/edit-service-program/edit-service-program.component";
import { ServiceProgramListComponent } from "./maintenance/service-program/service-program-list/service-program-list.component";

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

    AddFuelEntryComponent,
    EditFuelEntryComponent,
    FuelEntryListComponent,

    AddTicketComponent,
    EditTicketComponent,
    TicketsComponent,

    AddExpenseTypeComponent,
    EditExpenseTypeComponent,
    ExpenseTypeListComponent,

    AddVendorComponent,
    EditVendorComponent,
    VendorsListComponent,

    AddVehicleServiceLogComponent,
    EditVehicleServiceLogComponent,
    VehicleServiceLogsComponent,

    AddServiceProgramComponent,
    EditServiceProgramComponent,
    ServiceProgramListComponent
  ],
  providers: [],
})
export class FleetModule {}

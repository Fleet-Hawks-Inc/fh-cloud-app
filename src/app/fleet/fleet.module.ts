import { NgModule,Injectable } from '@angular/core';

import { FleetRoutingModule } from './fleet-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AddVehicleNewComponent } from './vehicles/add-vehicle-new/add-vehicle-new.component';
import { EditVehicleNewComponent } from './vehicles/edit-vehicle-new/edit-vehicle-new.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './vehicles/vehicle-details/vehicle-details.component';


import { UserListComponent } from './fleet-manager/user-list/user-list.component';
import { AddUserComponent } from './fleet-manager/add-user/add-user.component';
import { EditUserComponent } from './fleet-manager/edit-user/edit-user.component';

import { AddDriverComponent } from './drivers/add-driver/add-driver.component';
import { EditDriverComponent } from './drivers/edit-driver/edit-driver.component';
import { DriverListComponent } from './drivers/driver-list/driver-list.component';

import { YardsComponent } from './yards/yards/yards.component';
import { AddYardComponent } from './yards/add-yard/add-yard.component';
import { EditYardComponent } from './yards/edit-yard/edit-yard.component';

import { AddAssetsComponent } from './assets/add-assets/add-assets.component';
import { AssetListComponent } from './assets/asset-list/asset-list.component';
import { EditAssetComponent } from './assets/edit-asset/edit-asset.component';

import { AddFuelEntryComponent } from './expenses/fuel-entry/add-fuel-entry/add-fuel-entry.component';
import { FuelEntryListComponent } from './expenses/fuel-entry/fuel-entry-list/fuel-entry-list.component';
import { EditFuelEntryComponent } from './expenses/fuel-entry/edit-fuel-entry/edit-fuel-entry.component';

import { AddTicketComponent } from './expenses/tickets/add-ticket/add-ticket.component';
import { EditTicketComponent } from './expenses/tickets/edit-ticket/edit-ticket.component';
import { TicketsComponent } from './expenses/tickets/tickets/tickets.component';

import { AddExpenseTypeComponent } from './expenses/types/add-expense-type/add-expense-type.component';
import { EditExpenseTypeComponent } from './expenses/types/edit-expense-type/edit-expense-type.component';
import { ExpenseTypeListComponent } from './expenses/types/expense-type-list/expense-type-list.component';

import { AddVendorComponent } from './maintenance/vendor/add-vendor/add-vendor.component';
import { EditVendorComponent } from './maintenance/vendor/edit-vendor/edit-vendor.component';
import { VendorsListComponent } from './maintenance/vendor/vendors-list/vendors-list.component';

import { AddVehicleServiceLogComponent } from './maintenance/vehicle-service-log/add-vehicle-service-log/add-vehicle-service-log.component';
import { EditVehicleServiceLogComponent } from './maintenance/vehicle-service-log/edit-vehicle-service-log/edit-vehicle-service-log.component';
import { VehicleServiceLogsComponent } from './maintenance/vehicle-service-log/vehicle-service-logs/vehicle-service-logs.component';

import { AddServiceProgramComponent } from './maintenance/service-program/add-service-program/add-service-program.component';
import { EditServiceProgramComponent } from './maintenance/service-program/edit-service-program/edit-service-program.component';
import { ServiceProgramListComponent } from './maintenance/service-program/service-program-list/service-program-list.component';

import { AddItemComponent } from './inventory/items/add-item/add-item.component';
import { EditItemComponent } from './inventory/items/edit-item/edit-item.component';
import { ItemsListComponent } from './inventory/items/items-list/items-list.component';

import { AddItemGroupComponent } from './inventory/item-group/add-item-group/add-item-group.component';
import { EditItemGroupComponent } from './inventory/item-group/edit-item-group/edit-item-group.component';
import { ItemGroupListComponent } from './inventory/item-group/item-group-list/item-group-list.component';

import { AddEntryComponent } from './inventory/stock-entry/add-entry/add-entry.component';
import { EditEntryComponent } from './inventory/stock-entry/edit-entry/edit-entry.component';
import { EntriesComponent } from './inventory/stock-entry/entries/entries.component';

import { AddStockAssignmentComponent } from './inventory/stock-assignment/add-stock-assignment/add-stock-assignment.component';
import { EditStockAssignmentComponent } from './inventory/stock-assignment/edit-stock-assignment/edit-stock-assignment.component';
import { StockAssignmentListComponent } from './inventory/stock-assignment/stock-assignment-list/stock-assignment-list.component';

import { InventoryStockStatementComponent } from './inventory/inventory-stock-statement/inventory-stock-statement.component';


import { AddGeofenceComponent } from './geofence/add-geofence/add-geofence.component';
import { EditGeofenceComponent } from './geofence/edit-geofence/edit-geofence.component';
import { GeofenceListComponent } from './geofence/geofence-list/geofence-list.component';

import {GraphComponent} from './graphs/graph/graph.component';
import {ChartsModule} from 'ng2-charts';
import {AddVehicleComponent} from './vehicles/add-vehicle/add-vehicle.component';
import {EditVehicleComponent} from './vehicles/edit-vehicle/edit-vehicle.component';
import { DashboardDriverComponent } from './dashboard-driver/dashboard-driver.component';
import { FuelDetailsComponent } from './expenses/fuel-entry/fuel-details/fuel-details.component';
import { DriverProfileComponent } from './drivers/driver-profile/driver-profile.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select'; 
import { ɵs } from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}


@NgModule({
  imports: [
    FleetRoutingModule,
            FormsModule,
            CommonModule,
            SharedModule,
            ChartsModule,
            NgSelectModule,
            CarouselModule,
            NgbModule,
            NgMultiSelectDropDownModule.forRoot(),
            RouterModule
            

  ],
  declarations: [
    
    AddDriverComponent,
    EditDriverComponent,
    DriverListComponent,
    VehicleDetailsComponent,

    AddVehicleComponent,
    EditVehicleComponent,

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
    FuelDetailsComponent,

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
    ServiceProgramListComponent,

    AddItemComponent,
    EditItemComponent,
    ItemsListComponent,

    AddItemGroupComponent,
    EditItemGroupComponent,
    ItemGroupListComponent,

    AddEntryComponent,
    EditEntryComponent,
    EntriesComponent,

    AddStockAssignmentComponent,
    EditStockAssignmentComponent,
    StockAssignmentListComponent,

    InventoryStockStatementComponent,

    AddGeofenceComponent,
    EditGeofenceComponent,
    GeofenceListComponent,

    GraphComponent,

    DashboardDriverComponent,

    DriverProfileComponent,

 

    
  ],
  providers: [NgSelectConfig,ɵs,{provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}],
})
export class FleetModule {}

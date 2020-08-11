import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddDriverComponent } from './drivers/add-driver/add-driver.component';
import { EditDriverComponent } from './drivers/edit-driver/edit-driver.component';
import { DriverListComponent } from './drivers/driver-list/driver-list.component';
import { DriverProfileComponent } from './drivers/driver-profile/driver-profile.component';


import { AddVehicleComponent } from './vehicles/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './vehicles/edit-vehicle/edit-vehicle.component';

import { AddVehicleNewComponent } from './vehicles/add-vehicle-new/add-vehicle-new.component';
import { EditVehicleNewComponent } from './vehicles/edit-vehicle-new/edit-vehicle-new.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './vehicles/vehicle-details/vehicle-details.component';


import { AddUserComponent } from './fleet-manager/add-user/add-user.component';
import { EditUserComponent } from './fleet-manager/edit-user/edit-user.component';
import { UserListComponent } from './fleet-manager/user-list/user-list.component';

import { AddYardComponent } from './yards/add-yard/add-yard.component';
import { EditYardComponent } from './yards/edit-yard/edit-yard.component';
import { YardsComponent } from './yards/yards/yards.component';

import { AddAssetsComponent } from './assets/add-assets/add-assets.component';
import { AssetListComponent } from './assets/asset-list/asset-list.component';
import { EditAssetComponent } from './assets/edit-asset/edit-asset.component';

import { AddFuelEntryComponent } from './expenses/fuel-entry/add-fuel-entry/add-fuel-entry.component';
import { FuelEntryListComponent } from './expenses/fuel-entry/fuel-entry-list/fuel-entry-list.component';
import { EditFuelEntryComponent } from './expenses/fuel-entry/edit-fuel-entry/edit-fuel-entry.component';
import { FuelDetailsComponent } from './expenses/fuel-entry/fuel-details/fuel-details.component';


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
import { GraphComponent } from './graphs/graph/graph.component';
import { ChartsModule } from 'ng2-charts';
import { DashboardDriverComponent } from './dashboard-driver/dashboard-driver.component';

const routes: Routes = [
  {
    path: 'drivers',
    children: [
      { path: 'Add-Driver', component: AddDriverComponent },
      { path: 'Edit-Driver', component: EditDriverComponent },
      { path: 'Drivers-List', component: DriverListComponent },
      { path: 'Driver-Profile', component: DriverProfileComponent },
    ],
  },
  {
    path: 'vehicles',
    children: [
      { path: 'Add-Vehicle-New', component: AddVehicleNewComponent },
      {
        path: 'Edit-Vehicle-New/:vehicleID',
        component: AddVehicleNewComponent,
      },
      {
        path: 'Vehicle-Details',
        component: VehicleDetailsComponent,
      },
      { path: 'Vehicle-List', component: VehicleListComponent },
    ],
  },
  {
    path: 'fleet-manager',
    children: [
      { path: 'Add-User', component: AddUserComponent },
      { path: 'Edit-User/:userName', component: EditUserComponent },
      { path: 'User-List', component: UserListComponent },
    ],
  },
  {
    path: 'yards',
    children: [
      { path: 'Add-Yard', component: AddYardComponent },
      { path: 'Edit-Yard/:yardID', component: EditYardComponent },
      { path: 'Yard-List', component: YardsComponent },
    ],
  },
  {
    path: 'assets',
    children: [
      { path: 'Add-Assets', component: AddAssetsComponent },
      { path: 'Assets-List', component: AssetListComponent },
      { path: 'Edit-Asset/:assetID', component: EditAssetComponent },
    ],
  },
  {
    path: 'expenses',
    children: [
      {
        path: 'fuel',
        children: [
          {
            path: 'Add-Fuel-Entry',
            component: AddFuelEntryComponent,
          },
          {
            path: 'Fuel-Entry-List',
            component: FuelEntryListComponent,
          },
          {
            path: 'Edit-Fuel-Entry/:entryID',
            component: EditFuelEntryComponent,
          },
          {
            path: 'Fuel-Details/:entryID',
            component: FuelDetailsComponent,
          },
        ],
      },
      {
        path: 'tickets',
        children: [
          {
            path: 'Add-Ticket',
            component: AddTicketComponent,
          },
          {
            path: 'Tickets-List',
            component: TicketsComponent,
          },
          {
            path: 'Edit-Ticket/:ticketID',
            component: EditTicketComponent,
          },
        ],
      },
      {
        path: 'types',
        children: [
          {
            path: 'Add-Expense-Type',
            component: AddExpenseTypeComponent,
          },
          {
            path: 'Expenses-Type-List',
            component: ExpenseTypeListComponent,
          },
          {
            path: 'Edit-Expense-Type/:expenseTypeID',
            component: EditExpenseTypeComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'maintenance',
    children: [
      {
        path: 'vendor',
        children: [
          {
            path: 'Add-Vendor',
            component: AddVendorComponent,
          },
          {
            path: 'Vendors-List',
            component: VendorsListComponent,
          },
          {
            path: 'Edit-Vendor/:vendorID',
            component: EditVendorComponent,
          },
        ],
      },
      {
        path: 'vehicle-service-log',
        children: [
          {
            path: 'Add-Vehicle-Service-Log',
            component: AddVehicleServiceLogComponent,
          },
          {
            path: 'Vehicle-Service-Logs-List',
            component: VehicleServiceLogsComponent,
          },
          {
            path: 'Edit-Vehicle-Service-Log/:logID',
            component: EditVehicleServiceLogComponent,
          },
        ],
      },
      {
        path: 'service-program',
        children: [
          {
            path: 'Add-Service-Program',
            component: AddServiceProgramComponent,
          },
          {
            path: 'Service-Program-List',
            component: ServiceProgramListComponent,
          },
          {
            path: 'Edit-Service-Program/:programID',
            component: EditServiceProgramComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'inventory',
    children: [
      {
        path: 'item',
        children: [
          {
            path: 'Add-Item',
            component: AddItemComponent,
          },
          {
            path: 'Item-List',
            component: ItemsListComponent,
          },
          {
            path: 'Edit-Item/:itemID',
            component: EditItemComponent,
          },
        ],
      },
      {
        path: 'item-group',
        children: [
          {
            path: 'Add-Item-Group',
            component: AddItemGroupComponent,
          },
          {
            path: 'Item-Group-List',
            component: ItemGroupListComponent,
          },
          {
            path: 'Edit-Item-Group/:groupID',
            component: EditItemGroupComponent,
          },
        ],
      },
      {
        path: 'stock-entry',
        children: [
          {
            path: 'Add-Entry',
            component: AddEntryComponent,
          },
          {
            path: 'Entries-List',
            component: EntriesComponent,
          },
          {
            path: 'Edit-Entry/:entryID',
            component: EditEntryComponent,
          },
        ],
      },
      {
        path: 'stock-assignment',
        children: [
          {
            path: 'Add-Stock-Assignment',
            component: AddStockAssignmentComponent,
          },
          {
            path: 'Stock-Assignment-List',
            component: StockAssignmentListComponent,
          },
          {
            path: 'Edit-Stock-Assignment/:assignmentID',
            component: EditStockAssignmentComponent,
          },
        ],
      },
      {
        path: 'Inventory-Stock-Statement',
        component: InventoryStockStatementComponent,
      },
    ],
  },
  {
    path: 'geofence',
    children: [
      { path: 'Add-Geofence', component: AddGeofenceComponent },
      { path: 'Edit-Geofence', component: EditGeofenceComponent },
      { path: 'Geofence-List', component: GeofenceListComponent },
    ],
  },
  {
    path: 'graphs',
    children: [{ path: 'view-graph', component: GraphComponent }],
  },
  {
    path: 'Driver-Dashboard',
    component: DashboardDriverComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ChartsModule],
  exports: [RouterModule],
})
export class FleetRoutingModule {}

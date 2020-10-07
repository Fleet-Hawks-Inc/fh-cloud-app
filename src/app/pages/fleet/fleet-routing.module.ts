import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartsModule} from 'ng2-charts';
import {
  AddUserComponent,
  EditUserComponent,
  UserListComponent,
  AddYardComponent,
  EditYardComponent,
  YardsComponent,
  AddAssetsComponent,
  AssetListComponent,
  AssetDetailComponent,
  AddFuelEntryComponent,
  FuelEntryListComponent,
  EditFuelEntryComponent,
  AddTicketComponent,
  TicketsComponent,
  EditTicketComponent,
  AddExpenseTypeComponent,
  ExpenseTypeListComponent,
  EditExpenseTypeComponent,
  ListingComponent,
  AddReminderComponent,
  ServiceRemindDetailComponent,
  VehicleRenewListComponent,
  VehicleRenewAddComponent,
  VehicleRenewDetailComponent,
  ListContactRenewComponent,
  AddContactRenewComponent,
  ContactRenewDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  EditServiceProgramComponent,
  ServiceProgramDetailComponent,
  AddVendorComponent,
  VendorsListComponent,
  EditVendorComponent,
  AddVehicleServiceLogComponent,
  VehicleServiceLogsComponent,
  EditVehicleServiceLogComponent,
  AddItemComponent,
  ItemsListComponent,
  ItemDetailComponent,
  EditItemComponent,
  AddItemGroupComponent,
  ItemGroupListComponent,
  EditItemGroupComponent,
  AddEntryComponent,
  EntriesComponent,
  EditEntryComponent,
  AddStockAssignmentComponent,
  StockAssignmentListComponent,
  EditStockAssignmentComponent,
  InventoryStockStatementComponent,
  AddGeofenceComponent,
  EditGeofenceComponent,
  GeofenceListComponent,
  GraphComponent,
  DashboardDriverComponent
} from './index';

const COMPONENTS = [
  AddUserComponent,
  EditUserComponent,
  UserListComponent,
  AddYardComponent,
  EditYardComponent,
  YardsComponent,
  AddAssetsComponent,
  AssetListComponent,
  AssetDetailComponent,
  AddFuelEntryComponent,
  FuelEntryListComponent,
  EditFuelEntryComponent,
  AddTicketComponent,
  TicketsComponent,
  EditTicketComponent,
  AddExpenseTypeComponent,
  ExpenseTypeListComponent,
  EditExpenseTypeComponent,
  ListingComponent,
  AddReminderComponent,
  ServiceRemindDetailComponent,
  VehicleRenewListComponent,
  VehicleRenewAddComponent,
  VehicleRenewDetailComponent,
  ListContactRenewComponent,
  AddContactRenewComponent,
  ContactRenewDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  EditServiceProgramComponent,
  ServiceProgramDetailComponent,
  AddVendorComponent,
  VendorsListComponent,
  EditVendorComponent,
  AddVehicleServiceLogComponent,
  VehicleServiceLogsComponent,
  EditVehicleServiceLogComponent,
  AddItemComponent,
  ItemsListComponent,
  ItemDetailComponent,
  EditItemComponent,
  AddItemGroupComponent,
  ItemGroupListComponent,
  EditItemGroupComponent,
  AddEntryComponent,
  EntriesComponent,
  EditEntryComponent,
  AddStockAssignmentComponent,
  StockAssignmentListComponent,
  EditStockAssignmentComponent,
  InventoryStockStatementComponent,
  AddGeofenceComponent,
  EditGeofenceComponent,
  GeofenceListComponent,
  GraphComponent,
  DashboardDriverComponent
];

const routes: Routes = [
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then((m) => m.DriversModule) ,
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./vehicles/vehicles.module').then((m) => m.VehiclesModule) ,
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
      { path: 'asset-detail/:assetID', component: AssetDetailComponent },
      { path: 'Edit-Asset/:assetID', component: AddAssetsComponent },
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
    path: 'reminders',
    children: [
      {
        path: 'service-reminder',
        children: [
          { path: 'list', component: ListingComponent },
          { path: 'add-reminder', component: AddReminderComponent },
          { path: 'edit-reminder/:reminderID', component: AddReminderComponent },
          { path: 'detail/:reminderID', component: ServiceRemindDetailComponent },
        ],
      },
      {
        path: 'vehicle-renewals',
        children: [
          { path: 'list', component: VehicleRenewListComponent },
          { path: 'add', component: VehicleRenewAddComponent },
          { path: 'detail', component: VehicleRenewDetailComponent },
        ],
      },
      {
        path: 'contact-renewals',
        children: [
          { path: 'list', component: ListContactRenewComponent },
          { path: 'add', component: AddContactRenewComponent },
          { path: 'detail', component: ContactRenewDetailComponent },
        ],
      },
    ],
  },
  {
    path: 'issues',
    children: [
      { path: 'list', component: IssueListComponent },
      { path: 'add-issue', component: AddIssueComponent },
      { path: 'issue-detail', component: IssueDetailComponent },
    ],
  },
  {
    path: 'maintenance',
    children: [
      // {
      //   path: 'issues',
      //   children: [
      //     { path: 'list', component: IssueListComponent },
      //     { path: 'add-issue', component: AddIssueComponent },
      //     { path: 'issue-detail', component: IssueDetailComponent },
      //   ],
      // },
      {
        path: 'service-log',
        children: [
          { path: 'list', component: ServiceListComponent },
          { path: 'add-service', component: AddServiceComponent },
          { path: 'service-detail', component: ServiceDetailComponent },
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
          {
            path: 'service-program-detail',
            component: ServiceProgramDetailComponent,
          },
        ],
      },
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
            path: 'item-detail',
            component: ItemDetailComponent,
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
      { path: 'Edit-Geofence/:fenceID', component: EditGeofenceComponent },
      { path: 'Geofence-List', component: GeofenceListComponent },
    ],
  },
  {
    path: 'graphs',
    children: [{ path: 'view-graph', component: GraphComponent }],
  },
  {
    path: 'live-driver',
    component: DashboardDriverComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ChartsModule],
  exports: [RouterModule],
})
export class FleetRoutingModule {}

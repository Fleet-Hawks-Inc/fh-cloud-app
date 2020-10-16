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
  DashboardDriverComponent,
  EditAssetComponent,
  FuelEntryDetailsComponent
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
  DashboardDriverComponent,
  EditAssetComponent,
  FuelEntryDetailsComponent
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
      { path: 'add', component: AddAssetsComponent },
      { path: 'list', component: AssetListComponent },
      { path: 'detail/:assetID', component: AssetDetailComponent },
      { path: 'edit/:assetID', component: AddAssetsComponent },
    ],
  },
  {
    path: 'expenses',
    children: [
      {
        path: 'fuel',
        children: [
          {
            path: 'Add',
            component: AddFuelEntryComponent,
          },
          {
            path: 'List',
            component: FuelEntryListComponent,
          },
          {
            path: 'Edit/:entryID',
            component: AddFuelEntryComponent,
          },
          {
            path: 'Details/:entryID',
            component: FuelEntryDetailsComponent,
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
          { path: 'add', component: AddReminderComponent },
          { path: 'edit/:reminderID', component: AddReminderComponent },
          { path: 'detail/:reminderID', component: ServiceRemindDetailComponent },
        ],
      },
      {
        path: 'vehicle-renewals',
        children: [
          { path: 'list', component: VehicleRenewListComponent },
          { path: 'add', component: VehicleRenewAddComponent },
          { path: 'detail', component: VehicleRenewDetailComponent },
          { path: 'edit/:reminderID', component: VehicleRenewAddComponent},
        ],
      },
      {
        path: 'contact-renewals',
        children: [
          { path: 'list', component: ListContactRenewComponent },
          { path: 'add', component: AddContactRenewComponent },
          { path: 'detail', component: ContactRenewDetailComponent },
          { path: 'edit/:reminderID', component: AddContactRenewComponent },
        ],
      },
    ],
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance/maintenance.module').then((m) => m.MaintenanceModule) ,
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
      { path: 'add', component: AddGeofenceComponent },
      { path: 'edit/:fenceID', component: AddGeofenceComponent },
      { path: 'list', component: GeofenceListComponent },
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

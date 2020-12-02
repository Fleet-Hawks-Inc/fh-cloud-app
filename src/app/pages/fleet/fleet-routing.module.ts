import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartsModule} from 'ng2-charts';
import {
  AddUserComponent,
  EditUserComponent,
  UserListComponent,
  AddAssetsComponent,
  AssetListComponent,
  AssetDetailComponent,
  AddFuelEntryComponent,
  FuelEntryListComponent,
  EditFuelEntryComponent,
  FuelEntryDetailsComponent,
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
  AddGeofenceComponent,
  EditGeofenceComponent,
  GeofenceListComponent,
  GraphComponent,
  DashboardDriverComponent,
  EditAssetComponent,

  AddInventoryComponent,
  EditInventoryComponent,
  InventoryListComponent,
  InventoryDetailComponent

} from './index';


const COMPONENTS = [
  AddUserComponent,
  EditUserComponent,
  UserListComponent,
  AddAssetsComponent,
  AssetListComponent,
  AssetDetailComponent,
  AddFuelEntryComponent,
  FuelEntryListComponent,
  EditFuelEntryComponent,
  FuelEntryDetailsComponent,
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
  AddGeofenceComponent,
  EditGeofenceComponent,
  GeofenceListComponent,
  GraphComponent,
  DashboardDriverComponent,
  EditAssetComponent,


  AddInventoryComponent,
  EditInventoryComponent,
  InventoryListComponent,
  InventoryDetailComponent
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

            path: 'add',
            component: AddFuelEntryComponent,
          },
          {
            path: 'list',
            component: FuelEntryListComponent,
          },
          {
            path: 'edit/:entryID',
            component: AddFuelEntryComponent,
          },
          {
            path: 'detail/:entryID',
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
            path: 'add',
            component: AddExpenseTypeComponent,
          },
          {
            path: 'list',
            component: ExpenseTypeListComponent,
          },
          {
            path: 'edit/:expenseTypeID',
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
  {
    path: 'inventory',
    children: [
      { path: 'add', component: AddInventoryComponent },
      { path: 'edit/:itemID', component: EditInventoryComponent },
      { path: 'list', component: InventoryListComponent },
      { path: 'detail/:itemID', component: InventoryDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ChartsModule],
  exports: [RouterModule],
})
export class FleetRoutingModule {}

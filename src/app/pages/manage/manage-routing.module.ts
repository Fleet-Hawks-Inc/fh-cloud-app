import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent
} from './index';
import { AssetReportComponent } from './reports/asset-report/asset-report.component';
import { DriverSummaryComponent } from './reports/drivers/driver-summary/driver-summary.component';
import { DriversComponent } from './reports/drivers/drivers.component';
import { FuelReportComponent } from './reports/fuel-report/fuel-report.component';
import { GeofenceReportComponent } from './reports/geofence-report/geofence-report.component';
import { InventoryReportComponent } from './reports/inventory-report/inventory-report.component';
import { IssuesReportComponent } from './reports/issues-report/issues-report.component';
import { MaintenanceReportComponent } from './reports/maintenance-report/maintenance-report.component';
import { RemindersReportComponent } from './reports/reminders-report/reminders-report.component';
import { ReportsComponent } from './reports/reports.component';
import { VehicleReportComponent } from './reports/vehicle-report/vehicle-report.component';
import {SettingsComponent} from './settings/settings.component'

const COMPONENTS = [
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  SettingsComponent
];

const routes: Routes = [
  {
    path: 'users',
    children: [
      { path: 'add', component: AddUserComponent },
      { path: 'list', component: UsersListComponent},
      { path: 'detail/:contactID', component: UserDetailsComponent },
      { path: 'edit/:contactID', component: AddUserComponent},
    ],
  },
  {
    path: 'company',
    children: [
      { path: 'detail/:companyID', component: CompanyProfileComponent },
      { path: 'edit/:carrierID', component: EditProfileComponent }

    ],
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'drivers',
    loadChildren:()=>import("./reports/drivers/mange-drivers.module").then((m)=>m.ManageDriverModule)
    
    
  },
  {
    path: 'vehicle-report',
    component: VehicleReportComponent
  },
  {
    path: 'asset-report',
    component: AssetReportComponent
  },
  {
    path: 'fuel-report',
    component: FuelReportComponent
  },
  {
    path: 'reminders-report',
    component: RemindersReportComponent
  },
  {
    path: 'issues-report',
    component: IssuesReportComponent
  },
  {
    path: 'maintenance-report',
    component: MaintenanceReportComponent
  },
  {
    path: 'inventory-report',
    component: InventoryReportComponent
  },
  {
    path: 'geofence-report',
    component: GeofenceReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

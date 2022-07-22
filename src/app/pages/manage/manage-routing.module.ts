import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddAlertsComponent } from "./alerts/add-alerts/add-alerts.component";
import { AlertsListComponent } from "./alerts/alerts-list/alerts-list.component";

import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent,
} from "./index";
import { ManagemainComponent } from "./managemain/managemain.component";

const routes: Routes = [
  {
    path: "users",
    children: [
      { path: "add", component: AddUserComponent, data: { title: "Add User" } },
      {
        path: "list/:sessionID",
        component: UsersListComponent,
        data: { title: "Users List", reuseRoute: true },
      },
      {
        path: "detail/:contactID",
        component: UserDetailsComponent,
        data: { title: "User Detail" },
      },
      {
        path: "edit/:contactID",
        component: AddUserComponent,
        data: { title: "Edit User" },
      },
    ],
  },

  {
    path: "alerts",
    children: [
      {
        path: "list",
        component: AlertsListComponent,
        data: { title: "Alerts List" },
      },
      {
        path: "add",
        component: AddAlertsComponent,
        data: { title: "Add Alert" },
      },
    ],
  },

  {
    path: "company",
    children: [
      {
        path: "detail/:companyID",
        component: CompanyProfileComponent,
        data: { title: "Company Detail" },
      },
      {
        path: "edit/:carrierID",
        component: EditProfileComponent,
        data: { title: "Edit Company" },
      },
    ],
  },
  // {
  //   path: 'settings',
  //   component: SettingsComponent
  // },
  {
    path: "overview",
    component: ManagemainComponent,
    data: { title: "Manage" },
  },

  {
    path: "settings",
    loadChildren: () =>
      import("./settings/manage-settings.module").then(
        (m) => m.ManageSettingsModule
      ),
    data: { title: "Settings" },
  },
  {
    path: "devices",
    loadChildren: () =>
      import("./devices/devices.module").then((m) => m.DeviceModule),
    data: { title: "Devices" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}

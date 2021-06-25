import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllReportsComponent } from './all-reports/all-reports.component';
import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent
} from './index';
import { ManagemainComponent } from './managemain/managemain.component';

import {SettingsComponent} from './settings/settings.component';


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
    path: 'overview',
    component: ManagemainComponent
  },
  {
    path: 'reports',
    component: AllReportsComponent
  },
  {
    path: 'fleet',
    loadChildren: () => import('./reports/fleet/manage-fleet-reports.module').then((m) => m.ManageFleetReportsModule) ,
  },
  {
    path: 'dispatch',
    loadChildren: () => import('./reports/dispatch/manage-dispatch-reports.module').then((m) => m.ManageDispatchReportsModule) ,
  },
  {
    path: 'safety',
    loadChildren: () => import('./reports/safety/manage-safety-reports.module').then((m) => m.ManageSafetyReportsModule) ,
  },
  {
    path: 'compliance',
    loadChildren: () => import('./reports/compliance-reports/manage-compliance-reports.module').then((m) => m.ManageComplianceReportsModule) ,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

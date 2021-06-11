import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent
} from './index';

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
    path: 'reports',
    loadChildren: () => import('./reports/manage-reports.module').then((m) => m.ManageReportsModule) ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

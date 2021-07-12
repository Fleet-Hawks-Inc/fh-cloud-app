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
  // {
  //   path: 'settings',
  //   component: SettingsComponent
  // },
  {
    path: 'overview',
    component: ManagemainComponent
  },
  {
    path: 'allreport',
    component: AllReportsComponent
  },

  {
    path: 'reports',
    loadChildren: () => import('./reports/manage-reports.module').then((m) => m.ManageReportsModule) ,
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/manage-settings.module').then((m) => m.ManageSettingsModule) ,
  }

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

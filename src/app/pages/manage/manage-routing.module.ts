import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent
} from './index';

const COMPONENTS = [
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
];

const routes: Routes = [
  {
    path: 'users',
    children: [
      { path: 'add', component: AddUserComponent },
      { path: 'list', component: UsersListComponent},
      { path: 'detail/:userID', component: UserDetailsComponent },
      { path: 'edit/:userID', component: AddUserComponent},
    ],
  },
  {
    path: 'company',
    children: [
      { path: 'detail/:companyID', component: CompanyProfileComponent },
      { path: 'edit/:carrierID', component: EditProfileComponent }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

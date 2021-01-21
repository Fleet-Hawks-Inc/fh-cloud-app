import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }

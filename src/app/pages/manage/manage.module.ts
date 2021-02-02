import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageRoutingModule } from './manage-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../shared/shared.module';
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

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ManageRoutingModule,
    NgSelectModule,
    DataTablesModule,
    SharedModule
  ]
})
export class ManageModule { }

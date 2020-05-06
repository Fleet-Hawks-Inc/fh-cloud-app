import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AddDriverComponent} from './drivers/add-driver/add-driver.component';
import {EditDriverComponent} from './drivers/edit-driver/edit-driver.component';
import {DriverListComponent} from './drivers/driver-list/driver-list.component';

import {AddVehicleNewComponent} from '../add-vehicle-new/add-vehicle-new.component';
import {EditVehicleNewComponent} from './vehicles/edit-vehicle-new/edit-vehicle-new.component';
import {VehicleListComponent} from './vehicles/vehicle-list/vehicle-list.component';

import {AddUserComponent} from './fleet-manager/add-user/add-user.component';
import {EditUserComponent} from './fleet-manager/edit-user/edit-user.component';
import {UserListComponent} from './fleet-manager/user-list/user-list.component';

import {AddYardComponent} from './yards/add-yard/add-yard.component';
import {EditYardComponent} from './yards/edit-yard/edit-yard.component';
import {YardsComponent} from './yards/yards/yards.component';

import { AddAssetsComponent } from "./assets/add-assets/add-assets.component";
import { AssetListComponent } from "./assets/asset-list/asset-list.component";
import { EditAssetComponent } from "./assets/edit-asset/edit-asset.component";

const routes: Routes = [
  {
    path: 'drivers',
    children: [
      { path: 'Add-Driver', component: AddDriverComponent },
      { path: 'Edit-Driver/:userName', component: EditDriverComponent },
      { path: 'Drivers-List', component: DriverListComponent },
    ],
  },
  {
    path: 'vehicles',
    children: [
      {path: 'Add-Vehicle-New', component: AddVehicleNewComponent},
      {path: 'Edit-Vehicle-New/:userName', component: EditVehicleNewComponent},
      {path: 'Vehicle-List', component: VehicleListComponent},
    ],
  },
  {
    path: 'fleet-manager',
    children: [
      { path: 'Add-User', component: AddUserComponent },
      { path: 'Edit-User/:userName', component: EditUserComponent },
      { path: 'User-List', component: UserListComponent },
    ]
  },
  {
    path: 'yards',
    children: [
      { path: 'Add-Yard', component: AddYardComponent },
      { path: 'Edit-Yard/:yardID', component: EditYardComponent },
      { path: 'Yard-List', component: YardsComponent },
    ]
  },
  {
    path: 'assets',
    children: [
      { path: "Add-Assets", component: AddAssetsComponent },
      { path: "Assets-List", component: AssetListComponent },
      { path: "Edit-Asset/:assetID", component: EditAssetComponent },
    ]
  }


];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FleetRoutingModule { }

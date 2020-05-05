import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddDriverComponent} from './drivers/add-driver/add-driver.component';
import {EditDriverComponent} from './drivers/edit-driver/edit-driver.component';
import {DriverListComponent} from './drivers/driver-list/driver-list.component';
import {HeaderComponent} from '../header/header.component';
import {FormsModule} from '@angular/forms';


const routes: Routes = [
  {
    path: 'drivers',
    component: AddDriverComponent,
    children: [
      { path: 'Add-Driver', component: AddDriverComponent },
      { path: 'Edit-Driver/:userName', component: EditDriverComponent },
      { path: 'Drivers-List', component: DriverListComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FleetRoutingModule { }

import { NgModule } from '@angular/core';


import {AddDriverComponent} from './drivers/add-driver/add-driver.component';
import {EditDriverComponent} from './drivers/edit-driver/edit-driver.component';
import {DriverListComponent} from './drivers/driver-list/driver-list.component';
import { FleetRoutingModule } from './fleet-routing.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    FleetRoutingModule,
    FormsModule ,
    CommonModule ,
  ],
  declarations: [
    AddDriverComponent,
    EditDriverComponent,
    DriverListComponent

  ],
  providers: [

  ]
})
export class FleetModule {}

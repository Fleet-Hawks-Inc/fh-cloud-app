import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {AddDriverComponent} from './add-driver/add-driver.component';
import {EditDriverComponent} from './edit-driver/edit-driver.component';
import {DriverListComponent} from './driver-list/driver-list.component';
import {DriverDetailComponent} from './driver-detail/driver-detail.component';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
  { path: 'Add-Driver', component: AddDriverComponent },
  { path: 'Edit-Driver/:userName', component: EditDriverComponent },
  { path: 'Drivers-List', component: DriverListComponent },
  { path: 'driver-detail', component: DriverDetailComponent}
];
@NgModule({
  declarations: [
    AddDriverComponent,
    EditDriverComponent,
    DriverListComponent,
    DriverDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],

})
export class DriversModule {}

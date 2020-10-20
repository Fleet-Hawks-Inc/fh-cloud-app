import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../../shared/shared.module';

import {AddVehicleNewComponent} from './add-vehicle-new/add-vehicle-new.component';
import {EditVehicleNewComponent} from './edit-vehicle-new/edit-vehicle-new.component';
import {VehicleListComponent} from './vehicle-list/vehicle-list.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';

const routes: Routes = [
  { path: 'add', component: AddVehicleNewComponent },
  { path: 'edit/:vehicleID', component: EditVehicleNewComponent },
  { path: 'list', component: VehicleListComponent },
  { path: 'detail/:vehicleID', component: VehicleDetailComponent },
];
@NgModule({
  declarations: [
    AddVehicleNewComponent,
    EditVehicleNewComponent,
    VehicleListComponent,
    VehicleDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule
  ],

})
export class VehiclesModule {}

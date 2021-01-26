import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';
import {MultiSidebarComponents} from './sidebars/multi-sidebar.component';
import {HeaderComponent} from './header/header.component';
import {FixedRightSidebarComponent} from './sidebars/fixed-right-sidebar/fixed-right-sidebar.component';
import {AddressBookComponent} from './popups/address-book/address-book.component';
import { SharedModalsComponent} from './popups/shared-modals/shared-modals.component';
import {DriverComponent} from './popups/driver/driver.component';
import {VehicleComponent} from './popups/vehicle/vehicle.component';
// DataTable
import { DataTablesModule } from 'angular-datatables';
import { AddDriverComponent} from '../pages/fleet/drivers/add-driver/add-driver.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddVehicleNewComponent } from '../pages/fleet/vehicles/add-vehicle-new/add-vehicle-new.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    DataTablesModule,
    NgSelectModule,
    NgbModule,
    SlickCarouselModule
  ],
  declarations: [
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,
    FixedRightSidebarComponent,
    AddressBookComponent,
    DriverComponent,
    VehicleComponent,
    AddDriverComponent,
    AddVehicleNewComponent,
    SharedModalsComponent
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,
    DriverComponent,
    VehicleComponent,
    SidebarComponent,
    FixedRightSidebarComponent
  ]
})
export class SharedModule {
}

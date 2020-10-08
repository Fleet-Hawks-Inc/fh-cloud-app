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
import {DriverComponent} from './popups/driver/driver.component';
import {VehicleComponent} from './popups/vehicle/vehicle.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [
    SidebarComponent,
    MultiSidebarComponents,
    HeaderComponent,
    FixedRightSidebarComponent,
    AddressBookComponent,
    DriverComponent,
    VehicleComponent

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
    VehicleComponent

  ]
})
export class SharedModule {
}

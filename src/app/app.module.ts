import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { RFormsComponent } from './r-forms/r-forms.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { AddQuantumComponent } from './add-quantum/add-quantum.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AddDriverComponent,
    SidebarComponent,
    HeaderComponent,
    AddVehicleComponent,
    LeftBarComponent,
    RFormsComponent,
    CompanyInfoComponent,
    AddQuantumComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

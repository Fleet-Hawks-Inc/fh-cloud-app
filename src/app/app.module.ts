import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './entry/login/login.component';
import { LogoutComponent } from './entry/logout/logout.component';
import { HealthcheckComponent } from './entry/healthcheck/healthcheck.component';
import { MapDashboardComponent } from './entry/map-dashboard/map-dashboard.component';
import { DashboardComponent } from './entry/dashboard/dashboard.component';
import { LeftBarComponent } from './entry/left-bar/left-bar.component';

import { NavOpenedDirective } from './directives/nav-opened.directive';
import { SharedModule } from './shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';

// Authentication
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
// JWT interceptors
import { HttpInterceptorProviders } from './interceptors/interceptor.provider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// mqtt
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { environment } from '../environments/environment';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';
import {DataTablesModule} from 'angular-datatables';
import {PreLoadStrategy} from './preload/PreLoadStrategy';
import { SharedModalComponent } from './shared/shared-modal/shared-modal.component';
import { PdfautomationComponent } from './pdfautomation/pdfautomation.component';


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.HOSTNAME,
  port: environment.PORT,
  path: environment.MQTTPATH,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LeftBarComponent,
    LogoutComponent,
    HealthcheckComponent,
    MapDashboardComponent,
    NavOpenedDirective,
    SharedModalComponent,
    PdfautomationComponent,
  ],
  imports: [
    AmplifyAngularModule,
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    ChartsModule,
    SharedModule,
    ToastrModule.forRoot(), // ToastrModule added
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgMultiSelectDropDownModule.forRoot(),
    SlickCarouselModule,
    NgxSpinnerModule,
    NgSelect2Module,
    DataTablesModule,
  ],
  providers: [AmplifyService, HttpInterceptorProviders, PreLoadStrategy],
  bootstrap: [AppComponent],
})
export class AppModule {}

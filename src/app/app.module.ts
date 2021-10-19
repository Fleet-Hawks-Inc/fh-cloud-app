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

import { LoginComponent } from './entry/login/login.component';
import { MapDashboardComponent } from './entry/map-dashboard/map-dashboard.component';
import { DashboardComponent } from './entry/dashboard/dashboard.component';

import { NavOpenedDirective } from './directives/nav-opened.directive';
import { SharedModule } from './shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';


// JWT interceptors
import { HttpInterceptorProviders } from './interceptors/interceptor.provider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// mqtt
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { environment } from '../environments/environment';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PreLoadStrategy } from './preload/PreLoadStrategy';
import { SharedModalComponent } from './shared/shared-modal/shared-modal.component';
import { DynamicModalDirective } from './directives/dynamic-modal.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ErrorComponent } from './error/error.component';
import { UnsavedChangesComponent } from './unsaved-changes/unsaved-changes.component';

import { AddAccountComponent } from './entry/onboard/add-account/add-account.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { InvokeHeaderFnService } from './services/invoke-header-fn.service';
import { ForgotPasswordComponent } from './entry/forgot-password/forgot-password.component';
import { GoogleMapsModule } from '@angular/google-maps';


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
    MapDashboardComponent,
    NavOpenedDirective,
    SharedModalComponent,
    DynamicModalDirective,
    ErrorComponent,
    UnsavedChangesComponent,
    AddAccountComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    ChartsModule,
    SharedModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }), // ToastrModule added
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgMultiSelectDropDownModule.forRoot(),
    SlickCarouselModule,
    NgxSpinnerModule,
    NgSelectModule,
    NgxCaptchaModule,
    GoogleMapsModule


  ],
  providers: [HttpInterceptorProviders, PreLoadStrategy, InvokeHeaderFnService],
  bootstrap: [AppComponent],
})
export class AppModule { }

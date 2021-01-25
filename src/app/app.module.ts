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

import { PdfAutomationComponent } from './pages/automation/pdf-automation/pdf-automation.component';
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
import {DynamicModalDirective} from './directives/dynamic-modal.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxTagsInputModule } from 'ngx-tags-input';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AddAccountComponent  } from './pages/onboard/add-account/add-account.component';
import { ConfirmEqualValidatorDirective } from './directives/confirm-equal-validator.directive';
import { AddAlertComponent } from './pages/alerts/add-alert/add-alert.component';
import { AlertDetailComponent } from './pages/alerts/alert-detail/alert-detail.component';
import { AlertListComponent } from './pages/alerts/alert-list/alert-list.component';
import { AlertTypeDetailComponent } from './pages/alerts/alert-type-detail/alert-type-detail.component';
import { ErrorComponent } from './error/error.component';
import { UnsavedChangesComponent } from './unsaved-changes/unsaved-changes.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
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
    AddAccountComponent,
    PdfAutomationComponent,
    DynamicModalDirective,
    ConfirmEqualValidatorDirective,
    AddAlertComponent,
    AlertDetailComponent,
    AlertListComponent,
    AlertTypeDetailComponent,
    ErrorComponent,
    UnsavedChangesComponent,   
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
    TooltipModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgMultiSelectDropDownModule.forRoot(),
    SlickCarouselModule,
    NgxSpinnerModule,
    NgSelect2Module,
    DataTablesModule,
    NgxTagsInputModule,
    NgSelectModule,
  ],
  providers: [AmplifyService, HttpInterceptorProviders, PreLoadStrategy],
  bootstrap: [AppComponent],
})
export class AppModule {}

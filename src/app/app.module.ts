import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { LoginComponent } from "./entry/login/login.component";
import { MapDashboardComponent } from "./entry/map-dashboard/map-dashboard.component";
import { DashboardComponent } from "./entry/dashboard/dashboard.component";
import { ListOrganizationsComponent } from "./entry/list-organizations/list-organizations.component";

import { NavOpenedDirective } from "./directives/nav-opened.directive";
import { SharedModule } from "./shared/shared.module";
import { ChartsModule } from "ng2-charts";
import { ToastrModule } from "ngx-toastr";
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';

// JWT interceptors
import { HttpInterceptorProviders } from "./interceptors/interceptor.provider";
import { MatProgressBarModule } from "@angular/material/progress-bar";

// mqtt
import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";
import { environment } from "../environments/environment";

import { SlickCarouselModule } from "ngx-slick-carousel";
import { NgxSpinnerModule } from "ngx-spinner";
import { PreLoadStrategy } from "./preload/PreLoadStrategy";
import { SharedModalComponent } from "./shared/shared-modal/shared-modal.component";
import { DynamicModalDirective } from "./directives/dynamic-modal.directive";
import { NgSelectModule } from "@ng-select/ng-select";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ErrorComponent } from "./error/error.component";
import { UnsavedChangesComponent } from "./unsaved-changes/unsaved-changes.component";

import { AddAccountComponent } from "./entry/onboard/add-account/add-account.component";
import { NgxCaptchaModule } from "ngx-captcha";
import { InvokeHeaderFnService } from "./services/invoke-header-fn.service";
import { ForgotPasswordComponent } from "./entry/forgot-password/forgot-password.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouteReuseStrategy } from "@angular/router";
import { CustomRouteReuseStrategy } from "./services/customRouteReuseService";
import { LocationShareComponent } from "./entry/location-share/location-share.component";
import { GlobalErrorHandler } from "./interceptors/GlobalErrorHandler";
import { SubscriptionOnboardComponent } from "./entry/subscription-onboard/subscription-onboard.component";
import { NgOtpInputModule } from "ng-otp-input";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

// Prime NG Imports
import { TableModule } from "primeng/table";

//Loading bar
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { AutoCompleteModule } from "primeng/autocomplete";
import { MultiSelectModule } from "primeng/multiselect";

import { TrackingModule } from "./pages/tracking/tracking.module";
import { VehicleDashCamTrackerComponent } from "./pages/tracking/vehicle-dash-cam-tracker/vehicle-dash-cam-tracker.component";
import { AssetTrackerComponent } from "./pages/tracking/asset-tracker/asset-tracker.component";
import { ToastMessagesComponent } from './toast-messages/toast-messages.component';
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';

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
    LocationShareComponent,
    SubscriptionOnboardComponent,
    ListOrganizationsComponent,
    ToastMessagesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: "serverApp" }),
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
    GoogleMapsModule,
    RxReactiveFormsModule,
    NgOtpInputModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    AutoCompleteModule,
    DropdownModule,
    TrackingModule,
    BadgeModule,
    DialogModule,
    ToastModule
  ],
  providers: [
    HttpInterceptorProviders,
    PreLoadStrategy,
    InvokeHeaderFnService,
    MessageService,
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

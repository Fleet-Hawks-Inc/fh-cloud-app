import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { DashboardComponent } from "./entry/dashboard/dashboard.component";
import { ListOrganizationsComponent } from "./entry/list-organizations/list-organizations.component";
import { LoginComponent } from "./entry/login/login.component";
import { MapDashboardComponent } from "./entry/map-dashboard/map-dashboard.component";

import { ChartsModule } from "ng2-charts";
import { ToastrModule } from "ngx-toastr";
import { BadgeModule } from "primeng/badge";
import { DialogModule } from "primeng/dialog";
import { NavOpenedDirective } from "./directives/nav-opened.directive";
import { SharedModule } from "./shared/shared.module";

// JWT interceptors
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { HttpInterceptorProviders } from "./interceptors/interceptor.provider";

// mqtt
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { environment } from "../environments/environment";

import { NgSelectModule } from "@ng-select/ng-select";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { NgxSpinnerModule } from "ngx-spinner";
import { DynamicModalDirective } from "./directives/dynamic-modal.directive";
import { ErrorComponent } from "./error/error.component";
import { PreLoadStrategy } from "./preload/PreLoadStrategy";
import { SharedModalComponent } from "./shared/shared-modal/shared-modal.component";
import { UnsavedChangesComponent } from "./unsaved-changes/unsaved-changes.component";

import { GoogleMapsModule } from "@angular/google-maps";
import { RouteReuseStrategy } from "@angular/router";
import { NgOtpInputModule } from "ng-otp-input";
import { NgxCaptchaModule } from "ngx-captcha";
import { ForgotPasswordComponent } from "./entry/forgot-password/forgot-password.component";
import { LocationShareComponent } from "./entry/location-share/location-share.component";
import { AddAccountComponent } from "./entry/onboard/add-account/add-account.component";
import { SubscriptionOnboardComponent } from "./entry/subscription-onboard/subscription-onboard.component";
import { GlobalErrorHandler } from "./interceptors/GlobalErrorHandler";
import { CustomRouteReuseStrategy } from "./services/customRouteReuseService";
import { InvokeHeaderFnService } from "./services/invoke-header-fn.service";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

// Prime NG Imports
import { TableModule } from "primeng/table";

//Loading bar
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";

import { MessageService } from "primeng/api";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { SidebarModule } from "primeng/sidebar";
import { ToastModule } from "primeng/toast";
import { TrackingModule } from "./pages/tracking/tracking.module";
import { ToastMessagesComponent } from "./toast-messages/toast-messages.component";
import { CheckboxModule } from "primeng/checkbox";
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
    ToastModule,
    SidebarModule,
    CardModule,
    InputTextModule,
    CheckboxModule,
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
export class AppModule {}

import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./entry/dashboard/dashboard.component";
import { LoginComponent } from "./entry/login/login.component";
import { AuthService } from "./services/";

import { MapDashboardComponent } from "./entry/map-dashboard/map-dashboard.component";

import { ChartsModule } from "ng2-charts";
import { AddAccountComponent } from "./entry/onboard/add-account/add-account.component";
import { PreLoadStrategy } from "./preload/PreLoadStrategy";

import { HttpClientModule } from "@angular/common/http";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ForgotPasswordComponent } from "./entry/forgot-password/forgot-password.component";
import { ListOrganizationsComponent } from "./entry/list-organizations/list-organizations.component";
import { LocationShareComponent } from "./entry/location-share/location-share.component";
import { SubscriptionOnboardComponent } from "./entry/subscription-onboard/subscription-onboard.component";
import { ErrorComponent } from "./error/error.component";
import { unsavedChangesGuard } from "./guards/unsaved-changes.guard";
import { AppLayoutComponent } from "./layout/app.layout.component";
import { CheckProfileServiceService } from "./services/check-profile-service.service";
import { CheckUserService } from "./services/check-user.service";

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      { path: "", redirectTo: "/Login", pathMatch: "full" },
      { path: "Login", component: LoginComponent, data: { title: "Login" } },
      {
        path: "onboard",
        component: AddAccountComponent,
        data: { title: "Onboard" },
      },
      { path: "subOnboard/:id", component: SubscriptionOnboardComponent },
      {
        path: "forgotPassword",
        component: ForgotPasswordComponent,
        data: { title: "Forgot Password" },
      },
      {
        path: "location-share/:token",
        component: LocationShareComponent,
        data: { title: "Location Share" },
      },
      {
        path: "Dashboard",
        component: DashboardComponent,
        data: { title: "Dashboard" },
        canActivate: [AuthService, CheckProfileServiceService],
      },

      {
        path: "Map-Dashboard",
        component: MapDashboardComponent,
        canActivate: [CheckProfileServiceService, AuthService],
        data: { title: "Entire Fleet" },
      },
      {
        path: "organizations",
        component: ListOrganizationsComponent,
        data: { title: "Organizations List" },
      },

      {
        path: "fleet",
        loadChildren: () =>
          import("./pages/fleet/fleet.module").then((m) => m.FleetModule),
        data: { preload: true, title: "Fleet" },
        canActivate: [
          AuthService,
          CheckUserService,
          CheckProfileServiceService,
        ],
      },
      {
        path: "compliance",
        loadChildren: () =>
          import("./pages/compliance/compliance.module").then(
            (m) => m.ComplianceModule
          ),
        data: { preload: false, title: "Compliance" },
        canActivate: [AuthService, CheckProfileServiceService],
      },
      {
        path: "dispatch",
        loadChildren: () =>
          import("./pages/dispatch/dispatch.module").then(
            (m) => m.DispatchModule
          ),
        data: { preload: false, title: "Routing & Dispatch" },
        canActivate: [AuthService, CheckProfileServiceService],
      },
      {
        path: "accounts",
        loadChildren: () =>
          import("./pages/accounts/accounts.module").then(
            (m) => m.AccountsModule
          ),
        data: { preload: false, title: "Accounts" },
        canActivate: [AuthService, CheckProfileServiceService],
      },
      {
        path: "safety",
        loadChildren: () =>
          import("./pages/safety/safety.module").then((m) => m.SafetyModule),
        data: { preload: false, title: "Safety" },
        canActivate: [AuthService, CheckProfileServiceService],
      },
      {
        path: "manage",
        loadChildren: () =>
          import("./pages/manage/manage.module").then((m) => m.ManageModule),
        data: { preload: false, title: "Manage" },
        canActivate: [AuthService, CheckProfileServiceService],
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./pages/reports/manage-reports.module").then(
            (m) => m.ManageReportsModule
          ),
        data: { title: "Reports" },
        canActivate: [AuthService, CheckProfileServiceService],
      },

      {
        path: "404",
        component: ErrorComponent,
      },
      {
        path: "**",
        redirectTo: "/404",
      },
    ],
  },
];
@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreLoadStrategy,
      useHash: true,
      relativeLinkResolution: "legacy",
    }),
    CommonModule,
    ChartsModule,
  ],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    unsavedChangesGuard,
    NgbModalConfig,
    NgbModal,
  ],
})
export class AppRoutingModule {}

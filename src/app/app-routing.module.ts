import { NgModule } from '@angular/core';
import { CommonModule, PathLocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './entry/login/login.component';
import { DashboardComponent } from './entry/dashboard/dashboard.component';
import { AuthService } from './services/';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { MapDashboardComponent } from './entry/map-dashboard/map-dashboard.component';


import { ChartsModule } from 'ng2-charts';
import { PreLoadStrategy } from './preload/PreLoadStrategy';
import { AddAccountComponent } from './entry/onboard/add-account/add-account.component';

import { ErrorComponent } from './error/error.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { UnsavedChangesComponent } from './unsaved-changes/unsaved-changes.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AllCarriersComponent } from './shared/all-carriers/all-carriers.component';
import { CheckUserService } from './services/check-user.service';
import { CheckProfileServiceService } from './services/check-profile-service.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ForgotPasswordComponent } from './entry/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'onboard', component: AddAccountComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthService,CheckProfileServiceService],
  },
  {
    path: 'Map-Dashboard',
    component: MapDashboardComponent,
    canActivate: [CheckProfileServiceService,AuthService],
  },
  {
    path: 'fleet',
    loadChildren: () => import('./pages/fleet/fleet.module').then((m) => m.FleetModule),
    data: { preload: true },
    canActivate: [AuthService, CheckUserService,CheckProfileServiceService],
  },
  {
    path: 'compliance',
    loadChildren: () => import('./pages/compliance/compliance.module').then((m) => m.ComplianceModule),
    data: { preload: false },
    canActivate: [AuthService,CheckProfileServiceService]
  },
  {
    path: 'dispatch',
    loadChildren: () => import('./pages/dispatch/dispatch.module').then((m) => m.DispatchModule), data: { preload: false },
    canActivate: [AuthService,CheckProfileServiceService]
  },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then((m) => m.AccountsModule), data: { preload: false },
    canActivate: [AuthService,CheckProfileServiceService]
  },
  {
    path: 'safety',
    loadChildren: () => import('./pages/safety/safety.module').then((m) => m.SafetyModule), data: { preload: false },
    canActivate: [AuthService,CheckProfileServiceService]
  },
  {
    path: 'manage',
    loadChildren: () => import('./pages/manage/manage.module').then((m) => m.ManageModule), data: { preload: false },
    canActivate: [AuthService,CheckProfileServiceService]
  },
  {
    path: "404",
    component: ErrorComponent
  },
  {
    path: "**",
    redirectTo: '/404'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreLoadStrategy,
      useHash: true
    }
  ), CommonModule, ChartsModule],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, unsavedChangesGuard, NgbModalConfig, NgbModal],

})

export class AppRoutingModule { }


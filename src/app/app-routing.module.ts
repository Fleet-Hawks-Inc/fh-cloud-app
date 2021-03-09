import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './entry/login/login.component';
import { DashboardComponent } from './entry/dashboard/dashboard.component';
import { AuthService } from './services/';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { LeftBarComponent } from './entry/left-bar/left-bar.component';
import { HealthcheckComponent } from './entry/healthcheck/healthcheck.component';
import { MapDashboardComponent } from './entry/map-dashboard/map-dashboard.component';


import { ChartsModule } from 'ng2-charts';
import { PreLoadStrategy } from './preload/PreLoadStrategy';
import { PdfAutomationComponent } from './pages/automation/pdf-automation/pdf-automation.component';
import { AddAccountComponent } from './entry/onboard/add-account/add-account.component';

import { ErrorComponent } from './error/error.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { UnsavedChangesComponent } from './unsaved-changes/unsaved-changes.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AllCarriersComponent } from './shared/all-carriers/all-carriers.component';
import { CheckUserService } from './services/check-user.service';

const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'onboard', component: AddAccountComponent },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },
  {
    path: 'Map-Dashboard',
    component: MapDashboardComponent,
    canActivate: [AuthService],
  },
  {
    path: 'pdf-automation',
    component: PdfAutomationComponent,
    canActivate: [AuthService],
  },
  { path: 'healthcheck', component: HealthcheckComponent },
  {
    path: 'fleet',
    loadChildren: () => import('./pages/fleet/fleet.module').then((m) => m.FleetModule),
    data: { preload: true },
    canActivate: [AuthService, CheckUserService],
  },
  {
    path: 'compliance',
    loadChildren: () => import('./pages/compliance/compliance.module').then((m) => m.ComplianceModule),
    data: { preload: false },
    canActivate: [AuthService]
  },
  {
    path: 'dispatch',
    loadChildren: () => import('./pages/dispatch/dispatch.module').then((m) => m.DispatchModule), data: { preload: false },
    canActivate: [AuthService]
  },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then((m) => m.AccountsModule), data: { preload: false },
    canActivate: [AuthService]
  },
  {
    path: 'safety',
    loadChildren: () => import('./pages/safety/safety.module').then((m) => m.SafetyModule), data: { preload: false },
    canActivate: [AuthService]
  },
  {
    path: 'manage',
    loadChildren: () => import('./pages/manage/manage.module').then((m) => m.ManageModule), data: { preload: false },
    canActivate: [AuthService]
  },
  {
    path: 'Left-Bar', component: LeftBarComponent, canActivate: [AuthService]
  },
  {
    path: "404",
    component: ErrorComponent
  },
  {
    path: "carriers",
    component: AllCarriersComponent
  },
  {
    path: "**",
    redirectTo: '/404'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreLoadStrategy
    }
  )],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, unsavedChangesGuard, NgbModalConfig, NgbModal],
  entryComponents: [
    UnsavedChangesComponent,
  ]
})
@NgModule({
  declarations: [],
  imports: [CommonModule,
    ChartsModule],

})
export class AppRoutingModule { }


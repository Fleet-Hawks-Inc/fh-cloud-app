import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './entry/login/login.component';
import { DashboardComponent } from './entry/dashboard/dashboard.component';
import { AuthService } from './services/';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { LeftBarComponent } from './entry/left-bar/left-bar.component';
import { HealthcheckComponent } from './entry/healthcheck/healthcheck.component';
import { MapDashboardComponent } from './entry/map-dashboard/map-dashboard.component';


import {ChartsModule} from 'ng2-charts';
import {PreLoadStrategy} from './preload/PreLoadStrategy';
import { PdfAutomationComponent } from './pages/automation/pdf-automation/pdf-automation.component';
import { AddAccountComponent  } from './pages/onboard/add-account/add-account.component';

import { AddAlertComponent } from './pages/alerts/add-alert/add-alert.component';
import { AlertDetailComponent } from './pages/alerts/alert-detail/alert-detail.component';
import { AlertListComponent } from './pages/alerts/alert-list/alert-list.component';
const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'onboard', component: AddAccountComponent },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },
  { path: 'add-alert', component: AddAlertComponent },
  { path: 'alert-detail', component: AlertDetailComponent },
  { path: 'alert-list', component: AlertListComponent },
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
  // { path: 'Register', component: RegisterComponent },
   {
    path: 'fleet',
    // canActivate: [AuthService],
    // data: { roles: [Role.Admin] },
    loadChildren: () => import('./pages/fleet/fleet.module').then((m) => m.FleetModule) ,
    data: { preload: true }
  },
  {
    path: 'compliance',
    loadChildren: () => import('./pages/compliance/compliance.module').then((m) => m.ComplianceModule),
   data: { preload: false }
},
  {
    path: 'dispatch',
    loadChildren: () => import('./pages/dispatch/dispatch.module').then((m) => m.DispatchModule), data: { preload: false }
  },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then((m) => m.AccountsModule), data: { preload: false }
  },
  {
    path: 'safety',
    loadChildren: () => import('./pages/safety/safety.module').then((m) => m.SafetyModule), data: { preload: false }
  },

  { path: 'Left-Bar', component: LeftBarComponent },



];
@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreLoadStrategy
    }
    )],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
@NgModule({
  declarations: [],
  imports: [CommonModule,
  ChartsModule],
})
export class AppRoutingModule {}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './auth.service';
import { AddDriverComponent } from "./add-driver/add-driver.component";
import { AddVehicleComponent } from "./add-vehicle/add-vehicle.component";
import { LeftBarComponent } from "./left-bar/left-bar.component";
import { RFormsComponent } from "./r-forms/r-forms.component";
import { AddQuantumComponent } from "./add-quantum/add-quantum.component";
import { AddUserComponent } from "./add-user/add-user.component";
const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthService] },
  { path: 'Add-Vehicle', component: AddVehicleComponent, canActivate: [AuthService] },
  { path: 'Left-Bar', component: LeftBarComponent },
  { path: 'R-Forms', component: RFormsComponent },
  { path: 'Add-Quantum', component: AddQuantumComponent },
  { path: 'Add-User', component: AddUserComponent }
  // {path : 'Ndashboard', component : NewDashboardComponent},
  // {path : 'temp', component : TempComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }

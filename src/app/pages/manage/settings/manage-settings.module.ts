import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsOverviewComponent } from './settings-overview/settings-overview.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { MyAccountComponent } from './my-account/my-account.component';


const routes: Routes = [
  
  { path: 'overview', component: SettingsOverviewComponent },
  { path: 'general', component: GeneralSettingsComponent },
  { path: 'myaccount', component: MyAccountComponent },
    
]

@NgModule({
  declarations: [SettingsOverviewComponent, GeneralSettingsComponent, MyAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageSettingsModule { }

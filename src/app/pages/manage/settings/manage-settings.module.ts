import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsOverviewComponent } from './settings-overview/settings-overview.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { DriverSettingComponent } from './driver-setting/driver-setting.component';
import { VehicleSettingComponent } from './vehicle-setting/vehicle-setting.component';
import { AssetsSettingComponent } from './assets-setting/assets-setting.component';
import { FuelSettingComponent } from './fuel-setting/fuel-setting.component';
import { RemindersSettingComponent } from './reminders-setting/reminders-setting.component';
import { IssueSettingComponent } from './issue-setting/issue-setting.component';


const routes: Routes = [
  
  { path: 'overview', component: SettingsOverviewComponent },
  { path: 'general', component: GeneralSettingsComponent },
  { path: 'myaccount', component: MyAccountComponent },
  { path: 'driver', component: DriverSettingComponent },
  { path: 'vehicle', component: VehicleSettingComponent },
  { path: 'asset', component: AssetsSettingComponent },
  { path: 'fuel', component: FuelSettingComponent },
  { path: 'reminders', component: RemindersSettingComponent },
  { path: 'issue', component: IssueSettingComponent },
    
]

@NgModule({
  declarations: [SettingsOverviewComponent,
    GeneralSettingsComponent,
    MyAccountComponent,
    DriverSettingComponent,
    VehicleSettingComponent,
    AssetsSettingComponent,
    FuelSettingComponent,
    RemindersSettingComponent,
    IssueSettingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ManageSettingsModule { }

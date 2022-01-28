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
import { DispatchSettingComponent } from './dispatch-setting/dispatch-setting.component';
import { ComplianceSettingComponent } from './compliance-setting/compliance-setting.component';
import { SafetySettingComponent } from './safety-setting/safety-setting.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomerSettingComponent } from './customer-setting/customer-setting.component';
import { DoverviewComponent } from './settings-overview/doverview/doverview.component';
import { ImportDriversComponent } from './import-drivers/import-drivers.component';

const routes: Routes = [

  { path: 'overview', component: SettingsOverviewComponent },
  { path: 'doverview', component: DoverviewComponent},
  { path: 'general', component: GeneralSettingsComponent },
  { path: 'myaccount', component: MyAccountComponent },
  { path: 'driver', component: DriverSettingComponent },
  { path: 'import', component: ImportDriversComponent},
  { path: 'vehicle', component: VehicleSettingComponent },
  { path: 'asset', component: AssetsSettingComponent },
  { path: 'fuel', component: FuelSettingComponent },
  { path: 'reminders', component: RemindersSettingComponent },
  { path: 'issue', component: IssueSettingComponent },
  { path: 'dispatch', component: DispatchSettingComponent },
  { path: 'compliance', component: ComplianceSettingComponent },
  { path: 'safety', component: SafetySettingComponent },
  { path: 'customer', component: CustomerSettingComponent },
  { path: 'importoverview', component: ImportOverviewComponent },
  { path: 'vehimport', component: VehImportComponent },

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
    IssueSettingComponent,
    DispatchSettingComponent,
    ComplianceSettingComponent,
    SafetySettingComponent,
    CustomerSettingComponent,
    DoverviewComponent,
    ImportDriversComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    InfiniteScrollModule,
    NgSelectModule,
  ]
})
export class ManageSettingsModule { }

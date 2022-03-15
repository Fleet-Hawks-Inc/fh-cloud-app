import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SettingsOverviewComponent } from "./settings-overview/settings-overview.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { MyAccountComponent } from "./my-account/my-account.component";
import { DriverSettingComponent } from "./driver-setting/driver-setting.component";
import { VehicleSettingComponent } from "./vehicle-setting/vehicle-setting.component";
import { AssetsSettingComponent } from "./assets-setting/assets-setting.component";
import { FuelSettingComponent } from "./fuel-setting/fuel-setting.component";
import { RemindersSettingComponent } from "./reminders-setting/reminders-setting.component";
import { IssueSettingComponent } from "./issue-setting/issue-setting.component";
import { DispatchSettingComponent } from "./dispatch-setting/dispatch-setting.component";
import { ComplianceSettingComponent } from "./compliance-setting/compliance-setting.component";
import { SafetySettingComponent } from "./safety-setting/safety-setting.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { CustomerSettingComponent } from "./customer-setting/customer-setting.component";
import { VehImportComponent } from './veh-import/veh-import.component';
import { DoverviewComponent } from "./settings-overview/doverview/doverview.component";
import { ImportDriversComponent } from "./import-drivers/import-drivers.component";

import { VehicleSettingsComponent } from './vehicle-settings/vehicle-settings.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';


const routes: Routes = [
  { path: "overview", component: SettingsOverviewComponent },
  {
    path: 'vehicles',
    loadChildren: () => import('./vehicle-settings/vehicles-settings.module').then((m) => m.VehiclesSettingsModule),
    data: { title: 'Vehicles Settings' }
  },
  {
    path: "driver-overview",
    component: DoverviewComponent,
    data: { title: "Driver Settings" },
  },

  { path: "general", component: GeneralSettingsComponent },
  { path: "myaccount", component: MyAccountComponent },
  {
    path: "driver",
    component: DriverSettingComponent,
    data: { title: "Deleted Drivers" },
  },
  { path: "import", component: ImportDriversComponent },
  {
    path: "vehicle",
    component: VehicleSettingComponent,
    data: { title: "Deleted Vehicle" },
  },
  {
    path: "asset",
    component: AssetsSettingComponent,
    data: { title: "Deleted Assets" },
  },
  {
    path: "fuel",
    component: FuelSettingComponent,
    data: { title: "Deleted Fuel" },
  },
  {
    path: "reminders",
    component: RemindersSettingComponent,
    data: { title: "Deleted Reminders" },
  },
  {
    path: "issue",
    component: IssueSettingComponent,
    data: { title: "Deleted Issue" },
  },
  {
    path: "dispatch",
    component: DispatchSettingComponent,
    data: { title: "Dispatch Settings" },
  },
  {
    path: "compliance",
    component: ComplianceSettingComponent,
    data: { title: "Compliance Settings" },
  },
  {
    path: "safety",
    component: SafetySettingComponent,
    data: { title: "Safety Settings" },
  },
  {
    path: "customer",
    component: CustomerSettingComponent,
    data: { title: "Customer Settings" },
  },
  {
    path: 'import-vehicle',
    component: VehImportComponent
  },
];

@NgModule({
  declarations: [
    SettingsOverviewComponent,
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
    VehImportComponent,
    ImportDriversComponent,
    VehicleSettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    InfiniteScrollModule,
    NgSelectModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
  ],
})
export class ManageSettingsModule {}

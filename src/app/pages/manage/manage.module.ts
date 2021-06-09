import {Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageRoutingModule } from './manage-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReportsComponent} from './reports/reports.component'
import {
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent
} from './index';
import { SettingsComponent } from './settings/settings.component';

import { VehicleReportComponent } from './reports/vehicle-report/vehicle-report.component';
import { AssetReportComponent } from './reports/asset-report/asset-report.component';
import { FuelReportComponent } from './reports/fuel-report/fuel-report.component';
import { RemindersReportComponent } from './reports/reminders-report/reminders-report.component';
import { IssuesReportComponent } from './reports/issues-report/issues-report.component';
import { MaintenanceReportComponent } from './reports/maintenance-report/maintenance-report.component';
import { InventoryReportComponent } from './reports/inventory-report/inventory-report.component';
import { GeofenceReportComponent } from './reports/geofence-report/geofence-report.component';


const COMPONENTS = [
  AddUserComponent,
  UserDetailsComponent,
  UsersListComponent,
  CompanyProfileComponent,
  EditProfileComponent,
  SettingsComponent,
  ReportsComponent
];


  /**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string): NgbDateStruct {
    if (!value)
      return null
    let parts = value.split(this.DELIMITER);
    return {
      year: + parseInt(parts[0]),
      month: + parseInt(parts[1]),
      day: + parseInt(parts[2]) }
  }

  toModel(date: NgbDateStruct): string // from internal model -> your mode
  {
    return date ? date.year + this.DELIMITER + ('0' + date.month).slice(-2)
      + this.DELIMITER + ('0' + date.day).slice(-2) : null
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}
@NgModule({
  declarations: [
    ...COMPONENTS,
    SettingsComponent,

    VehicleReportComponent,
    AssetReportComponent,
    FuelReportComponent,
    RemindersReportComponent,
    IssuesReportComponent,
    MaintenanceReportComponent,
    InventoryReportComponent,
    GeofenceReportComponent,


  ],
  providers: [ {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}],
  imports: [
    CommonModule,
    FormsModule,
    ManageRoutingModule,
    NgSelectModule,
    SharedModule,
    NgbModule
  ],exports: [...COMPONENTS],
})
export class ManageModule { }

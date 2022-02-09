import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule } from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { Injectable } from '@angular/core';
import { OverviewComponent } from './overview/overview.component';
import { SummaryComponent } from './summary/summary.component';
import { DetailComponent } from './detail/detail.component';
import { UtilizationComponent } from './utilization/utilization.component';
import { InspectionComponent } from './inspection/inspection.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityComponent } from './activity/activity.component';
import { ProvinceMilesComponent } from './province-miles/province-miles.component';
import { RevenueListComponent } from './revenue-list/revenue-list.component';
import { RevenueDetailComponent } from './revenue-detail/revenue-detail.component';
import { ProvinceSummaryComponent } from './province-summary/province-summary.component';
const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'utilization', component: UtilizationComponent },
  { path: 'inspection', component: InspectionComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'activity/:vehicleId', component: ActivityComponent },
  { path: 'activity-list', component: ActivityListComponent },
  { path: 'province-miles', component: ProvinceMilesComponent },
  { path: 'revenue-list', component: RevenueListComponent },
  { path: 'revenue-detail/:vehicleId', component: RevenueDetailComponent },
  { path: 'province-summary', component: ProvinceSummaryComponent },
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
      day: + parseInt(parts[2])
    }
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
      const date = value.split(this.DELIMITER);
      return {
        year: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[0], 10),

      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
  }
}

@NgModule({
  declarations: [
    OverviewComponent,
    SummaryComponent,
    DetailComponent,
    UtilizationComponent,
    InspectionComponent,
    MaintenanceComponent,
    ActivityListComponent,
    ActivityComponent,
    ProvinceMilesComponent,
    RevenueListComponent,
    RevenueDetailComponent,
    ProvinceSummaryComponent],

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule,
    InfiniteScrollModule
  ],
  providers: [unsavedChangesGuard,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },]
})
export class ManageVehicleModule { }

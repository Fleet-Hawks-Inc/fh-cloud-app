import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import {ChartsModule} from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { MapViewComponent } from './map-view/map-view.component';
import { FullCalendarModule } from '@fullcalendar/angular';

const routes: Routes = [
  { path: 'calendar-view', component: CalendarViewComponent},
  { path: 'map-view', component: MapViewComponent},
];
@NgModule({
  declarations: [
    CalendarViewComponent,
    MapViewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule,
    FullCalendarModule
  ],
  providers: [unsavedChangesGuard]
})
export class PlannerModule {}

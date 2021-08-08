import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SafetyRoutingModule } from './safety-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import {Injectable} from '@angular/core';
import { ɵs } from '@ng-select/ng-select';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ChartsModule} from 'ng2-charts'; 
import { FullCalendarModule } from '@fullcalendar/angular';

import { SafetyOverviewComponent } from './home/safety-overview/safety-overview.component';
import { EventListComponent } from './critical-events/event-list/event-list.component';
import { AddEventComponent } from './critical-events/add-event/add-event.component';
import { EventDetailComponent } from './critical-events/event-detail/event-detail.component';
import { IncidentListComponent } from './incidents/incident-list/incident-list.component';
import { AddIncidentComponent } from './incidents/add-incident/add-incident.component';
import { IncidentDetailComponent } from './incidents/incident-detail/incident-detail.component';
import { HosListComponent } from './hos-violation/hos-list/hos-list.component';
import { HosDetailComponent } from './hos-violation/hos-detail/hos-detail.component';
import { ScorecardListComponent } from './driver-scorecard/scorecard-list/scorecard-list.component';
import { ScorecardDetailComponent } from './driver-scorecard/scorecard-detail/scorecard-detail.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
     return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
   }
 }


@NgModule({
  declarations: [
    SafetyOverviewComponent, 
    EventListComponent, 
    AddEventComponent, 
    EventDetailComponent, IncidentListComponent, AddIncidentComponent, IncidentDetailComponent, HosListComponent, HosDetailComponent, ScorecardListComponent, ScorecardDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SafetyRoutingModule, 
    NgSelectModule,
    SlickCarouselModule,
    NgbModule,
    NgxMaterialTimepickerModule,
    FullCalendarModule,
    ChartsModule,
    InfiniteScrollModule
  ],
  providers: [NgSelectConfig, ɵs,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
  ],
})
export class SafetyModule { }

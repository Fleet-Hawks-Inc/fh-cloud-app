import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SharedModule} from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {Injectable} from '@angular/core';

import { EventListComponent } from './event-list/event-list.component';
import { AddEventComponent } from './add-event/add-event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  { path: '', component: EventListComponent},
  { path: 'add-event', component: AddEventComponent},
  { path: 'event-details/:eventID', component: EventDetailComponent},
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
    EventListComponent,
    AddEventComponent,
    EventDetailComponent
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
    InfiniteScrollModule,
    SlickCarouselModule
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},]
})
export class CriticalEventsModule {}

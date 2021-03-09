
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchRoutingModule } from './dispatch-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FullCalendarModule } from '@fullcalendar/angular';
import {ChartsModule} from 'ng2-charts';

import { CompanyDocumentsComponent } from './new-documents/company-documents/company-documents.component';

import { NewAceManifestComponent } from './cross-border/ace-documents/new-ace-manifest/new-ace-manifest.component';
import { NewAciManifestComponent } from './cross-border/aci-documents/new-aci-manifest/new-aci-manifest.component';
import { RouteListComponent } from './permanent-routing/route-list/route-list.component';
import { AddRouteComponent } from './permanent-routing/add-route/add-route.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import {Injectable} from '@angular/core';
import { NewDocumentsComponent } from './new-documents/new-documents.component';
import { MyDocumentListComponent } from './new-documents/my-documents/my-document-list.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { AddOrdersComponent } from './orders/add-orders/add-orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { AddQuotesComponent } from './quotes/add-quotes/add-quotes.component';
import { QuotesListComponent } from './quotes/quotes-list/quotes-list.component';
import { QuoteDetailComponent } from './quotes/quote-detail/quote-detail.component';

import { EManifestsComponent } from './cross-border/e-manifests/e-manifests.component';
import { HttpClientModule } from '@angular/common/http';
import { AceDetailsComponent } from './cross-border/ace-documents/ace-details/ace-details.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AciDetailsComponent } from './cross-border/aci-documents/aci-details/aci-details.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { RouteDetailComponent } from './permanent-routing/route-detail/route-detail.component';
import { TripListComponent } from './trips/trip-list/trip-list.component';
import { AddTripComponent } from './trips/add-trip/add-trip.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { CalendarViewComponent } from './planner/calendar-view/calendar-view.component';
import { MapViewComponent } from './planner/map-view/map-view.component';
import { DispatchOverviewComponent } from './home/dispatch-overview/dispatch-overview.component';


import {PdfAutomationComponent} from './pdf-automation/pdf-automation.component'


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
      const date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[2], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[0], 10),

      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.year + this.DELIMITER + date.month  + this.DELIMITER +  date.day : '';
  }
}

@NgModule({
  imports: [
    CommonModule,
    DispatchRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    HttpClientModule,


    MatExpansionModule,

    DragDropModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,

    FullCalendarModule,
    ChartsModule,

  ],

  declarations: [
    EManifestsComponent,
    NewAciManifestComponent,
    CompanyDocumentsComponent,

    NewAceManifestComponent,
    RouteListComponent,
    AddRouteComponent,
    NewDocumentsComponent,
    MyDocumentListComponent,
    OrdersListComponent,
    AddOrdersComponent,
    OrderDetailComponent,

    AceDetailsComponent,
    AciDetailsComponent,

    AddQuotesComponent,
    QuotesListComponent,
    QuoteDetailComponent,


    RouteDetailComponent,
    TripListComponent,
    AddTripComponent,
    TripDetailComponent,
    CalendarViewComponent,
    MapViewComponent,
    DispatchOverviewComponent,
    PdfAutomationComponent

  ],

  providers: [
    NgSelectConfig,
    ɵs,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class DispatchModule {}

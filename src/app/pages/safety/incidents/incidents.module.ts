import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule
} from "@ng-bootstrap/ng-bootstrap";

import { AddIncidentComponent } from "./add-incident/add-incident.component";
import { IncidentDetailComponent } from "./incident-detail/incident-detail.component";
import { IncidentListComponent } from "./incident-list/incident-list.component";

import { Injectable } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SharedModule } from "../../../shared/shared.module";

import { SlickCarouselModule } from "ngx-slick-carousel";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';


const routes: Routes = [
  {
    path: "",
    component: IncidentListComponent,
    data: { title: "Incidents List" },
  },
  {
    path: "add-incident",
    component: AddIncidentComponent,
    data: { title: "Add Incident" },
  },
  {
    path: "incident-details/:incidentID",
    component: IncidentDetailComponent,
    data: { title: "Incident Detail" },
  },
];

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string): NgbDateStruct {
    if (!value) return null;
    let parts = value.split(this.DELIMITER);
    return {
      year: +parseInt(parts[0]),
      month: +parseInt(parts[1]),
      day: +parseInt(parts[2]),
    };
  }

  toModel(date: NgbDateStruct): string { // from internal model -> your mode
    return date
      ? date.year +
      this.DELIMITER +
      ("0" + date.month).slice(-2) +
      this.DELIMITER +
      ("0" + date.day).slice(-2)
      : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = "/";

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
    return date
      ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day
      : "";
  }
}

@NgModule({
  declarations: [
    IncidentListComponent,
    AddIncidentComponent,
    IncidentDetailComponent,
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
    SlickCarouselModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    MenuModule,
    MultiSelectModule,
    SplitButtonModule,
    TableModule,
    DialogModule

  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class IncidentsModule { }

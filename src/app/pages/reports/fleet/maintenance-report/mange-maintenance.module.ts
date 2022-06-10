import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";

import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../../../shared/shared.module";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { unsavedChangesGuard } from "src/app/guards/unsaved-changes.guard";
import { Injectable } from "@angular/core";
import { OverviewComponent } from "./overview/overview.component";
import { ServicelogsComponent } from "./servicelogs/servicelogs.component";
import { ServiceprogramComponent } from "./serviceprogram/serviceprogram.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { GoogleMapsModule } from "@angular/google-maps";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from "primeng/badge";

const routes: Routes = [
  {
    path: "overview",
    component: OverviewComponent,
    data: { title: "Maintenance Report" },
  },
  {
    path: "servicelogs",
    component: ServicelogsComponent,
    data: { title: "Service Logs Report" },
  },
  {
    path: "serviceprogram",
    component: ServiceprogramComponent,
    data: { title: "Service Program Report" },
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
    OverviewComponent,
    ServicelogsComponent,
    ServiceprogramComponent,
  ],
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
    InfiniteScrollModule,
    GoogleMapsModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    SlickCarouselModule,
    SharedModule,
    ToastModule,
    BadgeModule,
    NgxDatatableModule,
  ],
  providers: [
    unsavedChangesGuard,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ManageMaitenanceModule {}

import { NgModule } from "@angular/core";
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
import { Injectable } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { unsavedChangesGuard } from "src/app/guards/unsaved-changes.guard";
import { AddFuelEntryComponent } from "./add-fuel-entry/add-fuel-entry.component";
import { FuelEntryListComponent } from "./fuel-entry-list/fuel-entry-list.component";
import { FuelEntryDetailsComponent } from "./fuel-entry-details/fuel-entry-details.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from "primeng/overlaypanel";
import { MultiSelectModule } from 'primeng/multiselect';
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

  toModel(date: NgbDateStruct): string {
    // from internal model -> your mode
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
const routes: Routes = [
  {
    path: "add",
    component: AddFuelEntryComponent,
    data: { title: "Add Fuel" },
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: "list/:sessionID",
    component: FuelEntryListComponent,
    data: { title: "Fuel List", reuseRoute: true },
  },
  {
    path: "edit/:fuelID",
    component: AddFuelEntryComponent,
    data: { title: "Edit Fuel" },
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: "detail/:fuelID",
    component: FuelEntryDetailsComponent,
    data: { title: "Fuel Detail" },
  },
];
@NgModule({
  declarations: [
    AddFuelEntryComponent,
    FuelEntryListComponent,
    FuelEntryDetailsComponent,
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
    NgxDatatableModule,
    TableModule,
    MenuModule,
    ButtonModule,
    MultiSelectModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    OverlayPanelModule,
  ],
  providers: [
    unsavedChangesGuard,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class FuelModule {}

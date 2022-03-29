import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterModule, Routes } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct, NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ChartsModule } from "ng2-charts";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxSpinnerModule } from "ngx-spinner";
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { unsavedChangesGuard } from "src/app/guards/unsaved-changes.guard";
import { SharedModule } from "../../../shared/shared.module";
import { AddTripComponent } from "./add-trip/add-trip.component";
import { TripDetailComponent } from "./trip-detail/trip-detail.component";
import { TripListComponent } from "./trip-list/trip-list.component";
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
    let month: any = "";
    let day: any = "";
    if (date) {
      month = date.month < 10 ? "0" + date.month : date.month;
      day = date.day < 10 ? "0" + date.day : date.day;
    }
    return date
      ? date.year + this.DELIMITER + month + this.DELIMITER + day
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
    let month: any = "";
    let day: any = "";
    if (date) {
      month = date.month < 10 ? "0" + date.month : date.month;
      day = date.day < 10 ? "0" + date.day : date.day;
    }

    return date
      ? date.year + this.DELIMITER + month + this.DELIMITER + day
      : "";
  }
}

const routes: Routes = [
  {
    path: "trip-list/:sessionID",
    component: TripListComponent,
    data: {
      reuseRoute: true,
      title: "Trip List",
    },
  },
  {
    path: "add-trip",
    component: AddTripComponent,
    data: { title: "Add Trip" },
  },
  {
    path: "trip-details/:tripID",
    component: TripDetailComponent,
    data: { title: "Detail Trip" },
  },
  {
    path: "edit-trip/:tripID",
    component: AddTripComponent,
    data: { title: "Edit Trip" },
  },
];
@NgModule({
  declarations: [TripListComponent, AddTripComponent, TripDetailComponent],
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
    DragDropModule,
    MatExpansionModule,
    NgxDatatableModule,
    InfiniteScrollModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    ToastModule,
    TooltipModule
  ],
  providers: [
    unsavedChangesGuard,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class TripModule { }

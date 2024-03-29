import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../../../shared/shared.module";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";
import { AddVehicleComponent } from "./add-vehicle/add-vehicle.component";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { VehicleDetailComponent } from "./vehicle-detail/vehicle-detail.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { NgSelectModule } from "@ng-select/ng-select";
import { TooltipModule } from 'primeng/tooltip';
import {ToastModule} from 'primeng/toast';
/*
const routes: Routes = [
  {
    path: "add",
    component: AddVehicleComponent,
    data: { title: "Add Vehicle" },
  },
  {
    path: "edit/:vehicleID",
    component: AddVehicleComponent,
    data: { title: "Edit Vehicle" },
  },
  {
    path: "list",
    component: VehicleListComponent,
    data:
    {
    title: "Vehicle List",
    },
  },
  {
    path: "detail/:vehicleID",
    component: VehicleDetailComponent,
    data: { title: "Vehicle Detail" },
  },
];
*/
const routes: Routes = [
  { path: 'add', component: AddVehicleComponent, canDeactivate: [unsavedChangesGuard], data: { title: 'Add Vehicle' } },
  { path: 'edit/:vehicleID', component: AddVehicleComponent, canDeactivate: [unsavedChangesGuard], data: { title: 'Edit Vehicle' } },
  { path: 'list/:sessionID', component: VehicleListComponent, data: { title: 'Vehicles List', reuseRoute: true } },
  { path: 'detail/:vehicleID', component: VehicleDetailComponent, data: { title: 'Vehicle Detail' } }
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
@NgModule({
  declarations: [
    AddVehicleComponent,
    VehicleListComponent,
    VehicleDetailComponent,
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
    SlickCarouselModule,
    InfiniteScrollModule,
    TooltipModule,
    TableModule,
    MultiSelectModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
  ],
  exports: [],
  providers: [unsavedChangesGuard,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class VehiclesModule { }

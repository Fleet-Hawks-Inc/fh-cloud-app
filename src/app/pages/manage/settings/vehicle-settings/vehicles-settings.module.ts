import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { DeletedVehiclesComponent } from "./deleted-vehicles/deleted-vehicles.component";
import { ImportedVehiclesComponent } from "./imported-vehicles/imported-vehicles.component";
import { VehicleSettingsComponent } from "./vehicle-settings.component";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChartsModule } from "ng2-charts";
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from "../../../../shared/shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
  {
    path: "deleted-vehicles",
    component: DeletedVehiclesComponent,
    data: { title: "Deleted vehicles" },
  },
  {
    path: "imported-vehicles",
    component: ImportedVehiclesComponent,
    data: { title: "Imported vehicles" },
  },
  {
    path: "overview",
    component: VehicleSettingsComponent,
    data: { title: "Vehicles Settings" },
  },
];

@NgModule({
  declarations: [DeletedVehiclesComponent, ImportedVehiclesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgbModule,
    InfiniteScrollModule,
    NgSelectModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    MenuModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DialogModule,
    DropdownModule,
    OverlayPanelModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule
  ],
})
export class VehiclesSettingsModule { }

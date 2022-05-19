import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { DeletedAssetsComponent } from "./deleted-assets/deleted-assets.component";
import { ImportedAssetsComponent } from "./imported-assets/imported-assets.component";
import { AssetsSettingComponent } from "./assets-setting.component";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { MenuModule } from "primeng/menu";
import { SplitButtonModule } from "primeng/splitbutton";
import { CalendarModule } from "primeng/calendar";
import { AutoCompleteModule } from "primeng/autocomplete";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from 'primeng/dialog';
const routes: Routes = [
  {
    path: "deleted-assets",
    component: DeletedAssetsComponent,
    data: { title: "Deleted Assets" },
  },
  {
    path: "imported-assets",
    component: ImportedAssetsComponent,
    data: { title: "Imported Assets" },
  },
  {
    path: "overview",
    component: AssetsSettingComponent,
    data: { title: "Assets Settings" },
  },
];

@NgModule({
  declarations: [DeletedAssetsComponent, ImportedAssetsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
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
    DropdownModule,
    DialogModule
  ],
})
export class AssetsSettingsModules { }

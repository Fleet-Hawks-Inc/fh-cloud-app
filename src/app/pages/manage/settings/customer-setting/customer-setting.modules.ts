import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

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
import { DeletedCustomerComponent } from "./deleted-customer/deleted-customer.component";
import { CustomerSettingComponent } from "./customer-setting.component";
import { ImportedCustomerComponent } from "./imported-customer/imported-customer.component";
const routes: Routes = [
  {
    path: "deleted-customers",
    component: DeletedCustomerComponent,
    data: { title: "Deleted Customer" },
  },
  {
    path: "imported-customers",
    component: ImportedCustomerComponent,
    data: { title: "Imported Customer" },
  },
  {
    path: "overview",
    component: CustomerSettingComponent,
    data: { title: "Customer Settings" },
  },
];

@NgModule({
  declarations: [DeletedCustomerComponent, CustomerSettingComponent, ImportedCustomerComponent],
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
export class CustomerSettingsModules { }

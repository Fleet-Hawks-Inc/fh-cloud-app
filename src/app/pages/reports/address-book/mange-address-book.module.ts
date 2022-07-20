import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { HttpClientModule } from "@angular/common/http";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AddressBookComponent } from "./address-book/address-book.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { GoogleMapsModule } from "@angular/google-maps";
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: "",
    component: AddressBookComponent,
    data: { title: "Customer Information Report" },
  },
];

@NgModule({
  declarations: [AddressBookComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgSelectModule,
    TableModule,
    ChartsModule,
    SharedModule,
    ButtonModule,
    MultiSelectModule,
    TooltipModule,
    MenuModule,
    NgxDatatableModule,
    GoogleMapsModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    NgxSpinnerModule
  ],
  providers: [],
})
export class ManageAddressBookModule {}

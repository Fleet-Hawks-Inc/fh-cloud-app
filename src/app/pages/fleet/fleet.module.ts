import { NgModule } from '@angular/core';

import { FleetRoutingModule } from './fleet-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';




import {ChartsModule} from 'ng2-charts';
// ngselect2
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';

// DataTable
import { DataTablesModule } from 'angular-datatables';


import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  imports: [
    FleetRoutingModule,
            FormsModule,
            CommonModule,
            SharedModule,
    ChartsModule,
    NgSelectModule,
    DataTablesModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    SlickCarouselModule,
    NgxSpinnerModule,
    NgSelect2Module
  ],
  declarations: [
    AddDriverComponent,
    EditDriverComponent,
    DriverListComponent,

    AddVehicleComponent,
    EditVehicleComponent,

    AddVehicleNewComponent,
    EditVehicleNewComponent,
    VehicleListComponent,

    UserListComponent,
    AddUserComponent,
    EditUserComponent,

    YardsComponent,
    AddYardComponent,
    EditYardComponent,

    AddAssetsComponent,
    EditAssetComponent,
    AssetListComponent,

    AddFuelEntryComponent,
    EditFuelEntryComponent,
    FuelEntryListComponent,

    AddTicketComponent,
    EditTicketComponent,
    TicketsComponent,

    AddExpenseTypeComponent,
    EditExpenseTypeComponent,
    ExpenseTypeListComponent,

    AddVendorComponent,
    EditVendorComponent,
    VendorsListComponent,

    AddVehicleServiceLogComponent,
    EditVehicleServiceLogComponent,
    VehicleServiceLogsComponent,

    AddServiceProgramComponent,
    EditServiceProgramComponent,
    ServiceProgramListComponent,

    AddItemComponent,
    EditItemComponent,
    ItemsListComponent,

    AddItemGroupComponent,
    EditItemGroupComponent,
    ItemGroupListComponent,

    AddEntryComponent,
    EditEntryComponent,
    EntriesComponent,

    AddStockAssignmentComponent,
    EditStockAssignmentComponent,
    StockAssignmentListComponent,

    InventoryStockStatementComponent,

    AddGeofenceComponent,
    EditGeofenceComponent,
    GeofenceListComponent,

    GraphComponent,

    DashboardDriverComponent,

    IssueListComponent,

    AddIssueComponent,

    ServiceListComponent,

    AddServiceComponent,

    AssetDetailComponent,
    ListingComponent,
    AddReminderComponent,
    VehicleRenewAddComponent,
    VehicleRenewListComponent,
    AddContactRenewComponent,
    ListContactRenewComponent,
    ServiceRemindDetailComponent,
    ContactRenewDetailComponent,
    VehicleRenewDetailComponent,
    ItemDetailComponent,
    IssueDetailComponent,
    ServiceDetailComponent,
    ServiceProgramDetailComponent,
    DriverDetailComponent,
  ],
  providers: [NgSelectConfig, ɵs],
})
export class FleetModule {}

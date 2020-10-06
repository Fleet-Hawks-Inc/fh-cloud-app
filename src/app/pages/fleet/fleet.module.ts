import { NgModule } from '@angular/core';
import { FleetRoutingModule } from './fleet-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
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

import {
  AddVehicleNewComponent,
  EditVehicleNewComponent,
  VehicleListComponent,
  AddUserComponent,
  EditUserComponent,
  UserListComponent,
  AddYardComponent,
  EditYardComponent,
  YardsComponent,
  AddAssetsComponent,
  AssetListComponent,
  AssetDetailComponent,
  AddFuelEntryComponent,
  FuelEntryListComponent,
  EditFuelEntryComponent,
  AddTicketComponent,
  TicketsComponent,
  EditTicketComponent,
  AddExpenseTypeComponent,
  ExpenseTypeListComponent,
  EditExpenseTypeComponent,
  ListingComponent,
  AddReminderComponent,
  ServiceRemindDetailComponent,
  VehicleRenewListComponent,
  VehicleRenewAddComponent,
  VehicleRenewDetailComponent,
  ListContactRenewComponent,
  AddContactRenewComponent,
  ContactRenewDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  EditServiceProgramComponent,
  ServiceProgramDetailComponent,
  AddVendorComponent,
  VendorsListComponent,
  EditVendorComponent,
  AddVehicleServiceLogComponent,
  VehicleServiceLogsComponent,
  EditVehicleServiceLogComponent,
  AddItemComponent,
  ItemsListComponent,
  ItemDetailComponent,
  EditItemComponent,
  AddItemGroupComponent,
  ItemGroupListComponent,
  EditItemGroupComponent,
  AddEntryComponent,
  EntriesComponent,
  EditEntryComponent,
  AddStockAssignmentComponent,
  StockAssignmentListComponent,
  EditStockAssignmentComponent,
  InventoryStockStatementComponent,
  AddGeofenceComponent,
  EditGeofenceComponent,
  GeofenceListComponent,
  GraphComponent,
  DashboardDriverComponent
} from './index';

const COMPONENTS = [
  AddVehicleNewComponent,
  EditVehicleNewComponent,
  VehicleListComponent,
  AddUserComponent,
  EditUserComponent,
  UserListComponent,
  AddYardComponent,
  EditYardComponent,
  YardsComponent,
  AddAssetsComponent,
  AssetListComponent,
  AssetDetailComponent,
  AddFuelEntryComponent,
  FuelEntryListComponent,
  EditFuelEntryComponent,
  AddTicketComponent,
  TicketsComponent,
  EditTicketComponent,
  AddExpenseTypeComponent,
  ExpenseTypeListComponent,
  EditExpenseTypeComponent,
  ListingComponent,
  AddReminderComponent,
  ServiceRemindDetailComponent,
  VehicleRenewListComponent,
  VehicleRenewAddComponent,
  VehicleRenewDetailComponent,
  ListContactRenewComponent,
  AddContactRenewComponent,
  ContactRenewDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  EditServiceProgramComponent,
  ServiceProgramDetailComponent,
  AddVendorComponent,
  VendorsListComponent,
  EditVendorComponent,
  AddVehicleServiceLogComponent,
  VehicleServiceLogsComponent,
  EditVehicleServiceLogComponent,
  AddItemComponent,
  ItemsListComponent,
  ItemDetailComponent,
  EditItemComponent,
  AddItemGroupComponent,
  ItemGroupListComponent,
  EditItemGroupComponent,
  AddEntryComponent,
  EntriesComponent,
  EditEntryComponent,
  AddStockAssignmentComponent,
  StockAssignmentListComponent,
  EditStockAssignmentComponent,
  InventoryStockStatementComponent,
  AddGeofenceComponent,
  EditGeofenceComponent,
  GeofenceListComponent,
  GraphComponent,
  DashboardDriverComponent
];



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
  exports: [...COMPONENTS],
  declarations: [
    ...COMPONENTS
  ],
  providers: [NgSelectConfig, ɵs],
})
export class FleetModule {}

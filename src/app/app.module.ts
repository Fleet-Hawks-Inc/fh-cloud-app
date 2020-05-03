import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { RFormsComponent } from './r-forms/r-forms.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { AddQuantumComponent } from './add-quantum/add-quantum.component';
import { AddUserComponent } from './add-user/add-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { LogoutComponent } from './logout/logout.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { QuantumsComponent } from './quantums/quantums.component';
import { EditQuantumComponent } from './edit-quantum/edit-quantum.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { AddAssetsComponent } from './add-assets/add-assets.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { EditAssetComponent } from './edit-asset/edit-asset.component';
import { AddFuelEntryComponent } from './add-fuel-entry/add-fuel-entry.component';
import { EditFuelEntryComponent } from './edit-fuel-entry/edit-fuel-entry.component';
import { FuelEntryListComponent } from './fuel-entry-list/fuel-entry-list.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';
import { AddExpenseTypeComponent } from './add-expense-type/add-expense-type.component';
import { EditExpenseTypeComponent } from './edit-expense-type/edit-expense-type.component';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { DocumentsComponent } from './documents/documents.component';
import { AddDocumentsComponent } from './add-documents/add-documents.component';
import { EditDocumentsComponent } from './edit-documents/edit-documents.component';
import { AddTripsComponent } from './add-trips/add-trips.component';
import { TripsListComponent } from './trips-list/trips-list.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { AddShipperComponent } from './add-shipper/add-shipper.component';
import { EditShipperComponent } from './edit-shipper/edit-shipper.component';
import { ShipperListComponent } from './shipper-list/shipper-list.component';
import { AddServiceVendorComponent } from './add-service-vendor/add-service-vendor.component';
import { EditServiceVendorComponent } from './edit-service-vendor/edit-service-vendor.component';
import { ServiceVendorListComponent } from './service-vendor-list/service-vendor-list.component';
import { AddDailyInspectionComponent } from './add-daily-inspection/add-daily-inspection.component';
import { EditDailyInspectionComponent } from './edit-daily-inspection/edit-daily-inspection.component';
import { DailyInspectionListComponent } from './daily-inspection-list/daily-inspection-list.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { AddYardComponent } from './add-yard/add-yard.component';
import { EditYardComponent } from './edit-yard/edit-yard.component';
import { YardsComponent } from './yards/yards.component';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { EditInsuranceComponent } from './edit-insurance/edit-insurance.component';
import { InsurancesComponent } from './insurances/insurances.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { EntriesComponent } from './entries/entries.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddReceiverComponent } from './add-receiver/add-receiver.component';
import { EditReceiverComponent } from './edit-receiver/edit-receiver.component';
import { ReceiversComponent } from './receivers/receivers.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AddInspectionFormComponent } from './add-inspection-form/add-inspection-form.component';
import { EditInspectionFormComponent } from './edit-inspection-form/edit-inspection-form.component';
import { InspectionFormsComponent } from './inspection-forms/inspection-forms.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AddVehicleServiceLogComponent } from './add-vehicle-service-log/add-vehicle-service-log.component';
import { EditVehicleServiceLogComponent } from './edit-vehicle-service-log/edit-vehicle-service-log.component';
import { VehicleServiceLogsComponent } from './vehicle-service-logs/vehicle-service-logs.component';
import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { EditCertificateComponent } from './edit-certificate/edit-certificate.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { AddCarrierComponent } from './add-carrier/add-carrier.component';
import { EditCarrierComponent } from './edit-carrier/edit-carrier.component';
import { CarriersComponent } from './carriers/carriers.component';
import { AddVehicleNewComponent } from './add-vehicle-new/add-vehicle-new.component';
import { EditVehicleNewComponent } from './edit-vehicle-new/edit-vehicle-new.component';

import { MapDashboardComponent } from './map-dashboard/map-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EditDriverComponent } from './edit-driver/edit-driver.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { AddServiceProgramComponent } from './add-service-program/add-service-program.component';
import { EditServiceProgramComponent } from './edit-service-program/edit-service-program.component';
import { ServiceProgramListComponent } from './service-program-list/service-program-list.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { CognitoUtilityService } from './services/cognito.utility.service';
import { AddItemGroupComponent } from './add-item-group/add-item-group.component';
import { EditItemGroupComponent } from './edit-item-group/edit-item-group.component';
import { ItemGroupListComponent } from './item-group-list/item-group-list.component';
import { AddStockAssignmentComponent } from './add-stock-assignment/add-stock-assignment.component';
import { EditStockAssignmentComponent } from './edit-stock-assignment/edit-stock-assignment.component';
import { StockAssignmentListComponent } from './stock-assignment-list/stock-assignment-list.component';
import { AddTicketTypeComponent } from './add-ticket-type/add-ticket-type.component';
import { EditTicketTypeComponent } from './edit-ticket-type/edit-ticket-type.component';
import { TicketTypeListComponent } from './ticket-type-list/ticket-type-list.component';
import { CountriesComponent } from './countries/countries.component';
import { AddCountryComponent } from './add-country/add-country.component';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { StatesComponent } from './states/states.component';
import { AddStateComponent } from './add-state/add-state.component';
import { EditStateComponent } from './edit-state/edit-state.component';
import { CitiesComponent } from './cities/cities.component';
import { AddCityComponent } from './add-city/add-city.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from './edit-manufacturer/edit-manufacturer.component';
import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';
import { AddModelComponent } from './add-model/add-model.component';
import { EditModelComponent } from './edit-model/edit-model.component';
import { ModelListComponent } from './model-list/model-list.component';
import { AddAlertComponent } from './add-alert/add-alert.component';
import { EditAlertComponent } from './edit-alert/edit-alert.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { AddGeofenceComponent } from './add-geofence/add-geofence.component';
import { GeofenceListComponent } from './geofence-list/geofence-list.component';
import { EditGeofenceComponent } from './edit-geofence/edit-geofence.component';
import { MultiSidebarComponents } from './sidebars/multi-sidebar.component';
import {RouterModule} from '@angular/router';
import { AddCycleComponent } from './add-cycle/add-cycle.component';
import { EditCycleComponent } from './edit-cycle/edit-cycle.component';
import { CycleListComponent } from './cycle-list/cycle-list.component';
import { InventoryStockStatementComponent } from './Reports/inventory-stock-statement/inventory-stock-statement.component';
import { NavOpenedDirective } from './directives/nav-opened.directive';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AddDriverComponent,
    SidebarComponent,
    HeaderComponent,
    AddVehicleComponent,
    LeftBarComponent,
    RFormsComponent,
    CompanyInfoComponent,
    AddQuantumComponent,
    AddUserComponent,
    VehicleListComponent,
    LogoutComponent,
    EditVehicleComponent,
    HealthcheckComponent,
    QuantumsComponent,
    EditQuantumComponent,
    UserListComponent,
    EditUserComponent,
    AddGroupComponent,
    GroupListComponent,
    EditGroupComponent,
    AddAssetsComponent,
    AssetListComponent,
    EditAssetComponent,
    AddFuelEntryComponent,
    EditFuelEntryComponent,
    FuelEntryListComponent,
    AddExpensesComponent,
    ExpensesListComponent,
    EditExpensesComponent,
    AddExpenseTypeComponent,
    EditExpenseTypeComponent,
    ExpenseTypeListComponent,
    DocumentsComponent,
    AddDocumentsComponent,
    EditDocumentsComponent,
    AddTripsComponent,
    TripsListComponent,
    EditTripComponent,
    AddShipperComponent,
    EditShipperComponent,
    ShipperListComponent,
    AddServiceVendorComponent,
    EditServiceVendorComponent,
    ServiceVendorListComponent,
    AddDailyInspectionComponent,
    EditDailyInspectionComponent,
    DailyInspectionListComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomersComponent,
    AddYardComponent,
    EditYardComponent,
    YardsComponent,
    AddInsuranceComponent,
    EditInsuranceComponent,
    InsurancesComponent,
    AddEntryComponent,
    EditEntryComponent,
    EntriesComponent,
    AddContactComponent,
    EditContactComponent,
    ContactsComponent,
    AddReceiverComponent,
    EditReceiverComponent,
    ReceiversComponent,
    AddAddressComponent,
    EditAddressComponent,
    AddressesComponent,
    AddInspectionFormComponent,
    EditInspectionFormComponent,
    InspectionFormsComponent,
    AddAccountComponent,
    EditAccountComponent,
    AccountsComponent,
    AddTicketComponent,
    EditTicketComponent,
    TicketsComponent,
    AddVehicleServiceLogComponent,
    EditVehicleServiceLogComponent,
    VehicleServiceLogsComponent,
    AddCertificateComponent,
    EditCertificateComponent,
    CertificatesComponent,
    AddCarrierComponent,
    EditCarrierComponent,
    CarriersComponent,
    AddVehicleNewComponent,
    EditVehicleNewComponent,

    MapDashboardComponent,

    EditDriverComponent,
    DriverListComponent,
    AddItemComponent,
    ItemsListComponent,
    EditItemComponent,
    AddServiceProgramComponent,
    EditServiceProgramComponent,
    ServiceProgramListComponent,
    AddVendorComponent,
    EditVendorComponent,
    VendorsListComponent,
    RegisterUserComponent,
    AddItemGroupComponent,
    EditItemGroupComponent,
    ItemGroupListComponent,
    AddStockAssignmentComponent,
    EditStockAssignmentComponent,
    StockAssignmentListComponent,
    AddTicketTypeComponent,
    EditTicketTypeComponent,
    TicketTypeListComponent,
    CountriesComponent,
    AddCountryComponent,
    EditCountryComponent,
    StatesComponent,
    AddStateComponent,
    EditStateComponent,
    CitiesComponent,
    AddCityComponent,
    EditCityComponent,
    AddManufacturerComponent,
    EditManufacturerComponent,
    ManufacturerListComponent,
    AddModelComponent,
    EditModelComponent,
    ModelListComponent,
    AddAlertComponent,
    EditAlertComponent,
    AlertListComponent,
    AddGeofenceComponent,
    GeofenceListComponent,
    EditGeofenceComponent,
    MultiSidebarComponents,
    AddCycleComponent,
    EditCycleComponent,
    CycleListComponent,
    InventoryStockStatementComponent,
    NavOpenedDirective


  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [
    CognitoUtilityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}

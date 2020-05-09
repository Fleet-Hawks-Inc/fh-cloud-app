import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { AccountsComponent } from './accounts/accounts.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { AddAlertComponent } from './add-alert/add-alert.component';
import { AddAssetsComponent } from './add-assets/add-assets.component';
import { AddCarrierComponent } from './add-carrier/add-carrier.component';
import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { AddCityComponent } from './add-city/add-city.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { AddCountryComponent } from './add-country/add-country.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddCycleComponent } from './add-cycle/add-cycle.component';
import { AddDailyInspectionComponent } from './add-daily-inspection/add-daily-inspection.component';
import { AddDocumentsComponent } from './add-documents/add-documents.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { AddExpenseTypeComponent } from './add-expense-type/add-expense-type.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { AddFuelEntryComponent } from './add-fuel-entry/add-fuel-entry.component';
import { AddGeofenceComponent } from './add-geofence/add-geofence.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { AddInspectionFormComponent } from './add-inspection-form/add-inspection-form.component';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { AddItemGroupComponent } from './add-item-group/add-item-group.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { AddModelComponent } from './add-model/add-model.component';
import { AddQuantumComponent } from './add-quantum/add-quantum.component';
import { AddReceiverComponent } from './add-receiver/add-receiver.component';
import { AddServiceProgramComponent } from './add-service-program/add-service-program.component';
import { AddServiceVendorComponent } from './add-service-vendor/add-service-vendor.component';
import { AddShipperComponent } from './add-shipper/add-shipper.component';
import { AddStateComponent } from './add-state/add-state.component';
import { AddStockAssignmentComponent } from './add-stock-assignment/add-stock-assignment.component';
import { AddTicketTypeComponent } from './add-ticket-type/add-ticket-type.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { AddTripsComponent } from './add-trips/add-trips.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddVehicleNewComponent } from './add-vehicle-new/add-vehicle-new.component';
import { AddVehicleServiceLogComponent } from './add-vehicle-service-log/add-vehicle-service-log.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { AddYardComponent } from './add-yard/add-yard.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { CarriersComponent } from './carriers/carriers.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { CitiesComponent } from './cities/cities.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { ContactsComponent } from './contacts/contacts.component';
import { CountriesComponent } from './countries/countries.component';
import { CustomersComponent } from './customers/customers.component';
import { CycleListComponent } from './cycle-list/cycle-list.component';
import { DailyInspectionListComponent } from './daily-inspection-list/daily-inspection-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavOpenedDirective } from './directives/nav-opened.directive';
import { DocumentsComponent } from './documents/documents.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { EditAlertComponent } from './edit-alert/edit-alert.component';
import { EditAssetComponent } from './edit-asset/edit-asset.component';
import { EditCarrierComponent } from './edit-carrier/edit-carrier.component';
import { EditCertificateComponent } from './edit-certificate/edit-certificate.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { EditCycleComponent } from './edit-cycle/edit-cycle.component';
import { EditDailyInspectionComponent } from './edit-daily-inspection/edit-daily-inspection.component';
import { EditDocumentsComponent } from './edit-documents/edit-documents.component';
import { EditDriverComponent } from './edit-driver/edit-driver.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { EditExpenseTypeComponent } from './edit-expense-type/edit-expense-type.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';
import { EditFuelEntryComponent } from './edit-fuel-entry/edit-fuel-entry.component';
import { EditGeofenceComponent } from './edit-geofence/edit-geofence.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { EditInspectionFormComponent } from './edit-inspection-form/edit-inspection-form.component';
import { EditInsuranceComponent } from './edit-insurance/edit-insurance.component';
import { EditItemGroupComponent } from './edit-item-group/edit-item-group.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { EditManufacturerComponent } from './edit-manufacturer/edit-manufacturer.component';
import { EditModelComponent } from './edit-model/edit-model.component';
import { EditQuantumComponent } from './edit-quantum/edit-quantum.component';
import { EditReceiverComponent } from './edit-receiver/edit-receiver.component';
import { EditServiceProgramComponent } from './edit-service-program/edit-service-program.component';
import { EditServiceVendorComponent } from './edit-service-vendor/edit-service-vendor.component';
import { EditShipperComponent } from './edit-shipper/edit-shipper.component';
import { EditStateComponent } from './edit-state/edit-state.component';
import { EditStockAssignmentComponent } from './edit-stock-assignment/edit-stock-assignment.component';
import { EditTicketTypeComponent } from './edit-ticket-type/edit-ticket-type.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditVehicleNewComponent } from './edit-vehicle-new/edit-vehicle-new.component';
import { EditVehicleServiceLogComponent } from './edit-vehicle-service-log/edit-vehicle-service-log.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { EditYardComponent } from './edit-yard/edit-yard.component';
import { EntriesComponent } from './entries/entries.component';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { FuelEntryListComponent } from './fuel-entry-list/fuel-entry-list.component';
import { GeofenceListComponent } from './geofence-list/geofence-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { HeaderComponent } from './header/header.component';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { InspectionFormsComponent } from './inspection-forms/inspection-forms.component';
import { InsurancesComponent } from './insurances/insurances.component';
import { ItemGroupListComponent } from './item-group-list/item-group-list.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';
import { MapDashboardComponent } from './map-dashboard/map-dashboard.component';
import { ModelListComponent } from './model-list/model-list.component';
import { QuantumsComponent } from './quantums/quantums.component';
import { RFormsComponent } from './r-forms/r-forms.component';
import { ReceiversComponent } from './receivers/receivers.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { InventoryStockStatementComponent } from './Reports/inventory-stock-statement/inventory-stock-statement.component';
import { ServiceProgramListComponent } from './service-program-list/service-program-list.component';
import { ServiceVendorListComponent } from './service-vendor-list/service-vendor-list.component';
import { ShipperListComponent } from './shipper-list/shipper-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MultiSidebarComponents } from './sidebars/multi-sidebar.component';
import { StatesComponent } from './states/states.component';
import { StockAssignmentListComponent } from './stock-assignment-list/stock-assignment-list.component';
import { TicketTypeListComponent } from './ticket-type-list/ticket-type-list.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TripsListComponent } from './trips-list/trips-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleServiceLogsComponent } from './vehicle-service-logs/vehicle-service-logs.component';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { YardsComponent } from './yards/yards.component';
import { HttpInterceptorProviders } from './helpers/interceptor.provider';


// JWT interceptors







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
    AmplifyAngularModule,
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
    AmplifyService,
    HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}

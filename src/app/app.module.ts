import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// import {AddVehicleComponent} from './add-vehicle/add-vehicle.component';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { RFormsComponent } from './r-forms/r-forms.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { AddQuantumComponent } from './add-quantum/add-quantum.component';
// import { AddUserComponent } from './add-user/add-user.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { LogoutComponent } from './logout/logout.component';
// import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { QuantumsComponent } from './quantums/quantums.component';
import { EditQuantumComponent } from './edit-quantum/edit-quantum.component';
// import { UserListComponent } from './user-list/user-list.component';
// import { EditUserComponent } from './edit-user/edit-user.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';
// import { DocumentsComponent } from './documents/documents.component';
// import { AddDocumentsComponent } from './add-documents/add-documents.component';
// import { EditDocumentsComponent } from './edit-documents/edit-documents.component';
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
// import { AddYardComponent } from './add-yard/add-yard.component';
// import { EditYardComponent } from './edit-yard/edit-yard.component';
// import { YardsComponent } from './yards/yards.component';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { EditInsuranceComponent } from './edit-insurance/edit-insurance.component';
import { InsurancesComponent } from './insurances/insurances.component';
// import { AddContactComponent } from './add-contact/add-contact.component';
// import { EditContactComponent } from './edit-contact/edit-contact.component';
// import { ContactsComponent } from './contacts/contacts.component';
import { AddReceiverComponent } from './add-receiver/add-receiver.component';
import { EditReceiverComponent } from './edit-receiver/edit-receiver.component';
import { ReceiversComponent } from './receivers/receivers.component';
// import { AddAddressComponent } from './add-address/add-address.component';
// import { EditAddressComponent } from './edit-address/edit-address.component';
// import { AddressesComponent } from './addresses/addresses.component';
import { AddInspectionFormComponent } from './add-inspection-form/add-inspection-form.component';
import { EditInspectionFormComponent } from './edit-inspection-form/edit-inspection-form.component';
import { InspectionFormsComponent } from './inspection-forms/inspection-forms.component';
// import { AddAccountComponent } from './add-account/add-account.component';
// import { EditAccountComponent } from './edit-account/edit-account.component';
// import { AccountsComponent } from './accounts/accounts.component';
import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { EditCertificateComponent } from './edit-certificate/edit-certificate.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { AddCarrierComponent } from './add-carrier/add-carrier.component';
import { EditCarrierComponent } from './edit-carrier/edit-carrier.component';
import { CarriersComponent } from './carriers/carriers.component';
// import { AddVehicleNewComponent } from './add-vehicle-new/add-vehicle-new.component';
// import { EditVehicleNewComponent } from './edit-vehicle-new/edit-vehicle-new.component';

import { MapDashboardComponent } from './map-dashboard/map-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import {RouterModule} from '@angular/router';
import { AddCycleComponent } from './add-cycle/add-cycle.component';
import { EditCycleComponent } from './edit-cycle/edit-cycle.component';
import { CycleListComponent } from './cycle-list/cycle-list.component';
import { NavOpenedDirective } from './directives/nav-opened.directive';
import {SharedModule} from './shared/shared.module';
import {ChartsModule} from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
//ngselect2
//import { NgSelectModule } from '@ng-select/ng-select';

// Authentication
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
// JWT interceptors
import { HttpInterceptorProviders } from './helpers/interceptor.provider';
import {JwtInterceptor} from "./helpers/jwt.interceptor";

//mqtt
import {MqttModule, IMqttServiceOptions} from 'ngx-mqtt';
import {environment} from "../environments/environment";

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.HOSTNAME,
  port: environment.PORT,
  path: environment.MQTTPATH
}

import { RegisterComponent } from './register/register.component';
import { CarrierRegistrationComponent } from './carrier-registration/carrier-registration.component';
import { CarrierRegisterComponent } from './carrier-register/carrier-register.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,


    LeftBarComponent,
    RFormsComponent,
    CompanyInfoComponent,
    AddQuantumComponent,


    LogoutComponent,

    HealthcheckComponent,
    QuantumsComponent,
    EditQuantumComponent,


    AddGroupComponent,
    GroupListComponent,
    EditGroupComponent,

    AddExpensesComponent,
    ExpensesListComponent,
    EditExpensesComponent,
    // DocumentsComponent,
    // AddDocumentsComponent,
    // EditDocumentsComponent,
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
    // AddYardComponent,
    // EditYardComponent,
    // YardsComponent,
    AddInsuranceComponent,
    EditInsuranceComponent,
    InsurancesComponent,

    // AddContactComponent,
    // EditContactComponent,
    // ContactsComponent,
    AddReceiverComponent,
    EditReceiverComponent,
    ReceiversComponent,
    // AddAddressComponent,
    // EditAddressComponent,
    // AddressesComponent,
    AddInspectionFormComponent,
    EditInspectionFormComponent,
    InspectionFormsComponent,
    // AddAccountComponent,
    // EditAccountComponent,
    // AccountsComponent,
    AddCertificateComponent,
    EditCertificateComponent,
    CertificatesComponent,
    AddCarrierComponent,
    EditCarrierComponent,
    CarriersComponent,
    // AddVehicleNewComponent,


    MapDashboardComponent,

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

    AddCycleComponent,
    EditCycleComponent,
    CycleListComponent,
    NavOpenedDirective,
    CarrierRegistrationComponent,
    CarrierRegisterComponent
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
    BrowserAnimationsModule,
    ChartsModule,
    SharedModule,
    ToastrModule.forRoot(), // ToastrModule added
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgMultiSelectDropDownModule.forRoot()
    //NgSelectModule


  ],
  providers: [AmplifyService,
      HttpInterceptorProviders
    ],
  bootstrap: [AppComponent]
})
export class AppModule {


}

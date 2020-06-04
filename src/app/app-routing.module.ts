import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './auth.service';

import { LeftBarComponent } from './left-bar/left-bar.component';
import { RFormsComponent } from './r-forms/r-forms.component';
import { AddQuantumComponent } from './add-quantum/add-quantum.component';

// import { AddUserComponent } from './add-user/add-user.component';
// import { UserListComponent } from './user-list/user-list.component';
// import { EditUserComponent } from './edit-user/edit-user.component';
//
// import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
// import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
// import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';

import { HealthcheckComponent } from './healthcheck/healthcheck.component';
import { QuantumsComponent } from './quantums/quantums.component';
import { EditQuantumComponent } from './edit-quantum/edit-quantum.component';

import { AddGroupComponent } from './add-group/add-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { GroupListComponent } from './group-list/group-list.component';
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
import { ShipperListComponent } from './shipper-list/shipper-list.component';
import { EditShipperComponent } from './edit-shipper/edit-shipper.component';
import { AddServiceVendorComponent } from './add-service-vendor/add-service-vendor.component';
import { ServiceVendorListComponent } from './service-vendor-list/service-vendor-list.component';
import { EditServiceVendorComponent } from './edit-service-vendor/edit-service-vendor.component';

import { AddDailyInspectionComponent } from './add-daily-inspection/add-daily-inspection.component';
import { DailyInspectionListComponent } from './daily-inspection-list/daily-inspection-list.component';
import { EditDailyInspectionComponent } from './edit-daily-inspection/edit-daily-inspection.component';

import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';

// import { AddYardComponent } from './add-yard/add-yard.component';
// import { YardsComponent } from './yards/yards.component';
// import { EditYardComponent } from './edit-yard/edit-yard.component';

import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { InsurancesComponent } from './insurances/insurances.component';
import { EditInsuranceComponent } from './edit-insurance/edit-insurance.component';

// import { AddContactComponent } from './add-contact/add-contact.component';
// import { ContactsComponent } from './contacts/contacts.component';
// import { EditContactComponent } from './edit-contact/edit-contact.component';

import { AddReceiverComponent } from './add-receiver/add-receiver.component';
import { ReceiversComponent } from './receivers/receivers.component';
import { EditReceiverComponent } from './edit-receiver/edit-receiver.component';

// import { AddAddressComponent } from './add-address/add-address.component';
// import { AddressesComponent } from './addresses/addresses.component';
// import { EditAddressComponent } from './edit-address/edit-address.component';

import { AddInspectionFormComponent } from './add-inspection-form/add-inspection-form.component';
import { InspectionFormsComponent } from './inspection-forms/inspection-forms.component';
import { EditInspectionFormComponent } from './edit-inspection-form/edit-inspection-form.component';

// import { AddAccountComponent } from './add-account/add-account.component';
// import { AccountsComponent } from './accounts/accounts.component';
// import { EditAccountComponent } from './edit-account/edit-account.component';

import { AddCertificateComponent } from './add-certificate/add-certificate.component';
import { EditCertificateComponent } from './edit-certificate/edit-certificate.component';
import { CertificatesComponent } from './certificates/certificates.component';

import { AddCarrierComponent } from './add-carrier/add-carrier.component';
import { EditCarrierComponent } from './edit-carrier/edit-carrier.component';
import { CarriersComponent } from './carriers/carriers.component';

// import { AddVehicleNewComponent } from './add-vehicle-new/add-vehicle-new.component';
// import { EditVehicleNewComponent } from './edit-vehicle-new/edit-vehicle-new.component';

import { MapDashboardComponent } from './map-dashboard/map-dashboard.component';

import { AddTicketTypeComponent } from './add-ticket-type/add-ticket-type.component';
import { EditTicketTypeComponent } from './edit-ticket-type/edit-ticket-type.component';
import { TicketTypeListComponent } from './ticket-type-list/ticket-type-list.component';
import { CountriesComponent } from './countries/countries.component';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { AddCountryComponent } from './add-country/add-country.component';
import { AddStateComponent } from './add-state/add-state.component';
import { EditStateComponent } from './edit-state/edit-state.component';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { AddCityComponent } from './add-city/add-city.component';

import { AddManufacturerComponent } from './add-manufacturer/add-manufacturer.component';
import { EditManufacturerComponent } from './edit-manufacturer/edit-manufacturer.component';
import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';

import { AddModelComponent } from './add-model/add-model.component';
import { EditModelComponent } from './edit-model/edit-model.component';
import { ModelListComponent } from './model-list/model-list.component';

import { AddAlertComponent } from './add-alert/add-alert.component';
import { EditAlertComponent } from './edit-alert/edit-alert.component';
import { AlertListComponent } from './alert-list/alert-list.component';

import { EditCycleComponent } from './edit-cycle/edit-cycle.component';
import { CycleListComponent } from './cycle-list/cycle-list.component';
import { AddCycleComponent } from './add-cycle/add-cycle.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FleetModule } from './fleet/fleet.module';
import { ComplianceModule } from './compliance/compliance.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { AccountsModule } from './accounts/accounts.module';
import { SafetyModule } from './safety/safety.module';

import {ChartsModule} from 'ng2-charts';
import {Role} from '../objects/objects';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
  {
    path: 'fleet',
    // canActivate: [AuthService],
    // data: { roles: [Role.Admin] },
    loadChildren: () => import('./fleet/fleet.module').then((m) => m.FleetModule) ,
  },
  {
    path: 'compliance',
    loadChildren: () => import('./compliance/compliance.module').then((m) => m.ComplianceModule),
  },
  {
    path: 'dispatch',
    loadChildren: () => import('./dispatch/dispatch.module').then((m) => m.DispatchModule),
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'safety',
    loadChildren: () => import('./safety/safety.module').then((m) => m.SafetyModule),
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },

  {
    path: 'Map-Dashboard',
    component: MapDashboardComponent,
    canActivate: [AuthService],
  },

  // {
  //   path: 'Add-Vehicle',
  //   component: AddVehicleComponent,
  //   canActivate: [AuthService],
  // },

  // { path: 'Vehicle-List', component: VehicleListComponent },
  // { path: 'Edit-Vehicle/:vehicleId', component: EditVehicleComponent },

  { path: 'Left-Bar', component: LeftBarComponent },
  { path: 'R-Forms', component: RFormsComponent },
  { path: 'Add-Quantum', component: AddQuantumComponent },
  { path: 'Edit-Quantum/:quantumId', component: EditQuantumComponent },
  { path: 'Quantum-List', component: QuantumsComponent },

  { path: 'healthcheck', component: HealthcheckComponent },

  // { path: 'Add-User', component: AddUserComponent },
  // { path: 'User-List', component: UserListComponent },
  // { path: 'Edit-User/:userName', component: EditUserComponent },

  { path: 'Add-Group', component: AddGroupComponent },
  { path: 'Group-List', component: GroupListComponent },
  { path: 'Edit-Group/:groupId', component: EditGroupComponent },

  { path: 'Add-Expenses', component: AddExpensesComponent },
  { path: 'Expenses-List', component: ExpensesListComponent },
  { path: 'Edit-Expenses/:expenseId', component: EditExpensesComponent },

  // { path: 'Add-Documents', component: AddDocumentsComponent },
  // { path: 'Documents-List', component: DocumentsComponent },
  // { path: 'Edit-Doucments/:documentId', component: EditDocumentsComponent },

  { path: 'Add-Trip', component: AddTripsComponent },
  { path: 'Trips-List', component: TripsListComponent },
  { path: 'Edit-Trip/:tripId', component: EditTripComponent },

  { path: 'Add-Shipper', component: AddShipperComponent },
  { path: 'Shipper-List', component: ShipperListComponent },
  { path: 'Edit-Shipper/:shipperId', component: EditShipperComponent },

  { path: 'Add-Service-Vendor', component: AddServiceVendorComponent },
  { path: 'Service-Vendor-List', component: ServiceVendorListComponent },
  {
    path: 'Edit-Service-Vendor/:serviceVendorId',
    component: EditServiceVendorComponent,
  },

  { path: 'Add-Daily-Inspection', component: AddDailyInspectionComponent },
  { path: 'Daily-Inspection-List', component: DailyInspectionListComponent },
  {
    path: 'Edit-Daily-Inspection/:inspectionID',
    component: EditDailyInspectionComponent,
  },

  { path: 'Add-Customer', component: AddCustomerComponent },
  { path: 'Customer-List', component: CustomersComponent },
  { path: 'Edit-Customer/:customerID', component: EditCustomerComponent },

  // { path: 'Add-Yard', component: AddYardComponent },
  // { path: 'Yard-List', component: YardsComponent },
  // { path: 'Edit-Yard/:yardID', component: EditYardComponent },

  { path: 'Add-Insurance', component: AddInsuranceComponent },
  { path: 'Insurance-List', component: InsurancesComponent },
  { path: 'Edit-Insurance/:insuranceID', component: EditInsuranceComponent },

  // { path: 'Add-Contact', component: AddContactComponent },
  // { path: 'Contacts-List', component: ContactsComponent },
  // { path: 'Edit-Contact/:contactID', component: EditContactComponent },

  { path: 'Add-Receiver', component: AddReceiverComponent },
  { path: 'Receivers-List', component: ReceiversComponent },
  { path: 'Edit-Receiver/:receiverID', component: EditReceiverComponent },

  // { path: 'Add-Address', component: AddAddressComponent },
  // { path: 'Addresses-List', component: AddressesComponent },
  // { path: 'Edit-Address/:addressID', component: EditAddressComponent },

  { path: 'Add-Inspection-Form', component: AddInspectionFormComponent },
  { path: 'Inspection-Form-List', component: InspectionFormsComponent },
  {
    path: 'Edit-Inspection-Form/:inspectionFormID',
    component: EditInspectionFormComponent,
  },

  // { path: 'Add-Account', component: AddAccountComponent },
  // { path: 'Accounts-List', component: AccountsComponent },
  // { path: 'Edit-Account/:accountID', component: EditAccountComponent },

  { path: 'Add-Certificate', component: AddCertificateComponent },
  { path: 'Certificates-List', component: CertificatesComponent },
  {
    path: 'Edit-Certificate/:certificateID',
    component: EditCertificateComponent,
  },

  { path: 'Add-Carrier', component: AddCarrierComponent },
  { path: 'Carriers-List', component: CarriersComponent },
  { path: 'Edit-Carrier/:carrierID', component: EditCarrierComponent },
  // {path : 'Ndashboard', component : NewDashboardComponent},
  // {path : 'temp', component : TempComponent}

  { path: 'Add-Ticket-Type', component: AddTicketTypeComponent },
  { path: 'Edit-Ticket-Type/:typeID', component: EditTicketTypeComponent },
  { path: 'Ticket-Types-List', component: TicketTypeListComponent },

  { path: 'Add-Country', component: AddCountryComponent },
  { path: 'Edit-Country/:countryID', component: EditCountryComponent },
  { path: 'Country-List', component: CountriesComponent },

  { path: 'Add-State', component: AddStateComponent },
  { path: 'Edit-State/:stateID', component: EditStateComponent },
  { path: 'State-List', component: StatesComponent },

  { path: 'Add-City', component: AddCityComponent },
  { path: 'Edit-City/:cityID', component: EditCityComponent },
  { path: 'City-List', component: CitiesComponent },

  { path: 'Add-Manufacturer', component: AddManufacturerComponent },
  {
    path: 'Edit-Manufacturer/:manufacturerID',
    component: EditManufacturerComponent,
  },
  { path: 'Manufacturers-List', component: ManufacturerListComponent },

  { path: 'Add-Model', component: AddModelComponent },
  {
    path: 'Edit-Model/:modelID',
    component: EditModelComponent,
  },
  { path: 'Models-List', component: ModelListComponent },

  { path: 'Add-Alert', component: AddAlertComponent },
  {
    path: 'Edit-Alert/:alertID',
    component: EditAlertComponent,
  },
  { path: 'Alerts-List', component: AlertListComponent },

  { path: 'Add-Cycle', component: AddCycleComponent },
  { path: 'Edit-Cycle/:cycleID', component: EditCycleComponent },
  { path: 'Cycle-List', component: CycleListComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
@NgModule({
  declarations: [],
  imports: [CommonModule,
  ChartsModule],
})
export class AppRoutingModule {}


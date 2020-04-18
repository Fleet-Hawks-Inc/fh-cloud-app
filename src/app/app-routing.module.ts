import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthService} from './auth.service';
import {AddDriverComponent} from "./add-driver/add-driver.component";
import {AddVehicleComponent} from "./add-vehicle/add-vehicle.component";
import {LeftBarComponent} from "./left-bar/left-bar.component";
import {RFormsComponent} from "./r-forms/r-forms.component";
import {AddQuantumComponent} from "./add-quantum/add-quantum.component";
import {AddUserComponent} from "./add-user/add-user.component";
import {VehicleListComponent} from "./vehicle-list/vehicle-list.component";
import {EditVehicleComponent} from "./edit-vehicle/edit-vehicle.component";
import {HealthcheckComponent} from "./healthcheck/healthcheck.component";
import {QuantumsComponent} from "./quantums/quantums.component";
import {EditQuantumComponent} from "./edit-quantum/edit-quantum.component";
import {UserListComponent} from "./user-list/user-list.component";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {AddGroupComponent} from "./add-group/add-group.component";
import {EditGroupComponent} from "./edit-group/edit-group.component";
import {GroupListComponent} from "./group-list/group-list.component";
import {AddAssetsComponent} from "./add-assets/add-assets.component";
import {AssetListComponent} from "./asset-list/asset-list.component";
import {EditAssetComponent} from "./edit-asset/edit-asset.component";
import {AddFuelEntryComponent} from "./add-fuel-entry/add-fuel-entry.component";
import {FuelEntryListComponent} from "./fuel-entry-list/fuel-entry-list.component";
import {EditFuelEntryComponent} from "./edit-fuel-entry/edit-fuel-entry.component";
import {AddExpensesComponent} from "./add-expenses/add-expenses.component";
import {ExpensesListComponent} from "./expenses-list/expenses-list.component";
import {EditExpensesComponent} from "./edit-expenses/edit-expenses.component";
import {AddExpenseTypeComponent} from "./add-expense-type/add-expense-type.component";
import {ExpenseTypeListComponent} from "./expense-type-list/expense-type-list.component";
import {EditExpenseTypeComponent} from "./edit-expense-type/edit-expense-type.component";
import {DocumentsComponent} from "./documents/documents.component";
import {AddDocumentsComponent} from "./add-documents/add-documents.component";
import {EditDocumentsComponent} from "./edit-documents/edit-documents.component";
import {AddTripsComponent} from "./add-trips/add-trips.component";
import {TripsListComponent} from "./trips-list/trips-list.component";
import {EditTripComponent} from "./edit-trip/edit-trip.component";
import {AddShipperComponent} from "./add-shipper/add-shipper.component";
import {ShipperListComponent} from "./shipper-list/shipper-list.component";
import {EditShipperComponent} from "./edit-shipper/edit-shipper.component";
import {AddServiceVendorComponent} from "./add-service-vendor/add-service-vendor.component";
import {ServiceVendorListComponent} from "./service-vendor-list/service-vendor-list.component";
import {EditServiceVendorComponent} from "./edit-service-vendor/edit-service-vendor.component";

import {AddDailyInspectionComponent} from "./add-daily-inspection/add-daily-inspection.component";
import {DailyInspectionListComponent} from "./daily-inspection-list/daily-inspection-list.component";
import {EditDailyInspectionComponent} from "./edit-daily-inspection/edit-daily-inspection.component";

import {AddCustomerComponent} from "./add-customer/add-customer.component";
import {CustomersComponent} from "./customers/customers.component";
import {EditCustomerComponent} from "./edit-customer/edit-customer.component";

import {AddYardComponent} from "./add-yard/add-yard.component";
import {YardsComponent} from "./yards/yards.component";
import {EditYardComponent} from "./edit-yard/edit-yard.component";

import {AddInsuranceComponent} from "./add-insurance/add-insurance.component";
import {InsurancesComponent} from "./insurances/insurances.component";
import {EditInsuranceComponent} from "./edit-insurance/edit-insurance.component";

import {AddEntryComponent} from "./add-entry/add-entry.component";
import {EntriesComponent} from "./entries/entries.component";
import {EditEntryComponent} from "./edit-entry/edit-entry.component";

import {AddContactComponent} from "./add-contact/add-contact.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {EditContactComponent} from "./edit-contact/edit-contact.component";

import {AddReceiverComponent} from "./add-receiver/add-receiver.component";
import {ReceiversComponent} from "./receivers/receivers.component";
import {EditReceiverComponent} from "./edit-receiver/edit-receiver.component";

import {AddAddressComponent} from "./add-address/add-address.component";
import {AddressesComponent} from "./addresses/addresses.component";
import {EditAddressComponent} from "./edit-address/edit-address.component";

import {AddInspectionFormComponent} from "./add-inspection-form/add-inspection-form.component";
import {InspectionFormsComponent} from "./inspection-forms/inspection-forms.component";
import {EditInspectionFormComponent} from "./edit-inspection-form/edit-inspection-form.component";

import {AddAccountComponent} from "./add-account/add-account.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {EditAccountComponent} from "./edit-account/edit-account.component";

import {AddTicketComponent} from "./add-ticket/add-ticket.component";
import {TicketsComponent} from "./tickets/tickets.component";
import {EditTicketComponent} from "./edit-ticket/edit-ticket.component";

import {AddVehicleServiceLogComponent} from "./add-vehicle-service-log/add-vehicle-service-log.component";
import {VehicleServiceLogsComponent} from "./vehicle-service-logs/vehicle-service-logs.component";
import {EditVehicleServiceLogComponent} from "./edit-vehicle-service-log/edit-vehicle-service-log.component";

import {AddCertificateComponent} from "./add-certificate/add-certificate.component";
import {EditCertificateComponent} from "./edit-certificate/edit-certificate.component";
import {CertificatesComponent} from "./certificates/certificates.component";

import {AddCarrierComponent} from "./add-carrier/add-carrier.component";
import {EditCarrierComponent} from "./edit-carrier/edit-carrier.component";
import {CarriersComponent} from "./carriers/carriers.component";

import {AddVehicleNewComponent} from "./add-vehicle-new/add-vehicle-new.component";
import { EditVehicleNewComponent } from './edit-vehicle-new/edit-vehicle-new.component';

import {MapDashboardComponent} from './map-dashboard/map-dashboard.component';


import { EditDriverComponent } from './edit-driver/edit-driver.component';
import {DriverListComponent} from "./driver-list/driver-list.component";

import {AddItemComponent} from "./add-item/add-item.component";
import {ItemsListComponent} from "./items-list/items-list.component";
import { EditItemComponent } from './edit-item/edit-item.component';
import {AddServiceProgramComponent} from './add-service-program/add-service-program.component';
import {EditServiceProgramComponent} from './edit-service-program/edit-service-program.component';
import {ServiceProgramListComponent} from './service-program-list/service-program-list.component';

import {AddVendorComponent} from "./add-vendor/add-vendor.component";
import {EditVendorComponent} from "./edit-vendor/edit-vendor.component";
import {VendorsListComponent} from "./vendors-list/vendors-list.component";

import {AddItemGroupComponent} from "./add-item-group/add-item-group.component";
import {EditItemGroupComponent} from "./edit-item-group/edit-item-group.component";
import {ItemGroupListComponent} from "./item-group-list/item-group-list.component";

const routes: Routes = [
   {path: '',  redirectTo: '/Login', pathMatch: 'full'},
   {path: 'Login', component: LoginComponent},
   {path: 'Dashboard', component: DashboardComponent, canActivate: [AuthService]},

    {path: 'Map-Dashboard', component: MapDashboardComponent, canActivate: [AuthService]},

    {path: 'Add-Vehicle', component: AddVehicleComponent, canActivate: [AuthService]},
    {path: 'Left-Bar', component: LeftBarComponent},
    {path: 'R-Forms', component: RFormsComponent},
    {path: 'Add-Quantum', component: AddQuantumComponent},
    {path: 'Edit-Quantum/:quantumId', component: EditQuantumComponent},
    {path: 'Quantum-List', component: QuantumsComponent},
    {path: 'Vehicle-List', component: VehicleListComponent},
    {path: 'Edit-Vehicle/:vehicleId', component: EditVehicleComponent},
    {path: 'healthcheck', component: HealthcheckComponent},

    {path: 'Add-User', component: AddUserComponent},
    {path: 'User-List', component: UserListComponent},
    {path: 'Edit-User/:userName', component: EditUserComponent},

    {path: 'Add-Group', component: AddGroupComponent},
    {path: 'Group-List', component: GroupListComponent},
    {path: 'Edit-Group/:groupId', component: EditGroupComponent},

    {path: 'Add-Assets', component: AddAssetsComponent},
    {path: 'Assets-List', component: AssetListComponent},
    {path: 'Edit-Asset/:assetID', component: EditAssetComponent},

    {path: 'Add-Fuel-Entry', component: AddFuelEntryComponent},
    {path: 'Fuel-Entry-List', component: FuelEntryListComponent},
    {path: 'Edit-Fuel-Entry/:entryID', component: EditFuelEntryComponent},

    {path: 'Add-Expenses', component: AddExpensesComponent},
    {path: 'Expenses-List', component: ExpensesListComponent},
    {path: 'Edit-Expenses/:expenseId', component: EditExpensesComponent},

    {path: 'Add-Expense-Type', component: AddExpenseTypeComponent},
    {path: 'Expenses-Type-List', component: ExpenseTypeListComponent},
    {path: 'Edit-Expense-Type/:expenseTypeID', component: EditExpenseTypeComponent},


    {path: 'Add-Documents', component: AddDocumentsComponent},
    {path: 'Documents-List', component: DocumentsComponent},
    {path: 'Edit-Doucments/:documentId', component: EditDocumentsComponent},

    {path: 'Add-Trip', component: AddTripsComponent},
    {path: 'Trips-List', component: TripsListComponent},
    {path: 'Edit-Trip/:tripId', component: EditTripComponent},

    {path: 'Add-Shipper', component: AddShipperComponent},
    {path: 'Shipper-List', component: ShipperListComponent},
    {path: 'Edit-Shipper/:shipperId', component: EditShipperComponent},

    {path: 'Add-Service-Vendor', component: AddServiceVendorComponent},
    {path: 'Service-Vendor-List', component: ServiceVendorListComponent},
    {path: 'Edit-Service-Vendor/:serviceVendorId', component: EditServiceVendorComponent},

    {path: 'Add-Daily-Inspection', component: AddDailyInspectionComponent},
    {path: 'Daily-Inspection-List', component: DailyInspectionListComponent},
    {path: 'Edit-Daily-Inspection/:inspectionID', component: EditDailyInspectionComponent},

    {path: 'Add-Customer', component: AddCustomerComponent},
    {path: 'Customer-List', component: CustomersComponent},
    {path: 'Edit-Customer/:customerID', component: EditCustomerComponent},

    {path: 'Add-Yard', component: AddYardComponent},
    {path: 'Yard-List', component: YardsComponent},
    {path: 'Edit-Yard/:yardID', component: EditYardComponent},

    {path: 'Add-Insurance', component: AddInsuranceComponent},
    {path: 'Insurance-List', component: InsurancesComponent},
    {path: 'Edit-Insurance/:insuranceID', component: EditInsuranceComponent},

    {path: 'Add-Entry', component: AddEntryComponent},
    {path: 'Entries-List', component: EntriesComponent},
    {path: 'Edit-Entry/:entryID', component: EditEntryComponent},

    {path: 'Add-Contact', component: AddContactComponent},
    {path: 'Contacts-List', component: ContactsComponent},
    {path: 'Edit-Contact/:contactID', component: EditContactComponent},

    {path: 'Add-Receiver', component: AddReceiverComponent},
    {path: 'Receivers-List', component: ReceiversComponent},
    {path: 'Edit-Receiver/:receiverID', component: EditReceiverComponent},

    {path: 'Add-Address', component: AddAddressComponent},
    {path: 'Addresses-List', component: AddressesComponent},
    {path: 'Edit-Address/:addressID', component: EditAddressComponent},

    {path: 'Add-Inspection-Form', component: AddInspectionFormComponent},
    {path: 'Inspection-Form-List', component: InspectionFormsComponent},
    {path: 'Edit-Inspection-Form/:inspectionFormID', component: EditInspectionFormComponent},

    {path: 'Add-Account', component: AddAccountComponent},
    {path: 'Accounts-List', component: AccountsComponent},
    {path: 'Edit-Account/:accountID', component: EditAccountComponent},

    {path: 'Add-Ticket', component: AddTicketComponent},
    {path: 'Tickets-List', component: TicketsComponent},
    {path: 'Edit-Ticket/:ticketID', component: EditTicketComponent},

    {path: 'Add-Vehicle-Service-Log', component: AddVehicleServiceLogComponent},
    {path: 'Vehicle-Service-Logs-List', component: VehicleServiceLogsComponent},
    {path: 'Edit-Vehicle-Service-Log/:logID', component: EditVehicleServiceLogComponent},

    {path: 'Add-Certificate', component: AddCertificateComponent},
    {path: 'Certificates-List', component: CertificatesComponent},
    {path: 'Edit-Certificate/:certificateID', component: EditCertificateComponent},

    {path: 'Add-Carrier', component: AddCarrierComponent},
    {path: 'Carriers-List', component: CarriersComponent},
    {path: 'Edit-Carrier/:carrierID', component: EditCarrierComponent},
    // {path : 'Ndashboard', component : NewDashboardComponent},
    // {path : 'temp', component : TempComponent}

    {path: 'Add-Vehicle-New', component: AddVehicleNewComponent},
    {path: 'Edit-Vehicle-New/:vehicleID', component: EditVehicleNewComponent},

    {path: 'Add-Driver', component: AddDriverComponent},
    {path: 'Edit-Driver/:userName', component: EditDriverComponent},
    {path: 'Drivers-List', component: DriverListComponent},

    {path: 'Add-Item', component: AddItemComponent},
    {path: 'Edit-Item/:itemID', component: EditItemComponent},
    {path: 'Item-List', component: ItemsListComponent},

    {path: 'Add-Item-Group', component: AddItemGroupComponent},
    {path: 'Edit-Item-Group/:groupID', component: EditItemGroupComponent},
    {path: 'Item-Group-List', component: ItemGroupListComponent},


  {path: 'Add-Service-Program', component: AddServiceProgramComponent},
  {path: 'Edit-Service-Program/:programID', component: EditServiceProgramComponent},
  {path: 'Service-Program-List', component: ServiceProgramListComponent},

    {path: 'Add-Vendor', component: AddVendorComponent},
    {path: 'Edit-Vendor/:vendorID', component: EditVendorComponent},
    {path: 'Vendors-List', component: VendorsListComponent},

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }

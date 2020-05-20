import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DispatchRoutingModule } from "./dispatch-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";

import { AddShipperComponent } from './shipper/add-shipper/add-shipper.component';
import { ShipperListComponent } from './shipper/shipper-list/shipper-list.component';
import { EditShipperComponent } from './shipper/edit-shipper/edit-shipper.component';

import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';

import { AddReceiverComponent } from './receiver/add-receiver/add-receiver.component';
import { ReceiversComponent } from './receiver/receivers/receivers.component';
import { EditReceiverComponent } from './receiver/edit-receiver/edit-receiver.component';

import { AddFactoringCompanyComponent } from './factoring-company/add-factoring-company/add-factoring-company.component';
import { FactoringCompanyListComponent } from './factoring-company/factoring-company-list/factoring-company-list.component';
import { EditFactoringCompanyComponent } from './factoring-company/edit-factoring-company/edit-factoring-company.component';

import { AddAddressComponent } from './address/add-address/add-address.component';
import { EditAddressComponent } from './address/edit-address/edit-address.component';
import { AddressesComponent } from './address/addresses/addresses.component';

import { AddContactComponent } from './contact/add-contact/add-contact.component';
import { ContactsComponent } from './contact/contacts/contacts.component';
import { EditContactComponent } from './contact/edit-contact/edit-contact.component';

import { AddAccountComponent } from './account/add-account/add-account.component';
import { EditAccountComponent } from './account/edit-account/edit-account.component';
import { AccountsComponent } from './account/accounts/accounts.component';

import { AddDocumentsComponent } from './document/add-documents/add-documents.component';
import { EditDocumentsComponent } from './document/edit-documents/edit-documents.component';
import { DocumentsComponent } from './document/documents/documents.component';
import { CreateLoadComponent } from './create-load/create-load.component';


@NgModule({
  imports: [CommonModule, DispatchRoutingModule, SharedModule, FormsModule],

  declarations: [
    AddShipperComponent,
    ShipperListComponent,
    EditShipperComponent,
    AddCustomerComponent,
    CustomersComponent,
    EditCustomerComponent,
    AddReceiverComponent,
    ReceiversComponent,
    EditReceiverComponent,
    AddFactoringCompanyComponent,
    FactoringCompanyListComponent,
    EditFactoringCompanyComponent,
    AddAddressComponent,
    EditAddressComponent,
    AddressesComponent,
    AddContactComponent,
    ContactsComponent,
    EditContactComponent,
    AddAccountComponent,
    EditAccountComponent,
    AccountsComponent,
    AddDocumentsComponent,
    EditDocumentsComponent,
    DocumentsComponent,
    CreateLoadComponent
  ],
})
export class DispatchModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddShipperComponent } from './shipper/add-shipper/add-shipper.component';
import { ShipperListComponent } from './shipper/shipper-list/shipper-list.component';
import { EditShipperComponent } from './shipper/edit-shipper/edit-shipper.component';
import { ShipperAddressListComponent } from './shipper/shipper-address/shipper-address-list/shipper-address-list.component';
import { EditShipperAddressComponent } from './shipper/shipper-address/edit-shipper-address/edit-shipper-address.component';

import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import { CustomerAddressListComponent } from './customer/customer-address/customer-address-list/customer-address-list.component';
import { EditCustomerAddressComponent } from './customer/customer-address/edit-customer-address/edit-customer-address.component';

import { AddReceiverComponent } from './receiver/add-receiver/add-receiver.component';
import { ReceiversComponent } from './receiver/receivers/receivers.component';
import { EditReceiverComponent } from './receiver/edit-receiver/edit-receiver.component';
import { ReceiverAddressListComponent } from './receiver/receiver-address/receiver-address-list/receiver-address-list.component';
import { EditReceiverAddressComponent } from './receiver/receiver-address/edit-receiver-address/edit-receiver-address.component';

import { AddFactoringCompanyComponent } from './factoring-company/add-factoring-company/add-factoring-company.component';
import { FactoringCompanyListComponent } from './factoring-company/factoring-company-list/factoring-company-list.component';
import { EditFactoringCompanyComponent } from './factoring-company/edit-factoring-company/edit-factoring-company.component';
import { EditFactoringCompanyAddressComponent } from './factoring-company/factoring-company-address/edit-factoring-company-address/edit-factoring-company-address.component';
import { FactoringCompanyAddressListComponent } from './factoring-company/factoring-company-address/factoring-company-address-list/factoring-company-address-list.component';

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

import {CreateLoadComponent} from "./create-load/create-load.component";



const routes: Routes = [
  {
    path: "shipper",
    children: [
      { path: "Add-Shipper", component:  AddShipperComponent },
      { path: "Edit-Shipper/:shipperID", component: EditShipperComponent },
      { path: "Shippers-List", component: ShipperListComponent },
      { path: "Shipper-Address-List", component: ShipperAddressListComponent },
      { path: "shipper-address/Edit-Shipper-Address/:addressID", component: EditShipperAddressComponent }
    ]
  },
  {
    path: "customer",
    children: [
      { path: "Add-Customer", component:  AddCustomerComponent },
      { path: "Edit-Customer/:customerID", component: EditCustomerComponent},
      { path: "Customers-List", component: CustomersComponent },
      { path: "Customer-Address-List", component: CustomerAddressListComponent },
      { path: "customer-address/Edit-Customer-Address/:addressID", component: EditCustomerAddressComponent }
    ]
  },
  {
    path: "receiver",
    children: [
      { path: "Add-Receiver", component:  AddReceiverComponent },
      { path: "Edit-Receiver/:receiverID", component: EditReceiverComponent},
      { path: "Receivers-List", component: ReceiversComponent },
      { path: "Receiver-Address-List", component: ReceiverAddressListComponent },
      { path: "receiver-address/Edit-Receiver-Address/:addressID", component: EditReceiverAddressComponent }
    ]
  },
  {
    path: "factoring-company",
    children: [
      { path: "Add-Factoring-Company", component:  AddFactoringCompanyComponent },
      { path: "Edit-Factoring-Company/:factoringCompanyID", component: EditFactoringCompanyComponent},
      { path: "Factoring-Company-List", component: FactoringCompanyListComponent },
      { path: "Factoring-Company-Address-List", component: FactoringCompanyAddressListComponent},
      { path: "factoring-company-address/Edit-Factoring-Company-Address/:addressID", component: EditFactoringCompanyAddressComponent }
    ]
  },
  {
    path: "address",
    children: [
      { path: "Add-Address", component:  AddAddressComponent },
      { path: "Edit-Address/:addressID", component: EditAddressComponent},
      { path: "Address-List", component: AddressesComponent }
    ]
  },
  {
    path: "contact",
    children: [
      { path: "Add-Contact", component:  AddContactComponent },
      { path: "Edit-Contact/:contactID", component: EditContactComponent},
      { path: "Contact-List", component: ContactsComponent }
    ]
  },
  {
    path: "account",
    children: [
      { path: "Add-Account", component:  AddAccountComponent },
      { path: "Edit-Account/:accountID", component: EditAccountComponent},
      { path: "Account-List", component: AccountsComponent }
    ]
  },
  {
    path: "document",
    children: [
      { path: "Add-Document", component:  AddDocumentsComponent},
      { path: "Edit-Document/:documentID", component: EditDocumentsComponent},
      { path: "Document-List", component: DocumentsComponent }
    ]
  },
  {
    path: "create-load",
    component: CreateLoadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }

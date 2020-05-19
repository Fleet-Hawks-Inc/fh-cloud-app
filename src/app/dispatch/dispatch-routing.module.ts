import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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


const routes: Routes = [
  {
    path: "shipper",
    children: [
      { path: "Add-Shipper", component:  AddShipperComponent },
      { path: "Edit-Shipper/:shipperID", component: EditShipperComponent },
      { path: "Shippers-List", component: ShipperListComponent }
    ]
  },
  {
    path: "customer",
    children: [
      { path: "Add-Customer", component:  AddCustomerComponent },
      { path: "Edit-Customer/:customerID", component: EditCustomerComponent},
      { path: "Customers-List", component: CustomersComponent }
    ]
  },
  {
    path: "receiver",
    children: [
      { path: "Add-Receiver", component:  AddReceiverComponent },
      { path: "Edit-Receiver/:receiverID", component: EditReceiverComponent},
      { path: "Receivers-List", component: ReceiversComponent }
    ]
  },
  {
    path: "factoring-company",
    children: [
      { path: "Add-Factoring-Company", component:  AddFactoringCompanyComponent },
      { path: "Edit-Factoring-Company/:factoringCompanyID", component: EditFactoringCompanyComponent},
      { path: "Factoring-Company-List", component: FactoringCompanyListComponent }
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
      { path: "Edit-document/:documentID", component: EditDocumentsComponent},
      { path: "Document-List", component: DocumentsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }

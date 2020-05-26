import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddShipperComponent } from './shipper/add-shipper/add-shipper.component';
import { ShipperListComponent } from './shipper/shipper-list/shipper-list.component';
import { EditShipperComponent } from './shipper/edit-shipper/edit-shipper.component';
import { ShipperAddressListComponent } from './shipper/shipper-address/shipper-address-list/shipper-address-list.component';

import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomersComponent } from './customer/customers/customers.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import { CustomerAddressListComponent } from './customer/customer-address/customer-address-list/customer-address-list.component';

import { AddReceiverComponent } from './receiver/add-receiver/add-receiver.component';
import { ReceiversComponent } from './receiver/receivers/receivers.component';
import { EditReceiverComponent } from './receiver/edit-receiver/edit-receiver.component';
import { ReceiverAddressListComponent } from './receiver/receiver-address/receiver-address-list/receiver-address-list.component';

import { AddFactoringCompanyComponent } from './factoring-company/add-factoring-company/add-factoring-company.component';
import { FactoringCompanyListComponent } from './factoring-company/factoring-company-list/factoring-company-list.component';
import { EditFactoringCompanyComponent } from './factoring-company/edit-factoring-company/edit-factoring-company.component';
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
import {LoadBoardComponent} from "./load-board/load-board.component";
import {LoadDetailComponent} from "./load-detail/load-detail.component";
import {HttpInterceptorProviders} from "../helpers/interceptor.provider";

// NOTE: // EDIT ADDRESS COMPONENT IN ADDRESS FOLDER IS USED FOR EDITING ADDRESS OF Shipper,Receiver,FactoringCompany AND Customer 

const routes: Routes = [
  {
    path: "shipper",
    children: [
      { path: "Add-Shipper", component:  AddShipperComponent },
      { path: "Edit-Shipper/:shipperID", component: EditShipperComponent },
      { path: "Shippers-List", component: ShipperListComponent },
      { path: "Shipper-Address-List", component: ShipperAddressListComponent },
    ]
  },
  {
    path: "customer",
    children: [
      { path: "Add-Customer", component:  AddCustomerComponent },
      { path: "Edit-Customer/:customerID", component: EditCustomerComponent},
      { path: "Customers-List", component: CustomersComponent },
      { path: "Customer-Address-List", component: CustomerAddressListComponent },
    ]
  },
  {
    path: "receiver",
    children: [
      { path: "Add-Receiver", component:  AddReceiverComponent },
      { path: "Edit-Receiver/:receiverID", component: EditReceiverComponent},
      { path: "Receivers-List", component: ReceiversComponent },
      { path: "Receiver-Address-List", component: ReceiverAddressListComponent },
    ]
  },
  {
    path: "factoring-company",
    children: [
      { path: "Add-Factoring-Company", component:  AddFactoringCompanyComponent },
      { path: "Edit-Factoring-Company/:factoringCompanyID", component: EditFactoringCompanyComponent},
      { path: "Factoring-Company-List", component: FactoringCompanyListComponent },
      { path: "Factoring-Company-Address-List", component: FactoringCompanyAddressListComponent},
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
  },
  {
    path: "load-board",
    component: LoadBoardComponent
  },
  {
    path: "load-detail",
    component: LoadDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HttpInterceptorProviders],
})
export class DispatchRoutingModule { }

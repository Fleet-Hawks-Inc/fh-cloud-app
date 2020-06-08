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
import {CreateLoadNewComponent} from "./create-load-new/create-load-new.component";

import { AceManifestComponent } from './cross-border/ace-manifest/ace-manifest.component';
import { NewAceManifestComponent } from './cross-border/ace-documents/new-ace-manifest/new-ace-manifest.component';
import { AceShipmentComponent } from './cross-border/ace-documents/ace-shipment/ace-shipment.component';
import { AceCommodityComponent } from './cross-border/ace-documents/ace-commodity/ace-commodity.component'; 

import { AciEmanifestComponent } from './cross-border/aci-emanifest/aci-emanifest.component';
import { NewAciManifestComponent } from './cross-border/aci-documents/new-aci-manifest/new-aci-manifest.component';
import { AciShipmentComponent } from './cross-border/aci-documents/aci-shipment/aci-shipment.component';
import { AciCommodityComponent } from './cross-border/aci-documents/aci-commodity/aci-commodity.component';

import { MyDocumentsComponent } from './documents/my-documents/my-documents.component';
import { CompanyDocumentsComponent } from './documents/company-documents/company-documents.component';

import { AllDispatchComponent } from './dispatch/all-dispatch/all-dispatch.component';
import { DispatchPlannerComponent } from './dispatch/dispatch-planner/dispatch-planner.component';
import { AllLoadsComponent } from './loads/all-loads/all-loads.component';
import { RoutePlannerComponent } from './routing/route-planner/route-planner.component';
import { RoutePlaybackComponent } from './routing/route-playback/route-playback.component';
import { AddLoadComponent } from './loads/add-load/add-load.component';
import { AddDispatchComponent } from './dispatch/add-dispatch/add-dispatch.component';


// NOTE: // EDIT ADDRESS COMPONENT IN ADDRESS FOLDER IS USED FOR EDITING ADDRESS OF Shipper,Receiver,FactoringCompany AND Customer 


const routes: Routes = [
  {
    path: "routing",
    children: [
      { path: "Route-Planner", component:  RoutePlannerComponent },
      { path: "Route-Playback", component: RoutePlaybackComponent}
     
    ]
  },
  {
    path: "loads",
    children: [
      { path: "All-Loads", component:  AllLoadsComponent },
      { path: "Add-Load", component:  AddLoadComponent }
    ]
  },
  {
    path: "dispatch",
    children: [
      { path: "All-Dispatch", component:  AllDispatchComponent },
      { path: "Dispatch-Planner", component: DispatchPlannerComponent },
      { path: "Add-Dispatch", component: AddDispatchComponent }
        ]
  },
  {
    path: "cross-border",
    children: [
      {path: "ACE-eManifest",component: AceManifestComponent},
      {path: "ACE-new-eManifest",component: NewAceManifestComponent},
      {path: "ACE-shipment",component: AceShipmentComponent},
      {path: "ACE-commodity",component: AceCommodityComponent},

      {path: "ACI-eManifest",component: AciEmanifestComponent},
      {path: "ACI-new-eManifest",component: NewAciManifestComponent},
      {path: "ACI-shipment",component: AciShipmentComponent},
      {path: "ACI-commodity",component: AciCommodityComponent}
    ]
  },
  {
    path: "load-board",
    component: LoadBoardComponent
  },
  {
    path: "documents",
    children: [
      { path: "My-Documents", component: MyDocumentsComponent},
      { path: "Company-Documents", component: CompanyDocumentsComponent }
    ]
  },
  {
    path: "create-load",
    component: CreateLoadNewComponent
  },

  {
    path: "load-detail",
    component: LoadDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class DispatchRoutingModule { }

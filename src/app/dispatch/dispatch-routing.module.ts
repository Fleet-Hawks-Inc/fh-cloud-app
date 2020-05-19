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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }

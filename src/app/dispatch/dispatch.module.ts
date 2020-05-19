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
    EditFactoringCompanyComponent
  ],
})
export class DispatchModule {}

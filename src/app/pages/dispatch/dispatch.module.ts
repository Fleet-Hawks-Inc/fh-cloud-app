import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchRoutingModule } from './dispatch-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FullCalendarModule } from '@fullcalendar/angular';
import {ChartsModule} from 'ng2-charts'; 

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
import { CreateLoadComponent } from './create-load/create-load.component';
import { LoadBoardComponent } from './load-board/load-board.component';
import { LoadDetailComponent } from './load-detail/load-detail.component';

import { CreateLoadNewComponent } from './create-load-new/create-load-new.component';
import { RoutePlannerComponent } from './routing/route-planner/route-planner.component';
import { RoutePlaybackComponent } from './routing/route-playback/route-playback.component';
import { AllLoadsComponent } from './loads/all-loads/all-loads.component';
import { AddLoadComponent } from './loads/add-load/add-load.component';
import { AllDispatchComponent } from './dispatch/all-dispatch/all-dispatch.component';
import { AddDispatchComponent } from './dispatch/add-dispatch/add-dispatch.component';
import { DispatchPlannerComponent } from './dispatch/dispatch-planner/dispatch-planner.component';
import { AceManifestComponent } from './cross-border/ace-manifest/ace-manifest.component';
import { AciEmanifestComponent } from './cross-border/aci-emanifest/aci-emanifest.component';
import { MyDocumentsComponent } from './documents/my-documents/my-documents.component';
import { CompanyDocumentsComponent } from './new-documents/company-documents/company-documents.component';

import { AceShipmentComponent } from './cross-border/ace-documents/ace-shipment/ace-shipment.component';
import { AceCommodityComponent } from './cross-border/ace-documents/ace-commodity/ace-commodity.component';
import { NewAceManifestComponent } from './cross-border/ace-documents/new-ace-manifest/new-ace-manifest.component';
import { NewAciManifestComponent } from './cross-border/aci-documents/new-aci-manifest/new-aci-manifest.component';
import { AciShipmentComponent } from './cross-border/aci-documents/aci-shipment/aci-shipment.component';
import { AciCommodityComponent } from './cross-border/aci-documents/aci-commodity/aci-commodity.component';
import { RouteListComponent } from './permanent-routing/route-list/route-list.component';
import { AddRouteComponent } from './permanent-routing/add-route/add-route.component';
import { EditRouteComponent } from './permanent-routing/edit-route/edit-route.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import {Injectable} from '@angular/core';
import { NewDocumentsComponent } from './new-documents/new-documents.component';
import { MyDocumentListComponent } from './new-documents/my-documents/my-document-list.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { AddOrdersComponent } from './orders/add-orders/add-orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

import { EManifestsComponent } from './cross-border/e-manifests/e-manifests.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxTagsInputModule } from 'ngx-tags-input';
import { AceDetailsComponent } from './cross-border/ace-documents/ace-details/ace-details.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AciDetailsComponent } from './cross-border/aci-documents/aci-details/aci-details.component';

import { AddQuotesComponent } from './quotes/add-quotes/add-quotes.component';
import { QuotesListComponent } from './quotes/quotes-list/quotes-list.component';
import { QuoteDetailComponent } from './quotes/quote-detail/quote-detail.component';


import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouteDetailComponent } from './permanent-routing/route-detail/route-detail.component';
import { TripListComponent } from './trips/trip-list/trip-list.component';
import { AddTripComponent } from './trips/add-trip/add-trip.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { EditTripComponent } from './trips/edit-trip/edit-trip.component';
import { CalendarViewComponent } from './planner/calendar-view/calendar-view.component';
import { MapViewComponent } from './planner/map-view/map-view.component';
import { DispatchOverviewComponent } from './home/dispatch-overview/dispatch-overview.component';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = ',';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    // return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
    let MonthList = [
      'Jan',
      'Feb',
      'Mar',
      'April',
      'May',
      'Jun',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    return date ? MonthList[date.month - 1] + ' ' + date.day + this.DELIMITER + date.year : '';
  }
}

@NgModule({
  imports: [
    CommonModule,
    DispatchRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DataTablesModule,

    NgSelectModule,
    HttpClientModule,
    NgxTagsInputModule,
    MatExpansionModule

    DragDropModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    FullCalendarModule,
    ChartsModule

  ],

  declarations: [
    AddShipperComponent,
    ShipperListComponent,
    EditShipperComponent,
    ShipperAddressListComponent,

    AddCustomerComponent,
    CustomersComponent,
    EditCustomerComponent,
    CustomerAddressListComponent,

    AddReceiverComponent,
    ReceiversComponent,
    EditReceiverComponent,
    ReceiverAddressListComponent,

    AddFactoringCompanyComponent,
    FactoringCompanyListComponent,
    EditFactoringCompanyComponent,
    FactoringCompanyAddressListComponent,

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

    CreateLoadComponent,

    LoadBoardComponent,

    LoadDetailComponent,

    CreateLoadNewComponent,

    RoutePlannerComponent,

    RoutePlaybackComponent,

    AllLoadsComponent,
    AddLoadComponent,

    AllDispatchComponent,
    DispatchPlannerComponent,
    AddDispatchComponent,


    EManifestsComponent,
    AciEmanifestComponent,
    NewAciManifestComponent,
    AciShipmentComponent,
    AciCommodityComponent,

    MyDocumentsComponent,
    CompanyDocumentsComponent,


    AceManifestComponent,
    AceShipmentComponent,
    AceCommodityComponent,
    NewAceManifestComponent,
    RouteListComponent,
    AddRouteComponent,
    EditRouteComponent,
    NewDocumentsComponent,
    MyDocumentListComponent,
    OrdersListComponent,
    AddOrdersComponent,
    OrderDetailComponent,

    AceDetailsComponent,
    AciDetailsComponent,

    AddQuotesComponent,
    QuotesListComponent,
    QuoteDetailComponent,
    

    RouteDetailComponent,
    TripListComponent,
    AddTripComponent,
    TripDetailComponent,
    EditTripComponent,
    CalendarViewComponent,
    MapViewComponent,
    DispatchOverviewComponent,


  ],

  providers: [NgSelectConfig, ɵs,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
  ],

})
export class DispatchModule {}

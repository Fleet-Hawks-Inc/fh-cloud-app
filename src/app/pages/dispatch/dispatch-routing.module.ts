import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoadBoardComponent} from './load-board/load-board.component';
import {LoadDetailComponent} from './load-detail/load-detail.component';
import {CreateLoadNewComponent} from './create-load-new/create-load-new.component';
import { NewAceManifestComponent } from './cross-border/ace-documents/new-ace-manifest/new-ace-manifest.component';

import { NewAciManifestComponent } from './cross-border/aci-documents/new-aci-manifest/new-aci-manifest.component';

import { MyDocumentsComponent } from './documents/my-documents/my-documents.component';
import { CompanyDocumentsComponent } from './new-documents/company-documents/company-documents.component';

import { AllDispatchComponent } from './dispatch/all-dispatch/all-dispatch.component';
import { DispatchPlannerComponent } from './dispatch/dispatch-planner/dispatch-planner.component';
import { AllLoadsComponent } from './loads/all-loads/all-loads.component';
import { RoutePlannerComponent } from './routing/route-planner/route-planner.component';
import { RoutePlaybackComponent } from './routing/route-playback/route-playback.component';
import { AddLoadComponent } from './loads/add-load/add-load.component';
import { AddDispatchComponent } from './dispatch/add-dispatch/add-dispatch.component';
import { RouteListComponent } from './permanent-routing/route-list/route-list.component';
import { AddRouteComponent } from './permanent-routing/add-route/add-route.component';
import { EditRouteComponent } from './permanent-routing/edit-route/edit-route.component';
import { NewDocumentsComponent } from './new-documents/new-documents.component';
import { MyDocumentListComponent } from './new-documents/my-documents/my-document-list.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { AddOrdersComponent } from './orders/add-orders/add-orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { QuotesListComponent } from './quotes/quotes-list/quotes-list.component';
import { AddQuotesComponent } from './quotes/add-quotes/add-quotes.component';
import { QuoteDetailComponent } from './quotes/quote-detail/quote-detail.component';

import { EManifestsComponent } from './cross-border/e-manifests/e-manifests.component';
import { AceDetailsComponent } from './cross-border/ace-documents/ace-details/ace-details.component';
import { AciDetailsComponent } from './cross-border/aci-documents/aci-details/aci-details.component';

import { RouteDetailComponent } from './permanent-routing/route-detail/route-detail.component';
import { TripListComponent } from './trips/trip-list/trip-list.component';
import { AddTripComponent } from './trips/add-trip/add-trip.component';
import { TripDetailComponent } from './trips/trip-detail/trip-detail.component';
import { EditTripComponent } from './trips/edit-trip/edit-trip.component';

import { CalendarViewComponent } from './planner/calendar-view/calendar-view.component';
import { MapViewComponent } from './planner/map-view/map-view.component';

import { DispatchOverviewComponent } from './home/dispatch-overview/dispatch-overview.component';


// NOTE: // EDIT ADDRESS COMPONENT IN ADDRESS FOLDER IS USED FOR EDITING ADDRESS OF Shipper,Receiver,FactoringCompany AND Customer


const routes: Routes = [
  {
    path: 'routing',
    children: [
      { path: 'Route-Planner', component:  RoutePlannerComponent },
      { path: 'Route-Playback', component: RoutePlaybackComponent}

    ]
  },
  {
    path: 'loads',
    children: [
      { path: 'All-Loads', component:  AllLoadsComponent },
      { path: 'Add-Load', component:  AddLoadComponent }
    ]
  },
  {
    path: 'dispatch',
    children: [
      { path: 'All-Dispatch', component:  AllDispatchComponent },
      { path: 'Dispatch-Planner', component: DispatchPlannerComponent },
      { path: 'Add-Dispatch', component: AddDispatchComponent }
        ]
  },
  {
    path: 'cross-border',
    children: [
      {path: 'eManifests', component: EManifestsComponent},
      {path: 'ACE-new-eManifest', component: NewAceManifestComponent},
      {path: 'ACE-edit-eManifest/:entryID', component: NewAceManifestComponent},
      {path: 'ACE-details/:entryID', component: AceDetailsComponent},

      {path: 'ACI-new-eManifest', component: NewAciManifestComponent},
      {path: 'ACI-edit-eManifest/:entryID', component: NewAciManifestComponent},
      {path: 'ACI-details/:entryID', component: AciDetailsComponent},
    ]
  },
  {
    path: 'load-board',
    component: LoadBoardComponent
  },
  {
    path: 'documents',
    children: [
      { path: '', component: NewDocumentsComponent},
      { path: 'my-documents', component: MyDocumentListComponent},
      { path: 'company-documents', component: CompanyDocumentsComponent }
    ]
  },
  {
    path: 'orders',
    children: [
      { path: '', component: OrdersListComponent},
      { path: 'edit/:orderID', component: AddOrdersComponent},
      { path: 'add', component: AddOrdersComponent},
      { path: 'detail/:orderID', component: OrderDetailComponent }
    ]
  },
  {
    path: 'quotes',
    children: [
      { path: '', component: QuotesListComponent},
      { path: 'add', component: AddQuotesComponent},
      { path: 'edit/:quoteID', component: AddQuotesComponent},
      { path: 'detail/:quoteID', component: QuoteDetailComponent }
    ]
  },
  {
    path: 'create-load',
    component: CreateLoadNewComponent
  },

  {
    path: 'load-detail',
    component: LoadDetailComponent
  },
  {
    path: 'routes',
    children: [
      { path: 'list', component: RouteListComponent},
      { path: 'add', component: AddRouteComponent },
      { path: 'edit/:routeID', component: AddRouteComponent},
      { path: 'detail/:routeID', component: RouteDetailComponent},
    ]
  },
  {
    path: 'trips',
    children: [
      { path: 'trip-list', component: TripListComponent},
      { path: 'add-trip', component: AddTripComponent},
      { path: 'trip-details/:tripID', component: TripDetailComponent},
      { path: 'edit-trip/:tripID', component: AddTripComponent},

    ]
  },
  {
    path: 'planner',
    children: [
      { path: 'calendar-view', component: CalendarViewComponent},
      { path: 'map-view', component: MapViewComponent},
    ]
  },
  {
    path: "overview",
    children: [
      { path: '', component: DispatchOverviewComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class DispatchRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDocumentsComponent } from './new-documents/company-documents/company-documents.component';
import { NewDocumentsComponent } from './new-documents/new-documents.component';
import { MyDocumentListComponent } from './new-documents/my-documents/my-document-list.component';
import { QuotesListComponent } from './quotes/quotes-list/quotes-list.component';
import { AddQuotesComponent } from './quotes/add-quotes/add-quotes.component';
import { QuoteDetailComponent } from './quotes/quote-detail/quote-detail.component';

import { DispatchOverviewComponent } from './home/dispatch-overview/dispatch-overview.component';
// NOTE: // EDIT ADDRESS COMPONENT IN ADDRESS FOLDER IS USED FOR EDITING ADDRESS OF Shipper,Receiver,FactoringCompany AND Customer


const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () => import('./orders/order.module').then((m) => m.OrderModule) ,
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/trip.module').then((m) => m.TripModule) ,
  },
  {
    path: 'routes',
    loadChildren: () => import('./permanent-routing/route.module').then((m) => m.RouteModule) ,
  },
  {
    path: 'planner',
    loadChildren: () => import('./planner/planner.module').then((m) => m.PlannerModule) ,
  },
  {
    path: 'cross-border',
    loadChildren: () => import('./cross-border/cross-border.module').then((m) => m.CrossBorderModule) ,
  },
  {
    path: 'documents',
    loadChildren: () => import('./new-documents/new-documents.module').then((m) => m.DocumentsModule) ,
  },
  {
    path: 'quotes',
    loadChildren: () => import('./quotes/quote.module').then((m) => m.QuoteModule) ,
  },
  {
    path: 'overview',
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

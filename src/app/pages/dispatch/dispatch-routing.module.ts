import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchOverviewComponent } from './home/dispatch-overview/dispatch-overview.component';
// NOTE: // EDIT ADDRESS COMPONENT IN ADDRESS FOLDER IS USED FOR EDITING ADDRESS OF Shipper,Receiver,FactoringCompany AND Customer


const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () => import('./orders/order.module').then((m) => m.OrderModule),
    data: { title: 'Orders' }
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/trip.module').then((m) => m.TripModule),
    data: { title: 'Trips' }
  },
  {
    path: 'routes',
    loadChildren: () => import('./permanent-routing/route.module').then((m) => m.RouteModule),
    data: { title: 'Routes' }
  },
  {
    path: 'planner',
    loadChildren: () => import('./planner/planner.module').then((m) => m.PlannerModule),
    data: { title: 'Planner' }
  },
  {
    path: 'cross-border',
    loadChildren: () => import('./cross-border/cross-border.module').then((m) => m.CrossBorderModule),
    data: { title: 'Cross Border' }
  },
  {
    path: 'documents',
    loadChildren: () => import('./new-documents/new-documents.module').then((m) => m.DocumentsModule),
  },
  {
    path: 'quotes',
    loadChildren: () => import('./quotes/quote.module').then((m) => m.QuoteModule),
  },
  {
    path: 'total-miles',
    loadChildren: () => import('./total-miles/total-miles.module').then((m) => m.TotalMilesModule),
  },
  {
    path: 'overview',
    children: [
      { path: '', component: DispatchOverviewComponent }
    ],
    data: { title: 'Overview' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class DispatchRoutingModule { }

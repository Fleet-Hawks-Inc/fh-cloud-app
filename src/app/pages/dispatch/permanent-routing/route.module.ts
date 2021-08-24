import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import {ChartsModule} from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { AddRouteComponent } from './add-route/add-route.component';
import { RouteListComponent } from './route-list/route-list.component';
import { RouteDetailComponent } from './route-detail/route-detail.component';
import { MatExpansionModule } from '@angular/material/expansion';
const routes: Routes = [
  { path: 'list', component: RouteListComponent},
  { path: 'add', component: AddRouteComponent },
  { path: 'edit/:routeID', component: AddRouteComponent},
  { path: 'detail/:routeID', component: RouteDetailComponent},
];
@NgModule({
  declarations: [
    RouteListComponent,
    AddRouteComponent,
    RouteDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    ChartsModule,
    MatExpansionModule
  ],
  providers: [unsavedChangesGuard]
})
export class RouteModule {}

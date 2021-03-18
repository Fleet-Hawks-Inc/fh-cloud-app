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
import { AddGeofenceComponent } from './add-geofence/add-geofence.component';
import { GeofenceListComponent } from './geofence-list/geofence-list.component'

const routes: Routes = [
  { path: 'add', component: AddGeofenceComponent },
  { path: 'edit/:fenceID', component: AddGeofenceComponent },
  { path: 'list', component: GeofenceListComponent },
];
@NgModule({
  declarations: [
    AddGeofenceComponent,
    GeofenceListComponent,
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
    ChartsModule
  ],
  providers: [unsavedChangesGuard]
})
export class GeofenceModule {}

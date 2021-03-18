import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {AddDriverComponent} from './add-driver/add-driver.component';
import {DriverListComponent} from './driver-list/driver-list.component';
import {DriverDetailComponent} from './driver-detail/driver-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';

const routes: Routes = [
  { path: 'add', component: AddDriverComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'edit/:driverID', component: AddDriverComponent },
  { path: 'list', component: DriverListComponent },
  { path: 'detail/:driverID', component: DriverDetailComponent}
];
@NgModule({
  declarations: [
    // AddDriverComponent,
    DriverListComponent,
    DriverDetailComponent,
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
  ],
  providers: [unsavedChangesGuard]
})
export class DriversModule {}

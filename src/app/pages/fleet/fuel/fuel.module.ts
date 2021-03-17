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
import { AddFuelEntryComponent } from './add-fuel-entry/add-fuel-entry.component';
import { FuelEntryListComponent } from './fuel-entry-list/fuel-entry-list.component'
import { FuelEntryDetailsComponent } from './fuel-entry-details/fuel-entry-details.component'

const routes: Routes = [
  {
    path: 'add',
    component: AddFuelEntryComponent,
  },
  {
    path: 'list',
    component: FuelEntryListComponent,
  },
  {
    path: 'edit/:entryID',
    component: AddFuelEntryComponent,
  },
  {
    path: 'detail/:entryID',
    component: FuelEntryDetailsComponent,
  },
];
@NgModule({
  declarations: [
    AddFuelEntryComponent,
    FuelEntryListComponent,
    FuelEntryDetailsComponent
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
export class FuelModule {}

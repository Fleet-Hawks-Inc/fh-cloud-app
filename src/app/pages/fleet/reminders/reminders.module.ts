import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { ListingComponent } from './service-reminder/listing/listing.component';
import { AddReminderComponent } from './service-reminder/add-reminder/add-reminder.component';
import { VehicleRenewListComponent } from './vehicle-renewals/vehicle-renew-list/vehicle-renew-list.component';
import { VehicleRenewAddComponent } from './vehicle-renewals/vehicle-renew-add/vehicle-renew-add.component';
import { ListContactRenewComponent } from './contact-renewals/list-contact-renew/list-contact-renew.component';
import { AddContactRenewComponent } from './contact-renewals/add-contact-renew/add-contact-renew.component';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import {ChartsModule} from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { AbsoluteValuePipe } from '../pipes/absolute-value.pipe';

const routes: Routes = [
  {
    path: 'service-reminder',
    children: [
      { path: 'list', component: ListingComponent },
      { path: 'add', component: AddReminderComponent },
      { path: 'edit/:reminderID', component: AddReminderComponent },
    ],
  },
  {
    path: 'vehicle-renewals',
    children: [
      { path: 'list', component: VehicleRenewListComponent },
      { path: 'add', component: VehicleRenewAddComponent },
      { path: 'edit/:reminderID', component: VehicleRenewAddComponent},
    ],
  },
  {
    path: 'contact-renewals',
    children: [
      { path: 'list', component: ListContactRenewComponent },
      { path: 'add', component: AddContactRenewComponent },
      { path: 'edit/:reminderID', component: AddContactRenewComponent },
    ],
  },
];
@NgModule({
  declarations: [
    ListingComponent,
    AddReminderComponent,
    VehicleRenewListComponent,
    VehicleRenewAddComponent,
    AddContactRenewComponent,
    ListContactRenewComponent,
    AbsoluteValuePipe
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
export class RemindersModule {}

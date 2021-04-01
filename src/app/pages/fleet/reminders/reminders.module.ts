import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ListingComponent } from './service-reminder/listing/listing.component';
import { AddReminderComponent } from './service-reminder/add-reminder/add-reminder.component';
import { VehicleRenewListComponent } from './vehicle-renewals/vehicle-renew-list/vehicle-renew-list.component';
import { VehicleRenewAddComponent } from './vehicle-renewals/vehicle-renew-add/vehicle-renew-add.component';
import { ListContactRenewComponent } from './contact-renewals/list-contact-renew/list-contact-renew.component';
import { AddContactRenewComponent } from './contact-renewals/add-contact-renew/add-contact-renew.component';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule } from 'ng2-charts';
import { unsavedChangesGuard } from 'src/app/guards/unsaved-changes.guard';
import { AbsoluteValuePipe } from '../pipes/absolute-value.pipe';
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string): NgbDateStruct {
    if (!value)
      return null
    let parts = value.split(this.DELIMITER);
    return {
      year: + parseInt(parts[0]),
      month: + parseInt(parts[1]),
      day: + parseInt(parts[2])
    }
  }

  toModel(date: NgbDateStruct): string // from internal model -> your mode
  {
    return date ? date.year + this.DELIMITER + ('0' + date.month).slice(-2)
      + this.DELIMITER + ('0' + date.day).slice(-2) : null
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        year: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[0], 10),

      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
  }
}
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
      { path: 'edit/:reminderID', component: VehicleRenewAddComponent },
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
  providers: [unsavedChangesGuard,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class RemindersModule { }

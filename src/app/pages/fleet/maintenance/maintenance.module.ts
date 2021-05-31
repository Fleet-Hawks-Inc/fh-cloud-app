import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { Injectable } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  ServiceProgramDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent,
} from './index';

const COMPONENTS = [
  // AddServiceProgramComponent,
  ServiceProgramListComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  ServiceProgramDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent,
];
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
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
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
    path: 'service-log',
    children: [
      { path: 'list', component: ServiceListComponent },
      { path: 'add-service', component: AddServiceComponent },
      { path: 'edit/:logID', component: AddServiceComponent },

      { path: 'detail/:logID', component: ServiceDetailComponent },

    ],
  },
  {
    path: 'service-program',
    children: [
      {
        path: 'add',
        component: AddServiceProgramComponent,
      },
      {
        path: 'list',
        component: ServiceProgramListComponent,
      },
      {
        path: 'edit/:programID',
        component: AddServiceProgramComponent,
      },
      {
        path: 'detail/:programID',
        component: ServiceProgramDetailComponent,
      },
    ],
  },
  {
    path: 'issues',
    children: [
      { path: 'list', component: IssueListComponent },
      { path: 'add', component: AddIssueComponent },
      { path: 'detail/:issueID', component: IssueDetailComponent },
      { path: 'edit/:issueID', component: AddIssueComponent },
    ],
  },

];
@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    SlickCarouselModule
  ],
  exports: [...COMPONENTS],
  providers: [{ provide: NgbDateAdapter, useClass: CustomAdapter },
  { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]

})
export class MaintenanceModule { }

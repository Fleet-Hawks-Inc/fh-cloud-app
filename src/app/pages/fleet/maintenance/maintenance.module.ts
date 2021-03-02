import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { NgSelect2Module } from 'ng-select2';
import {SlickCarouselModule} from 'ngx-slick-carousel';
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


import {SharedModule} from '../../../shared/shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {DataTablesModule} from 'angular-datatables';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NgxSpinnerModule} from 'ngx-spinner';

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
    // AddVehicleNewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DataTablesModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    NgSelect2Module,
    SlickCarouselModule
  ],
  exports: [...COMPONENTS]

})
export class MaintenanceModule {}

import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { NgSelect2Module } from 'ng-select2';
import {
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  EditServiceProgramComponent,
  AddVendorComponent,
  VendorsListComponent,
  EditVendorComponent,
  AddVehicleServiceLogComponent,
  VehicleServiceLogsComponent,
  EditVehicleServiceLogComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  ServiceProgramDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent
} from './index';

const COMPONENTS = [
  AddServiceProgramComponent,
  ServiceProgramListComponent,
  EditServiceProgramComponent,
  AddVendorComponent,
  VendorsListComponent,
  EditVendorComponent,
  AddVehicleServiceLogComponent,
  VehicleServiceLogsComponent,
  EditVehicleServiceLogComponent,
  ServiceListComponent,
  AddServiceComponent,
  ServiceDetailComponent,
  ServiceProgramDetailComponent,
  IssueListComponent,
  AddIssueComponent,
  IssueDetailComponent
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
      { path: 'service-detail', component: ServiceDetailComponent },
    ],
  },
  {
    path: 'service-program',
    children: [
      {
        path: 'Add-Service-Program',
        component: AddServiceProgramComponent,
      },
      {
        path: 'Service-Program-List',
        component: ServiceProgramListComponent,
      },
      {
        path: 'Edit-Service-Program/:programID',
        component: EditServiceProgramComponent,
      },
      {
        path: 'service-program-detail',
        component: ServiceProgramDetailComponent,
      },
    ],
  },
  {
    path: 'vendor',
    children: [
      {
        path: 'Add-Vendor',
        component: AddVendorComponent,
      },
      {
        path: 'Vendors-List',
        component: VendorsListComponent,
      },
      {
        path: 'Edit-Vendor/:vendorID',
        component: EditVendorComponent,
      },
    ],
  },
  {
    path: 'vehicle-service-log',
    children: [
      {
        path: 'Add-Vehicle-Service-Log',
        component: AddVehicleServiceLogComponent,
      },
      {
        path: 'Vehicle-Service-Logs-List',
        component: VehicleServiceLogsComponent,
      },
      {
        path: 'Edit-Vehicle-Service-Log/:logID',
        component: EditVehicleServiceLogComponent,
      },
    ],
  },
  {
    path: 'issues',
    children: [
      { path: 'list', component: IssueListComponent },
      { path: 'add-issue', component: AddIssueComponent },
      { path: 'issue-detail', component: IssueDetailComponent },
    ],
  },

];
@NgModule({
  declarations: [
    ...COMPONENTS
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
    NgSelect2Module
  ],
  exports: [...COMPONENTS]

})
export class MaintenanceModule {}

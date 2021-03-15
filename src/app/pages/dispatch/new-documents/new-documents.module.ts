import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NewDocumentsComponent } from './new-documents.component';
import { MyDocumentListComponent } from './my-documents/my-document-list.component';
import { CompanyDocumentsComponent } from './company-documents/company-documents.component';

const routes: Routes = [
  { path: '', component: NewDocumentsComponent},
  { path: 'my-documents', component: MyDocumentListComponent},
  { path: 'company-documents', component: CompanyDocumentsComponent }
];
@NgModule({
  declarations: [
    NewDocumentsComponent,
    MyDocumentListComponent,
    CompanyDocumentsComponent
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
  ],
  providers: []
})
export class DocumentsModule {}

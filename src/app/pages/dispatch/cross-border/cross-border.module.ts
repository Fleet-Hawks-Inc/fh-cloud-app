import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';

import { EManifestsComponent } from './e-manifests/e-manifests.component';
import { NewAceManifestComponent } from './ace-documents/new-ace-manifest/new-ace-manifest.component';
import { AceDetailsComponent } from './ace-documents/ace-details/ace-details.component';
import { NewAciManifestComponent } from './aci-documents/new-aci-manifest/new-aci-manifest.component';
import { AciDetailsComponent } from './aci-documents/aci-details/aci-details.component';
import {MatExpansionModule} from '@angular/material/expansion';
const routes: Routes = [
  {path: 'eManifests', component: EManifestsComponent},
  {path: 'ACE-new-eManifest', component: NewAceManifestComponent},
  {path: 'ACE-edit-eManifest/:entryID', component: NewAceManifestComponent},
  {path: 'ACE-details/:entryID', component: AceDetailsComponent},

  {path: 'ACI-new-eManifest', component: NewAciManifestComponent},
  {path: 'ACI-edit-eManifest/:entryID', component: NewAciManifestComponent},
  {path: 'ACI-details/:entryID', component: AciDetailsComponent},
];
@NgModule({
  declarations: [
    EManifestsComponent,
    NewAceManifestComponent,
    AceDetailsComponent,
    NewAciManifestComponent,
    AciDetailsComponent
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
    MatExpansionModule
  ],
  providers: []
})
export class CrossBorderModule {}

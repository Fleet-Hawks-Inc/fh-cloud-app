import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EManifestsComponent } from './e-manifests/e-manifests.component';
import { NewAceManifestComponent } from './ace-documents/new-ace-manifest/new-ace-manifest.component';
import { AceDetailsComponent } from './ace-documents/ace-details/ace-details.component';
import { NewAciManifestComponent } from './aci-documents/new-aci-manifest/new-aci-manifest.component';
import { AciDetailsComponent } from './aci-documents/aci-details/aci-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
const routes: Routes = [
  { path: 'eManifests', component: EManifestsComponent },
  { path: 'ACE-new-eManifest', component: NewAceManifestComponent },
  { path: 'ACE-edit-eManifest/:entryID', component: NewAceManifestComponent },
  { path: 'ACE-details/:entryID', component: AceDetailsComponent },

  { path: 'ACI-new-eManifest', component: NewAciManifestComponent },
  { path: 'ACI-edit-eManifest/:entryID', component: NewAciManifestComponent },
  { path: 'ACI-details/:entryID', component: AciDetailsComponent },
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
  providers: [{ provide: NgbDateAdapter, useClass: CustomAdapter },
  { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class CrossBorderModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AccordionModule } from 'primeng/accordion';
const routes: Routes = [
  { path: 'manifests', component: EManifestsComponent },
  { path: 'ace-manifest', component: NewAceManifestComponent },
  { path: 'ace-manifest/:mID', component: NewAceManifestComponent },
  { path: 'ace-details/:mID', component: AceDetailsComponent },

  { path: 'aci-manifest', component: NewAciManifestComponent },
  { path: 'aci-manifest/:mID', component: NewAciManifestComponent },
  { path: 'aci-details/:mID', component: AciDetailsComponent },
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
    TabViewModule,
    TableModule,
    NgSelectModule,
    NgxSpinnerModule,
    MatExpansionModule,
    ButtonModule,
    OverlayPanelModule,
    MultiSelectModule,
    AccordionModule,
    ConfirmPopupModule
  ],
  providers: [{ provide: NgbDateAdapter, useClass: CustomAdapter },
  { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class CrossBorderModule { }

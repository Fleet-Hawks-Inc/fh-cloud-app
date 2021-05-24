import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { ComplianceRoutingModule } from "./compliance-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    ComplianceRoutingModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    MatExpansionModule,
    NgbModule,
    NgSelectModule,
    ChartsModule
  ],
  declarations: [],
})
export class ComplianceModule {}

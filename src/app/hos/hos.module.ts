import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { HosRoutingModule } from "./hos-routing.module";
import { SummaryComponent } from "./compliance/summary/summary.component";
import { EditComponent } from "./compliance/edit/edit.component";
import { DetailedComponent } from './compliance/detailed/detailed.component';

@NgModule({
  imports: [CommonModule, HosRoutingModule, FormsModule, SharedModule],
  declarations: [SummaryComponent, EditComponent, DetailedComponent],
})
export class HosModule {}

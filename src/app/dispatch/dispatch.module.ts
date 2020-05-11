import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DispatchRoutingModule } from "./dispatch-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, DispatchRoutingModule, SharedModule, FormsModule],

  declarations: [],
})
export class DispatchModule {}

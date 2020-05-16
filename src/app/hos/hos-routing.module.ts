import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SummaryComponent } from "./compliance/summary/summary.component";
import { EditComponent } from "./compliance/edit/edit.component";
import { DetailedComponent } from "./compliance/detailed/detailed.component";

const routes: Routes = [
  {
    path: 'compliance',
    children: [
      { path: 'summary', component: SummaryComponent },
      { path: 'edit/:userName/:eventDate', component: EditComponent },
      { path: 'detailed', component: DetailedComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HosRoutingModule {}

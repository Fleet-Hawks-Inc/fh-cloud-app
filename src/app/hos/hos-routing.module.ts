import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from "./compliance/summary/summary.component";
import { DetailComponent } from "./compliance/detail/detail.component";

const routes: Routes = [
  {
    path: "compliance",
    children: [
      { path: "summary", component: SummaryComponent },
      { path: "detail/:userName/:date", component: DetailComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HosRoutingModule { }
